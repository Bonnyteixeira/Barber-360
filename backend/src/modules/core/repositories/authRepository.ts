import { getDbPool } from '../../../database/connection.js';

export class AuthRepository {
  static async getTenantById(id: string) {
    const pool = getDbPool();
    const result = await pool.query('SELECT * FROM tenants WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async getUserWithRoles(userId: string) {
    const pool = getDbPool();
    const userRes = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
    const rolesRes = await pool.query('SELECT role_id FROM user_roles WHERE user_id = $1', [userId]);
    return {
      ...userRes.rows[0],
      roles: rolesRes.rows.map(r => r.role_id)
    };
  }
}
