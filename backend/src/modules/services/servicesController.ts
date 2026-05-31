import { Response, NextFunction } from 'express';
import { TenantRequest } from '../../shared/middlewares/tenant.js';
import { getDbPool } from '../../database/connection.js';

export class ServicesController {
  
  // 1. List services belonging to tenant
  static async list(req: TenantRequest, res: Response, next: NextFunction) {
    const pool = getDbPool();
    try {
      const tenantId = req.tenantId;
      if (!tenantId) {
        return res.status(400).json({
          success: false,
          data: null,
          message: 'Segmentação por tenant_id é necessária.',
          errors: ['Tenant context error']
        });
      }

      const results = await pool.query(
        'SELECT id, name, price, duration, category, created_at FROM services WHERE tenant_id = $1 AND deleted_at IS NULL ORDER BY name ASC',
        [tenantId]
      );

      return res.json({
        success: true,
        data: results.rows,
        message: 'Catálogo de serviços recuperado com sucesso.',
        errors: []
      });
    } catch (e) {
      next(e);
    }
  }

  // 2. Create service
  static async create(req: TenantRequest, res: Response, next: NextFunction) {
    const pool = getDbPool();
    try {
      const tenantId = req.tenantId;
      const { name, price, duration, category } = req.body;

      if (!tenantId) {
        return res.status(400).json({
          success: false,
          data: null,
          message: 'Tenant context error.',
          errors: ['Tenant context error']
        });
      }

      if (!name || price === undefined) {
        return res.status(400).json({
          success: false,
          data: null,
          message: 'O nome do serviço e o preço de venda são de preenchimento obrigatório.',
          errors: ['name and price are required']
        });
      }

      const parsedPrice = parseFloat(price);
      if (parsedPrice <= 0) {
        return res.status(400).json({
          success: false,
          data: null,
          message: 'O valor do serviço deve ser estritamente superior a R$ 0.00.',
          errors: ['Price constraint broken']
        });
      }

      const parsedDuration = duration ? parseInt(duration) : 30;

      const queryResult = await pool.query(
        'INSERT INTO services (tenant_id, name, price, duration, category) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [tenantId, name, parsedPrice, parsedDuration, category || 'cabelo']
      );

      return res.status(201).json({
        success: true,
        data: queryResult.rows[0],
        message: 'Serviço catalogado com sucesso.',
        errors: []
      });
    } catch (e) {
      next(e);
    }
  }

  // 3. Edit service catalog properties
  static async update(req: TenantRequest, res: Response, next: NextFunction) {
    const pool = getDbPool();
    try {
      const tenantId = req.tenantId;
      const { id } = req.params;
      const { name, price, duration, category } = req.body;

      if (!tenantId) {
        return res.status(400).json({
          success: false,
          data: null,
          message: 'Falta o parâmetro tenant_id.',
          errors: ['Tenant error']
        });
      }

      const check = await pool.query('SELECT id FROM services WHERE id = $1 AND tenant_id = $2', [id, tenantId]);
      if (check.rows.length === 0) {
        return res.status(404).json({
          success: false,
          data: null,
          message: 'Serviço mercantil não localizado.',
          errors: ['Service not found']
        });
      }

      if (price !== undefined && parseFloat(price) <= 0) {
        return res.status(400).json({
          success: false,
          data: null,
          message: 'O valor de venda deve ser maior que R$ 0.00.',
          errors: ['Price constraint broken']
        });
      }

      const results = await pool.query(
        `UPDATE services 
         SET name = COALESCE($1, name), 
             price = COALESCE($2, price), 
             duration = COALESCE($3, duration), 
             category = COALESCE($4, category),
             updated_at = NOW()
         WHERE id = $5 AND tenant_id = $6 RETURNING *`,
        [name, price, duration, category, id, tenantId]
      );

      return res.json({
        success: true,
        data: results.rows[0],
        message: 'Serviço atualizado com sucesso.',
        errors: []
      });
    } catch (e) {
      next(e);
    }
  }

  // 4. Soft delete catalog item
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
          errors: ['Tenant context error']
        });
      }

      const check = await pool.query('SELECT id FROM services WHERE id = $1 AND tenant_id = $2 AND deleted_at IS NULL', [id, tenantId]);
      if (check.rows.length === 0) {
        return res.status(404).json({
          success: false,
          data: null,
          message: 'Este serviço não existe ou já foi excluído.',
          errors: ['Service not found']
        });
      }

      await pool.query(
        'UPDATE services SET deleted_at = NOW(), updated_at = NOW() WHERE id = $1 AND tenant_id = $2',
        [id, tenantId]
      );

      return res.json({
        success: true,
        data: null,
        message: 'Serviço desativado no catálogo com sucesso.',
        errors: []
      });
    } catch (e) {
      next(e);
    }
  }
}
