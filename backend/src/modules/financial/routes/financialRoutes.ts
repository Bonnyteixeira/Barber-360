import { Router } from 'express';
import { FinancialController } from '../controllers/financialController.js';
import { authenticateJwt } from '../../../shared/middlewares/auth.js';
import { authorizeRoles } from '../../../shared/middlewares/role.js';
import { tenantContext } from '../../../shared/middlewares/tenant.js';

const router = Router();

router.get(
  '/financial/entries', 
  authenticateJwt, 
  tenantContext, 
  authorizeRoles(['barber_owner', 'financial', 'super_admin']), 
  FinancialController.listEntries
);
router.post(
  '/financial/entries', 
  authenticateJwt, 
  tenantContext, 
  authorizeRoles(['barber_owner', 'financial', 'super_admin']), 
  FinancialController.addEntry
);
router.get(
  '/financial/commissions', 
  authenticateJwt, 
  tenantContext, 
  authorizeRoles(['barber_owner', 'financial', 'barber', 'super_admin']), 
  FinancialController.listCommissions
);
router.post(
  '/financial/commissions/:id/pay', 
  authenticateJwt, 
  tenantContext, 
  authorizeRoles(['barber_owner', 'financial', 'super_admin']), 
  FinancialController.payCommission
);

export default router;
