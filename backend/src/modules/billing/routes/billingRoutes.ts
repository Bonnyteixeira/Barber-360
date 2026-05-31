import { Router } from 'express';
import { BillingController } from '../controllers/billingController.js';
import { authenticateJwt } from '../../../shared/middlewares/auth.js';
import { tenantContext } from '../../../shared/middlewares/tenant.js';

const router = Router();

router.get('/billing/plans', authenticateJwt, tenantContext, BillingController.listPlans);
router.get('/billing/subscription', authenticateJwt, tenantContext, BillingController.getSubscription);

export default router;
