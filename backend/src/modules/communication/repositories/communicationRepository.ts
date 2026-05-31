import { getDbPool } from '../../../database/connection.js';

export class CommunicationRepository {
  static async getActiveSessionsCount(tenantId: string) {
    const pool = getDbPool();
    const result = await pool.query('SELECT COUNT(*)::int as count FROM chat_sessions WHERE tenant_id = $1 AND status = \'active\'', [tenantId]);
    return result.rows[0]?.count || 0;
  }
}
