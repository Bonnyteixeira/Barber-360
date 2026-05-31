import { getDbPool } from '../../../database/connection.js';

export class StorageRepository {
  static async recordUpload(tenantId: string, url: string, rawBytes: number) {
    const pool = getDbPool();
    await pool.query(
      'INSERT INTO audit_logs (tenant_id, action, entity_id) VALUES ($1, $2, $3)', 
      [tenantId, 'RECORD_UPLOAD_STORE', url]
    );
  }
}
