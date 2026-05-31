import { getDbPool } from '../../../database/connection.js';

export class OperationsRepository {
  static async logAction(userId: string, action: string, ip: string) {
    const pool = getDbPool();
    await pool.query('INSERT INTO audit_logs (user_id, action, ip_address) VALUES ($1, $2, $3)', [userId, action, ip]);
  }
}
