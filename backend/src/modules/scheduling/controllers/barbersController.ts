import { Response, NextFunction } from 'express';
import { TenantRequest } from '../../../shared/middlewares/tenant.js';
import { getDbPool } from '../../../database/connection.js';

export class BarbersController {
  
  // 1. List all barbers of the active tenant
  static async list(req: TenantRequest, res: Response, next: NextFunction) {
    const pool = getDbPool();
    try {
      const tenantId = req.tenantId;
      if (!tenantId) {
        return res.status(400).json({
          success: false,
          data: null,
          message: 'Parâmetro tenant_id não mapeado no contexto.',
          errors: ['Tenant ID missing']
        });
      }

      const results = await pool.query(
        'SELECT id, name, specialties, commission_rate, is_available, created_at FROM barbers WHERE tenant_id = $1 AND deleted_at IS NULL ORDER BY name ASC',
        [tenantId]
      );

      return res.json({
        success: true,
        data: results.rows,
        message: 'Lista de barbeiros recuperada com sucesso.',
        errors: []
      });
    } catch (e) {
      next(e);
    }
  }

  // 2. Create a new barber in our active tenant
  static async create(req: TenantRequest, res: Response, next: NextFunction) {
    const pool = getDbPool();
    try {
      const tenantId = req.tenantId;
      const { name, specialties, commission_rate, userId } = req.body;

      if (!tenantId) {
        return res.status(400).json({
          success: false,
          data: null,
          message: 'Parâmetro tenant_id não mapeado no contexto da requisição.',
          errors: ['Tenant ID context missing']
        });
      }

      if (!name) {
        return res.status(400).json({
          success: false,
          data: null,
          message: 'O campo name é obrigatório para cadastrar um barbeiro.',
          errors: ['Barber name missing']
        });
      }

      const rate = commission_rate !== undefined ? parseFloat(commission_rate) : 50.00;
      if (rate < 0 || rate > 100) {
        return res.status(400).json({
          success: false,
          data: null,
          message: 'A taxa de comissão do barbeiro deve estar compreendida entre 0.00% e 100.00%.',
          errors: ['Invalid commission range']
        });
      }

      const queryResult = await pool.query(
        'INSERT INTO barbers (tenant_id, user_id, name, specialties, commission_rate, is_available) VALUES ($1, $2, $3, $4, $5, TRUE) RETURNING *',
        [tenantId, userId || null, name, specialties || [], rate]
      );

      // Audit log creation
      await pool.query(
        'INSERT INTO audit_logs (tenant_id, user_id, action, entity, entity_id, ip_address) VALUES ($1, $2, $3, $4, $5, $6)',
        [tenantId, req.userClaims?.id || null, 'CREATE_BARBER', 'barbers', queryResult.rows[0].id, req.ip || '127.0.0.1']
      );

      return res.status(201).json({
        success: true,
        data: queryResult.rows[0],
        message: 'Barbeiro adicionado com sucesso ao estabelecimento.',
        errors: []
      });
    } catch (e) {
      next(e);
    }
  }

  // 3. Edit properties of a barber
  static async update(req: TenantRequest, res: Response, next: NextFunction) {
    const pool = getDbPool();
    try {
      const tenantId = req.tenantId;
      const { id } = req.params;
      const { name, specialties, commission_rate, is_available } = req.body;

      if (!tenantId) {
        return res.status(400).json({
          success: false,
          data: null,
          message: 'Tenant ID não especificado.',
          errors: ['Tenant context error']
        });
      }

      // Precheck ownership
      const preCheck = await pool.query('SELECT id FROM barbers WHERE id = $1 AND tenant_id = $2', [id, tenantId]);
      if (preCheck.rows.length === 0) {
        return res.status(404).json({
          success: false,
          data: null,
          message: 'Barbeiro não localizado pertencente a esta conta.',
          errors: ['Barber not found']
        });
      }

      const results = await pool.query(
        `UPDATE barbers 
         SET name = COALESCE($1, name), 
             specialties = COALESCE($2, specialties), 
             commission_rate = COALESCE($3, commission_rate), 
             is_available = COALESCE($4, is_available),
             updated_at = NOW()
         WHERE id = $5 AND tenant_id = $6 RETURNING *`,
        [name, specialties, commission_rate, is_available, id, tenantId]
      );

      return res.json({
        success: true,
        data: results.rows[0],
        message: 'Dados do barbeiro atualizados com sucesso.',
        errors: []
      });
    } catch (e) {
      next(e);
    }
  }

  // 4. Soft Delete a barber
  static async delete(req: TenantRequest, res: Response, next: NextFunction) {
    const pool = getDbPool();
    try {
      const tenantId = req.tenantId;
      const { id } = req.params;

      if (!tenantId) {
        return res.status(400).json({
          success: false,
          data: null,
          message: 'Contexto do tenant ausente.',
          errors: ['Tenant ID context missing']
        });
      }

      const preCheck = await pool.query('SELECT id FROM barbers WHERE id = $1 AND tenant_id = $2 AND deleted_at IS NULL', [id, tenantId]);
      if (preCheck.rows.length === 0) {
        return res.status(404).json({
          success: false,
          data: null,
          message: 'O barbeiro solicitado não existe ou já foi excluído.',
          errors: ['Barber not found']
        });
      }

      await pool.query(
        'UPDATE barbers SET deleted_at = NOW(), is_available = FALSE, updated_at = NOW() WHERE id = $1 AND tenant_id = $2',
        [id, tenantId]
      );

      // Audit removal
      await pool.query(
        'INSERT INTO audit_logs (tenant_id, user_id, action, entity, entity_id, ip_address) VALUES ($1, $2, $3, $4, $5, $6)',
        [tenantId, req.userClaims?.id || null, 'DELETE_BARBER', 'barbers', id, req.ip || '127.0.0.1']
      );

      return res.json({
        success: true,
        data: null,
        message: 'Barbeiro removido do salão com sucesso.',
        errors: []
      });
    } catch (e) {
      next(e);
    }
  }
}
