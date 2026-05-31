import { Router } from 'express';
import { ClientsController } from '../controllers/clientsController.js';
import { authenticateJwt } from '../../../shared/middlewares/auth.js';
import { authorizeRoles } from '../../../shared/middlewares/role.js';
import { tenantContext } from '../../../shared/middlewares/tenant.js';

const router = Router();

router.get('/clients', authenticateJwt, tenantContext, ClientsController.list);
router.post('/clients', authenticateJwt, tenantContext, ClientsController.create);
router.put('/clients/:id', authenticateJwt, tenantContext, ClientsController.update);
router.delete(
  '/clients/:id', 
  authenticateJwt, 
  tenantContext, 
  authorizeRoles(['barber_owner', 'super_admin']), 
  ClientsController.delete
);

export default router;
