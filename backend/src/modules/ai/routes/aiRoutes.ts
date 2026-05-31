import { Router } from 'express';
import { AiController } from '../controllers/aiController.js';
import { authenticateJwt } from '../../../shared/middlewares/auth.js';
import { tenantContext } from '../../../shared/middlewares/tenant.js';

const router = Router();

router.get('/ai/config', authenticateJwt, tenantContext, AiController.getConfig);
router.post('/ai/config', authenticateJwt, tenantContext, AiController.updateConfig);

export default router;
