import { Response, NextFunction } from 'express';
import { TenantRequest } from '../../../shared/middlewares/tenant.js';
import { getDbPool } from '../../../database/connection.js';

export class BillingController {
  
  // 1. Fetch available SaaS plans
  static async listPlans(req: TenantRequest, res: Response, next: NextFunction) {
    try {
      const plans = [
        { id: 'silver', name: 'Plano Silver', price: 99.00, max_barbers: 3 },
        { id: 'gold', name: 'Plano Gold (Recomendado)', price: 189.00, max_barbers: 8 },
        { id: 'enterprise', name: 'Plano Enterprise', price: 349.00, max_barbers: 99 }
      ];

      return res.json({
        success: true,
        data: plans,
        message: 'Planos disponíveis do Barber 360.',
        errors: []
      });
    } catch (e) {
      next(e);
    }
  }

  // 2. Fetch current active subscription of tenant
  static async getSubscription(req: TenantRequest, res: Response, next: NextFunction) {
    const pool = getDbPool();
    try {
      const tenantId = req.tenantId;
      if (!tenantId) {
        return res.status(400).json({ success: false, message: 'Tenant context error.' });
      }

      // Fetch active subscription
      const result = await pool.query('SELECT status FROM tenants WHERE id = $1', [tenantId]);
      
      return res.json({
        success: true,
        data: {
          status: result.rows[0]?.status || 'trial',
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        },
        message: 'Inscrição empresarial ativa.',
        errors: []
      });
    } catch (e) {
      next(e);
    }
  }
}
