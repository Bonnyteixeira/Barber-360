import { getDbPool } from '../../../database/connection.js';

export class AnalyticsRepository {
  static async getDirectRevenueTotal(tenantId: string) {
    const pool = getDbPool();
    const result = await pool.query('SELECT SUM(amount)::numeric as total FROM financial_entries WHERE tenant_id = $1 AND type = \'revenue\'', [tenantId]);
    return parseFloat(result.rows[0]?.total || 0);
  }
}
