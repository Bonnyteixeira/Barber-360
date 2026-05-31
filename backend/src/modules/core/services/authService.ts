import { getDbPool } from '../../../database/connection.js';

export class AuthService {
  static async validateTenantSlug(slug: string): Promise<boolean> {
    const pool = getDbPool();
    const result = await pool.query('SELECT id FROM tenants WHERE slug = $1', [slug]);
    return result.rows.length === 0;
  }

  static async findUserByEmail(email: string) {
    const pool = getDbPool();
    const result = await pool.query('SELECT * FROM users WHERE email = $1 AND deleted_at IS NULL', [email]);
    return result.rows[0];
  }
}
