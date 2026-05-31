import { Response, NextFunction } from 'express';
import { TenantRequest } from '../../../shared/middlewares/tenant.js';
import { getDbPool } from '../../../database/connection.js';
import { eventBus } from '../../../shared/events/eventBus.js';

export class ClientsController {
  
  // 1. List clients belongs to tenant
  static async list(req: TenantRequest, res: Response, next: NextFunction) {
    const pool = getDbPool();
    try {
      const tenantId = req.tenantId;
      if (!tenantId) {
        return res.status(400).json({
          success: false,
          data: null,
          message: 'Falta o parâmetro tenant_id.',
          errors: ['Tenant context error']
        });
      }

      const results = await pool.query(
        'SELECT id, name, email, phone, avatar_url, classification, total_spent, appointments_count, last_appointment_date, created_at FROM clients WHERE tenant_id = $1 AND deleted_at IS NULL ORDER BY name ASC',
        [tenantId]
      );

      return res.json({
        success: true,
        data: results.rows,
        message: 'Lista de clientes do salão recuperada.',
        errors: []
      });
    } catch (e) {
      next(e);
    }
  }

  // 2. Add client to tenant
  static async create(req: TenantRequest, res: Response, next: NextFunction) {
    const pool = getDbPool();
    try {
      const tenantId = req.tenantId;
      const { name, email, phone, avatar_url, classification } = req.body;

      if (!tenantId) {
        return res.status(400).json({
          success: false,
          data: null,
          message: 'Sem tenant id configurado.',
          errors: ['No tenantContext mapped']
        });
      }

      if (!name || !phone) {
        return res.status(400).json({
          success: false,
          data: null,
          message: 'Os campos nome e celular (WhatsApp) são obrigatórios para agendar.',
          errors: ['name and phone required']
        });
      }

      const queryResult = await pool.query(
        `INSERT INTO clients (tenant_id, name, email, phone, avatar_url, classification) 
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [tenantId, name, email || null, phone, avatar_url || null, classification || 'regular']
      );

      const newClient = queryResult.rows[0];

      // Publish event
      eventBus.publish('client.created', newClient);

      return res.status(201).json({
        success: true,
        data: newClient,
        message: 'Cliente cadastrado com sucesso.',
        errors: []
      });
    } catch (e) {
      next(e);
    }
  }

  // 3. Edit properties of a client
  static async update(req: TenantRequest, res: Response, next: NextFunction) {
    const pool = getDbPool();
    try {
      const tenantId = req.tenantId;
      const { id } = req.params;
      const { name, email, phone, avatar_url, classification } = req.body;

      if (!tenantId) {
        return res.status(400).json({
          success: false,
          data: null,
          message: 'Tenant context error.',
          errors: ['Tenant context error']
        });
      }

      const check = await pool.query('SELECT id, classification FROM clients WHERE id = $1 AND tenant_id = $2', [id, tenantId]);
      if (check.rows.length === 0) {
        return res.status(404).json({
          success: false,
          data: null,
          message: 'Cliente não localizado.',
          errors: ['Client not found']
        });
      }

      const oldClient = check.rows[0];

      const results = await pool.query(
        `UPDATE clients 
         SET name = COALESCE($1, name), 
             email = COALESCE($2, email), 
             phone = COALESCE($3, phone), 
             avatar_url = COALESCE($4, avatar_url),
             classification = COALESCE($5, classification),
             updated_at = NOW()
         WHERE id = $6 AND tenant_id = $7 RETURNING *`,
        [name, email, phone, avatar_url, classification, id, tenantId]
      );

      const updatedClient = results.rows[0];

      // Publish loyalty transition events
      if (classification && classification !== oldClient.classification) {
        if (classification === 'vip') {
          eventBus.publish('client.vip', updatedClient);
        } else if (classification === 'inactive') {
          eventBus.publish('client.inactive', updatedClient);
        }
      }

      return res.json({
        success: true,
        data: updatedClient,
        message: 'Ficha do cliente atualizada com sucesso.',
        errors: []
      });
    } catch (e) {
      next(e);
    }
  }

  // 4. Soft Delete a client
  static async delete(req: TenantRequest, res: Response, next: NextFunction) {
    const pool = getDbPool();
    try {
      const tenantId = req.tenantId;
      const { id } = req.params;

      if (!tenantId) {
        return res.status(400).json({
          success: false,
          data: null,
          message: 'Tenant_id não especificado.',
          errors: ['Tenant ID missing']
        });
      }

      const check = await pool.query('SELECT id FROM clients WHERE id = $1 AND tenant_id = $2 AND deleted_at IS NULL', [id, tenantId]);
      if (check.rows.length === 0) {
        return res.status(404).json({
          success: false,
          data: null,
          message: 'O cliente requerido não existe ou já foi excluído.',
          errors: ['Client not found']
        });
      }

      await pool.query(
        'UPDATE clients SET deleted_at = NOW(), updated_at = NOW() WHERE id = $1 AND tenant_id = $2',
        [id, tenantId]
      );

      return res.json({
        success: true,
        data: null,
        message: 'Cliente removido com sucesso.',
        errors: []
      });
    } catch (e) {
      next(e);
    }
  }
}
