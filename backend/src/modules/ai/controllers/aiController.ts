import { Response, NextFunction } from 'express';
import { TenantRequest } from '../../../shared/middlewares/tenant.js';
import { getDbPool } from '../../../database/connection.js';

export class AiController {
  
  // 1. Get current AI setup
  static async getConfig(req: TenantRequest, res: Response, next: NextFunction) {
    const pool = getDbPool();
    try {
      const tenantId = req.tenantId;
      if (!tenantId) {
        return res.status(400).json({ success: false, message: 'Tenant required.' });
      }

      const results = await pool.query(
        'SELECT * FROM ai_configurations WHERE tenant_id = $1',
        [tenantId]
      );

      return res.json({
        success: true,
        data: results.rows[0] || {
          agent_name: 'Atendente Virtual',
          personality: 'friendly',
          custom_rules: '',
          trigger_reactivation_days: 30,
          is_active: true
        },
        message: 'Configurações de IA carregadas.',
        errors: []
      });
    } catch (e) {
      next(e);
    }
  }

  // 2. Save active personality/prompt parameters
  static async updateConfig(req: TenantRequest, res: Response, next: NextFunction) {
    const pool = getDbPool();
    try {
      const tenantId = req.tenantId;
      const { agent_name, personality, custom_rules, trigger_reactivation_days, is_active } = req.body;

      if (!tenantId) {
        return res.status(400).json({ success: false, message: 'Tenant context error.' });
      }

      const results = await pool.query(
        `INSERT INTO ai_configurations (tenant_id, agent_name, personality, custom_rules, trigger_reactivation_days, is_active)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (tenant_id) 
         DO UPDATE SET 
           agent_name = EXCLUDED.agent_name,
           personality = EXCLUDED.personality,
           custom_rules = EXCLUDED.custom_rules,
           trigger_reactivation_days = EXCLUDED.trigger_reactivation_days,
           is_active = EXCLUDED.is_active,
           updated_at = NOW()
         RETURNING *`,
        [tenantId, agent_name || 'Atendente Virtual', personality || 'friendly', custom_rules || '', trigger_reactivation_days || 30, is_active !== false]
      );

      return res.json({
        success: true,
        data: results.rows[0],
        message: 'Robô atualizado com sucesso no Barber 360.',
        errors: []
      });
    } catch (e) {
      next(e);
    }
  }
}
