import { Router } from 'express';
import { OperationsController } from '../controllers/operationsController.js';
import { authenticateJwt } from '../../../shared/middlewares/auth.js';
import { authorizeRoles } from '../../../shared/middlewares/role.js';

const router = Router();

router.get(
  '/operations/audit-logs', 
  authenticateJwt, 
  authorizeRoles(['super_admin', 'operations_manager']), 
  OperationsController.getAuditLogs
);
router.get(
  '/operations/stats', 
  authenticateJwt, 
  authorizeRoles(['super_admin']), 
  OperationsController.getPlatformStats
);

export default router;
