import { getDbPool } from '../../../database/connection.js';

export class MarketingRepository {
  static async getCampaignStats(tenantId: string) {
    const pool = getDbPool();
    const result = await pool.query('SELECT COUNT(*)::int as count FROM audit_logs WHERE tenant_id = $1 AND action = \'SEND_CAMPAIGN\'', [tenantId]);
    return { campaigns_count: result.rows[0]?.count || 0 };
  }
}
