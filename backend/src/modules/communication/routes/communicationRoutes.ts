import { Router } from 'express';
import { CommunicationController } from '../controllers/communicationController.js';
import { authenticateJwt } from '../../../shared/middlewares/auth.js';
import { tenantContext } from '../../../shared/middlewares/tenant.js';

const router = Router();

router.get('/conversations', authenticateJwt, tenantContext, CommunicationController.listConversations);
router.get('/conversations/:sessionId/messages', authenticateJwt, tenantContext, CommunicationController.getMessages);
router.post('/conversations/send', authenticateJwt, tenantContext, CommunicationController.sendMessage);

export default router;
