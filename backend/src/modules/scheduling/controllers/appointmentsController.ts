import { Response, NextFunction } from 'express';
import { TenantRequest } from '../../../shared/middlewares/tenant.js';
import { getDbPool } from '../../../database/connection.js';
import { eventBus } from '../../../shared/events/eventBus.js';

export class AppointmentsController {
  
  // 1. List agenda bookings
  static async list(req: TenantRequest, res: Response, next: NextFunction) {
    const pool = getDbPool();
    try {
      const tenantId = req.tenantId;
      const { barber_id, client_id, start_date, end_date, status } = req.query;

      if (!tenantId) {
        return res.status(400).json({
          success: false,
          data: null,
          message: 'Segmentação por tenant_id é necessária.',
          errors: ['Tenant context error']
        });
      }

      let sql = `
        SELECT a.id, a.start_time, a.end_time, a.status, a.total_price, a.notes, a.created_at,
               b.name as barber_name,
               c.name as client_name, c.phone as client_phone,
               s.name as service_name, s.duration as service_duration
        FROM appointments a
        JOIN barbers b ON a.barber_id = b.id
        JOIN clients c ON a.client_id = c.id
        JOIN services s ON a.service_id = s.id
        WHERE a.tenant_id = $1
      `;
      const params: any[] = [tenantId];
      let paramCount = 1;

      if (barber_id) {
        paramCount++;
        sql += ` AND a.barber_id = $${paramCount}`;
        params.push(barber_id);
      }

      if (client_id) {
        paramCount++;
        sql += ` AND a.client_id = $${paramCount}`;
        params.push(client_id);
      }

      if (status) {
        paramCount++;
        sql += ` AND a.status = $${paramCount}`;
        params.push(status);
      }

      if (start_date) {
        paramCount++;
        sql += ` AND a.start_time >= $${paramCount}`;
        params.push(start_date);
      }

      if (end_date) {
        paramCount++;
        sql += ` AND a.start_time <= $${paramCount}`;
        params.push(end_date);
      }

      sql += ' ORDER BY a.start_time ASC';

      const results = await pool.query(sql, params);

      return res.json({
        success: true,
        data: results.rows,
        message: 'Agenda carregada com sucesso.',
        errors: []
      });
    } catch (e) {
      next(e);
    }
  }

  // 2. Create high integrity booking with conflict detection
  static async create(req: TenantRequest, res: Response, next: NextFunction) {
    const pool = getDbPool();
    const client = await pool.connect();
    
    try {
      const tenantId = req.tenantId;
      const { barber_id, client_id, service_id, start_time, notes } = req.body;

      if (!tenantId) {
        return res.status(400).json({
          success: false,
          data: null,
          message: 'Tenant context error.',
          errors: ['Tenant context error']
        });
      }

      if (!barber_id || !client_id || !service_id || !start_time) {
        return res.status(400).json({
          success: false,
          data: null,
          message: 'Todos os campos (barber_id, client_id, service_id, start_time) são obrigatórios.',
          errors: ['Missing payload parameters']
        });
      }

      await client.query('BEGIN');

      // 1. Fetch and verify service particulars
      const serviceRes = await client.query('SELECT name, price, duration FROM services WHERE id = $1 AND tenant_id = $2 AND deleted_at IS NULL', [service_id, tenantId]);
      if (serviceRes.rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(404).json({
          success: false,
          data: null,
          message: 'O serviço selecionado não foi localizado ou não está mais ativo.',
          errors: ['Service not found']
        });
      }
      const service = serviceRes.rows[0];

      // 2. Fetch and verify barber
      const barberRes = await client.query('SELECT id, name, commission_rate, is_available FROM barbers WHERE id = $1 AND tenant_id = $2 AND deleted_at IS NULL', [barber_id, tenantId]);
      if (barberRes.rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(404).json({
          success: false,
          data: null,
          message: 'O barbeiro selecionado não existe ou não está mais disponível.',
          errors: ['Barber not found']
        });
      }
      const barber = barberRes.rows[0];
      if (!barber.is_available) {
        await client.query('ROLLBACK');
        return res.status(409).json({
          success: false,
          data: null,
          message: `O barbeiro '${barber.name}' não está com a escala ativa para este dia.`,
          errors: ['Barber unavailable']
        });
      }

      // 3. Compute times
      const start = new Date(start_time);
      const minutesToAdd = service.duration;
      const end = new Date(start.getTime() + minutesToAdd * 60 * 1000);

      // 4. Validate booking overlaps on barber timezone (BARBER CONFLICT CHECK)
      const conflictRes = await client.query(
        `SELECT id FROM appointments 
         WHERE barber_id = $1 
           AND tenant_id = $2 
           AND status != 'canceled'
           AND (
             (start_time <= $3 AND end_time > $3) OR
             (start_time < $4 AND end_time >= $4) OR
             (start_time >= $3 AND end_time <= $4)
           )`,
        [barber_id, tenantId, start.toISOString(), end.toISOString()]
      );

      if (conflictRes.rows.length > 0) {
        await client.query('ROLLBACK');
        return res.status(409).json({
          success: false,
          data: null,
          message: `Conflito de agenda. O barbeiro '${barber.name}' já possui um atendimento marcado neste intervalo de horário especificado.`,
          errors: ['Schedule time overlap conflict']
        });
      }

      // 5. Insert booking
      const appResult = await client.query(
        `INSERT INTO appointments (tenant_id, barber_id, client_id, service_id, start_time, end_time, status, total_price, notes)
         VALUES ($1, $2, $3, $4, $5, $6, 'scheduled', $7, $8) RETURNING *`,
        [tenantId, barber_id, client_id, service_id, start.toISOString(), end.toISOString(), service.price, notes || null]
      );
      const appointment = appResult.rows[0];

      // 6. Automatically calculate and record Pending commission
      const commissionPercentage = barber.commission_rate;
      const commissionAmount = (service.price * (commissionPercentage / 100)).toFixed(2);

      await client.query(
        `INSERT INTO commissions (tenant_id, barber_id, appointment_id, commission_percentage, amount, status)
         VALUES ($1, $2, $3, $4, $5, 'pending')`,
        [tenantId, barber_id, appointment.id, commissionPercentage, commissionAmount]
      );

      // Audit Log
      await client.query(
        'INSERT INTO audit_logs (tenant_id, user_id, action, entity, entity_id, ip_address) VALUES ($1, $2, $3, $4, $5, $6)',
        [tenantId, req.userClaims?.id || null, 'CREATE_APPOINTMENT', 'appointments', appointment.id, req.ip || '127.0.0.1']
      );

      await client.query('COMMIT');

      // Publish event internally to reactive consumers
      eventBus.publish('appointment.created', {
        id: appointment.id,
        tenantId: appointment.tenant_id,
        barberId: appointment.barber_id,
        clientId: appointment.client_id,
        serviceId: appointment.service_id,
        startTime: appointment.start_time,
        totalPrice: appointment.total_price
      });

      return res.status(201).json({
        success: true,
        data: appointment,
        message: 'Reserva agendada com êxito na plataforma.',
        errors: []
      });

    } catch (e) {
      await client.query('ROLLBACK');
      next(e);
    } finally {
      client.release();
    }
  }

