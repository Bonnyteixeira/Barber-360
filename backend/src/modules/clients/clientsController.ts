import { Response, NextFunction } from 'express';
import { TenantRequest } from '../../shared/middlewares/tenant.js';
import { getDbPool } from '../../database/connection.js';

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
        'SELECT id, name, email, phone, avatar_url, created_at FROM clients WHERE tenant_id = $1 AND deleted_at IS NULL ORDER BY name ASC',
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
      const { name, email, phone, avatar_url } = req.body;

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
        'INSERT INTO clients (tenant_id, name, email, phone, avatar_url) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [tenantId, name, email || null, phone, avatar_url || null]
      );

      return res.status(201).json({
        success: true,
        data: queryResult.rows[0],
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
      const { name, email, phone, avatar_url } = req.body;

      if (!tenantId) {
        return res.status(400).json({
          success: false,
          data: null,
          message: 'Tenant context error.',
          errors: ['Tenant context error']
        });
      }

      const check = await pool.query('SELECT id FROM clients WHERE id = $1 AND tenant_id = $2', [id, tenantId]);
      if (check.rows.length === 0) {
        return res.status(404).json({
          success: false,
          data: null,
          message: 'Cliente não localizado.',
          errors: ['Client not found']
        });
      }

      const results = await pool.query(
        `UPDATE clients 
         SET name = COALESCE($1, name), 
             email = COALESCE($2, email), 
             phone = COALESCE($3, phone), 
             avatar_url = COALESCE($4, avatar_url),
             updated_at = NOW()
         WHERE id = $5 AND tenant_id = $6 RETURNING *`,
        [name, email, phone, avatar_url, id, tenantId]
      );

      return res.json({
        success: true,
        data: results.rows[0],
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
