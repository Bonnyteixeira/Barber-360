import { getDbPool } from '../../../database/connection.js';

export class AiRepository {
  static async getConfigByTenant(tenantId: string) {
    const pool = getDbPool();
    const result = await pool.query('SELECT * FROM ai_configurations WHERE tenant_id = $1', [tenantId]);
    return result.rows[0];
  }
}
