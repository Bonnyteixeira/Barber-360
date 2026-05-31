import { getDbPool } from '../../../database/connection.js';

export class BillingRepository {
  static async updateTenantStatus(tenantId: string, status: string) {
    const pool = getDbPool();
    await pool.query('UPDATE tenants SET status = $1 WHERE id = $2', [status, tenantId]);
  }
}
