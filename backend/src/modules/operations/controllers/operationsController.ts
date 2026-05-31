import { Response, NextFunction } from 'express';
import { TenantRequest } from '../../../shared/middlewares/tenant.js';
import { getDbPool } from '../../../database/connection.js';

export class OperationsController {
  
  // 1. Fetch system audit logs for operations transparency
  static async getAuditLogs(req: TenantRequest, res: Response, next: NextFunction) {
    const pool = getDbPool();
    try {
      const results = await pool.query(
        'SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 50'
      );

      return res.json({
        success: true,
        data: results.rows,
        message: 'Trilha de auditoria carregada.',
        errors: []
      });
    } catch (e) {
      next(e);
    }
  }

  // 2. Fetch platform health/telemetry
  static async getPlatformStats(req: TenantRequest, res: Response, next: NextFunction) {
    const pool = getDbPool();
    try {
      const tenantsCount = await pool.query('SELECT COUNT(*)::int as count FROM tenants');
      
      return res.json({
        success: true,
        data: {
          total_tenants: tenantsCount.rows[0]?.count || 0,
          api_status: 'online',
          database_connection: 'pool_established'
        },
        message: 'Status do ecossistema recuperado.',
        errors: []
      });
    } catch (e) {
      next(e);
    }
  }
}