  // 3. Mark booking as cancelled
  static async cancel(req: TenantRequest, res: Response, next: NextFunction) {
    const pool = getDbPool();
    const client = await pool.connect();
    try {
      const tenantId = req.tenantId;
      const { id } = req.params;

      if (!tenantId) {
        return res.status(400).json({
          success: false,
          data: null,
          message: 'Tenant context error.',
          errors: ['Tenant context error']
        });
      }

      await client.query('BEGIN');

      const appCheck = await client.query('SELECT * FROM appointments WHERE id = $1 AND tenant_id = $2', [id, tenantId]);
      if (appCheck.rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(404).json({
          success: false,
          data: null,
          message: 'Agendamento não localizado no provedor.',
          errors: ['Appointment not found']
        });
      }

      const appointment = appCheck.rows[0];

      if (appointment.status === 'canceled') {
        await client.query('ROLLBACK');
        return res.status(422).json({
          success: false,
          data: null,
          message: 'Este agendamento já se encontra cancelado.',
          errors: ['Appointment already canceled']
        });
      }

      // Update state
      await client.query('UPDATE appointments SET status = \'canceled\', updated_at = NOW() WHERE id = $1 AND tenant_id = $2', [id, tenantId]);

      // Soft cancel corresponding commission
      await client.query('DELETE FROM commissions WHERE appointment_id = $1 AND tenant_id = $2', [id, tenantId]);

      // Record Audit
      await client.query(
        'INSERT INTO audit_logs (tenant_id, user_id, action, entity, entity_id, ip_address) VALUES ($1, $2, $3, $4, $5, $6)',
        [tenantId, req.userClaims?.id || null, 'CANCEL_APPOINTMENT', 'appointments', id, req.ip || '127.0.0.1']
      );

      await client.query('COMMIT');

      // Publish event internally
      eventBus.publish('appointment.cancelled', {
        id: appointment.id,
        tenantId: appointment.tenant_id,
        barberId: appointment.barber_id,
        clientId: appointment.client_id,
        serviceId: appointment.service_id,
        startTime: appointment.start_time,
        totalPrice: appointment.total_price
      });

      return res.json({
        success: true,
        data: null,
        message: 'Agendamento cancelado com sucesso. Comissões associadas revogadas.',
        errors: []
      });
    } catch (e) {
      await client.query('ROLLBACK');
      next(e);
    } finally {
      client.release();
    }
  }
}
