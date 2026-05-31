import { Response, NextFunction } from 'express';
import { TenantRequest } from '../../shared/middlewares/tenant.js';
import { getDbPool } from '../../database/connection.js';

export class FinancialController {
  
  // 1. Log a cashflow entry (revenue or expense)
  static async addEntry(req: TenantRequest, res: Response, next: NextFunction) {
    const pool = getDbPool();
    try {
      const tenantId = req.tenantId;
      const { type, category, amount, description, entry_date } = req.body;

      if (!tenantId) {
        return res.status(400).json({
          success: false,
          data: null,
          message: 'Falta o contexto do Tenant.',
          errors: ['Tenant context error']
        });
      }

      if (!type || !category || amount === undefined) {
        return res.status(400).json({
          success: false,
          data: null,
          message: 'Os campos type (revenue ou expense), category e amount são obrigatórios.',
          errors: ['Missing financial inputs']
        });
      }

      if (type !== 'revenue' && type !== 'expense') {
        return res.status(400).json({
          success: false,
          data: null,
          message: 'Tipo de lançamento deve ser revenue (Receita) ou expense (Despesa).',
          errors: ['Invalid type selection']
        });
      }

      const numAmount = parseFloat(amount);
      if (numAmount <= 0) {
        return res.status(400).json({
          success: false,
          data: null,
          message: 'O montante financeiro da transação deve ser estritamente maior que zero.',
          errors: ['Invalid amount check']
        });
      }

      const date = entry_date ? new Date(entry_date) : new Date();

      const queryResult = await pool.query(
        `INSERT INTO financial_entries (tenant_id, type, category, amount, description, entry_date)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [tenantId, type, category, numAmount, description || null, date.toISOString()]
      );

      return res.status(201).json({
        success: true,
        data: queryResult.rows[0],
        message: `${type === 'revenue' ? 'Receita' : 'Despesa'} lançada com sucesso.`,
        errors: []
      });
    } catch (e) {
      next(e);
    }
  }

  // 2. Fetch cashflow history list
  static async listEntries(req: TenantRequest, res: Response, next: NextFunction) {
    const pool = getDbPool();
    try {
      const tenantId = req.tenantId;
      if (!tenantId) {
        return res.status(400).json({
          success: false,
          data: null,
          message: 'Mapeamento de TenantId em falta.',
          errors: ['Tenant ID missing']
        });
      }

      const results = await pool.query(
        'SELECT id, type, category, amount, description, entry_date FROM financial_entries WHERE tenant_id = $1 ORDER BY entry_date DESC',
        [tenantId]
      );

      return res.json({
        success: true,
        data: results.rows,
        message: 'Lançamentos financeiros listados.',
        errors: []
      });
    } catch (e) {
      next(e);
    }
  }

  // 3. List barber commissions
  static async listCommissions(req: TenantRequest, res: Response, next: NextFunction) {
    const pool = getDbPool();
    try {
      const tenantId = req.tenantId;
      const { status, barber_id } = req.query;

      if (!tenantId) {
        return res.status(400).json({
          success: false,
          data: null,
          message: 'Tenant context error.',
          errors: ['Tenant mapping error']
        });
      }

      let sql = `
        SELECT c.id, c.commission_percentage, c.amount, c.status, c.created_at,
               b.name as barber_name,
               a.start_time as appointment_date,
               s.name as service_name
        FROM commissions c
        JOIN barbers b ON c.barber_id = b.id
        LEFT JOIN appointments a ON c.appointment_id = a.id
        LEFT JOIN services s ON a.service_id = s.id
        WHERE c.tenant_id = $1
      `;
      const params: any[] = [tenantId];
      let counter = 1;

      if (status) {
        counter++;
        sql += ` AND c.status = $${counter}`;
        params.push(status);
      }

      if (barber_id) {
        counter++;
        sql += ` AND c.barber_id = $${counter}`;
        params.push(barber_id);
      }

      sql += ' ORDER BY c.created_at DESC';

      const results = await pool.query(sql, params);

      return res.json({
        success: true,
        data: results.rows,
        message: 'Lista de comissões carregada com sucesso.',
        errors: []
      });
    } catch (e) {
      next(e);
    }
  }

  // 4. Settle/Pay commission to barcode
  static async payCommission(req: TenantRequest, res: Response, next: NextFunction) {
    const pool = getDbPool();
    try {
      const tenantId = req.tenantId;
      const { id } = req.params;

      if (!tenantId) {
        return res.status(400).json({
          success: false,
          data: null,
          message: 'Tenant_id não especificado.',
          errors: ['Tenant context error']
        });
      }

      const commissionCheck = await pool.query(
        'SELECT id, status FROM commissions WHERE id = $1 AND tenant_id = $2',
        [id, tenantId]
      );

      if (commissionCheck.rows.length === 0) {
        return res.status(404).json({
          success: false,
          data: null,
          message: 'Registro de comissão não localizado.',
          errors: ['Commission not found']
        });
      }

      if (commissionCheck.rows[0].status === 'paid') {
        return res.status(422).json({
          success: false,
          data: null,
          message: 'Esta comissão já se encontra paga para o profissional.',
          errors: ['Commission already settled']
        });
      }

      await pool.query(
        'UPDATE commissions SET status = \'paid\', updated_at = NOW() WHERE id = $1 AND tenant_id = $2',
        [id, tenantId]
      );

      return res.json({
        success: true,
        data: null,
        message: 'Comissão quitada e liquidada com sucesso.',
        errors: []
      });
    } catch (e) {
      next(e);
    }
  }
}
