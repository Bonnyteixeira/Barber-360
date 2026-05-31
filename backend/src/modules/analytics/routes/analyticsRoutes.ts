import { Router } from 'express';
import { AnalyticsController } from '../controllers/analyticsController.js';
import { authenticateJwt } from '../../../shared/middlewares/auth.js';
import { tenantContext } from '../../../shared/middlewares/tenant.js';

const router = Router();

router.get('/dashboard/metrics', authenticateJwt, tenantContext, AnalyticsController.getMetrics);

export default router;
