import { getDbPool } from '../../../database/connection.js';

export class FinancialRepository {
  static async getCommissionsSum(tenantId: string, status: string) {
    const pool = getDbPool();
    const result = await pool.query('SELECT SUM(amount)::numeric as total FROM commissions WHERE tenant_id = $1 AND status = $2', [tenantId, status]);
    return parseFloat(result.rows[0]?.total || 0);
  }
}
