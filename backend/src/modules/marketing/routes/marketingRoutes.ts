import { Router } from 'express';
import { MarketingController } from '../controllers/marketingController.js';
import { authenticateJwt } from '../../../shared/middlewares/auth.js';
import { tenantContext } from '../../../shared/middlewares/tenant.js';

const router = Router();

router.post('/marketing/campaigns', authenticateJwt, tenantContext, MarketingController.sendCampaign);

export default router;
