import { getDbPool } from '../../../database/connection.js';

export class CrmRepository {
  static async getClientById(id: string) {
    const pool = getDbPool();
    const result = await pool.query('SELECT * FROM clients WHERE id = $1', [id]);
    return result.rows[0];
  }
}
