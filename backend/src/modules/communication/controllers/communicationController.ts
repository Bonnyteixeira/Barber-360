import { Response, NextFunction } from 'express';
import { TenantRequest } from '../../../shared/middlewares/tenant.js';
import { getDbPool } from '../../../database/connection.js';
import { eventBus } from '../../../shared/events/eventBus.js';

export class CommunicationController {
  
  // 1. List conversations histories
  static async listConversations(req: TenantRequest, res: Response, next: NextFunction) {
    const pool = getDbPool();
    try {
      const tenantId = req.tenantId;
      if (!tenantId) {
        return res.status(400).json({ success: false, message: 'Tenant required.' });
      }

      const results = await pool.query(
        'SELECT * FROM chat_sessions WHERE tenant_id = $1 ORDER BY last_message_at DESC NULLS LAST',
        [tenantId]
      );

      return res.json({
        success: true,
        data: results.rows,
        message: 'Conversas listadas.',
        errors: []
      });
    } catch (e) {
      next(e);
    }
  }

  // 2. Fetch specific messages of session
  static async getMessages(req: TenantRequest, res: Response, next: NextFunction) {
    const pool = getDbPool();
    try {
      const { sessionId } = req.params;
      const results = await pool.query(
        'SELECT * FROM chat_messages WHERE session_id = $1 ORDER BY created_at ASC',
        [sessionId]
      );

      return res.json({
        success: true,
        data: results.rows,
        message: 'Mensagens carregadas com sucesso.',
        errors: []
      });
    } catch (e) {
      next(e);
    }
  }

  // 3. Dispatch text message
  static async sendMessage(req: TenantRequest, res: Response, next: NextFunction) {
    const pool = getDbPool();
    try {
      const { sessionId, content, sender } = req.body;

      const results = await pool.query(
        'INSERT INTO chat_messages (session_id, sender, content) VALUES ($1, $2, $3) RETURNING *',
        [sessionId, sender || 'bot', content]
      );

      const savedMsg = results.rows[0];

      // Publish event
      eventBus.publish('message.sent', savedMsg);

      return res.status(201).json({
        success: true,
        data: savedMsg,
        message: 'Mensagem transmitida.',
        errors: []
      });
    } catch (e) {
      next(e);
    }
  }
}
