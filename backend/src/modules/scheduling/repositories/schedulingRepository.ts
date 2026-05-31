import { getDbPool } from '../../../database/connection.js';

export class SchedulingRepository {
  static async getAppointmentById(id: string) {
    const pool = getDbPool();
    const result = await pool.query('SELECT * FROM appointments WHERE id = $1', [id]);
    return result.rows[0];
  }
}
