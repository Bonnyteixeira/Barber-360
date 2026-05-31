import { Router } from 'express';
import { BarbersController } from '../controllers/barbersController.js';
import { ServicesController } from '../controllers/servicesController.js';
import { AppointmentsController } from '../controllers/appointmentsController.js';
import { authenticateJwt } from '../../../shared/middlewares/auth.js';
import { authorizeRoles } from '../../../shared/middlewares/role.js';
import { tenantContext } from '../../../shared/middlewares/tenant.js';

const router = Router();

// ==========================================
// BARBERS MANAGEMENT (RBAC Controlled)
// ==========================================
router.get(
  '/barbers', 
  authenticateJwt, 
  tenantContext, 
  authorizeRoles(['barber_owner', 'super_admin', 'operations_manager', 'barber']), 
  BarbersController.list
);
router.post(
  '/barbers', 
  authenticateJwt, 
  tenantContext, 
  authorizeRoles(['barber_owner', 'super_admin']), 
  BarbersController.create
);
router.put(
  '/barbers/:id', 
  authenticateJwt, 
  tenantContext, 
  authorizeRoles(['barber_owner', 'super_admin']), 
  BarbersController.update
);
router.delete(
  '/barbers/:id', 
  authenticateJwt, 
  tenantContext, 
  authorizeRoles(['barber_owner', 'super_admin']), 
  BarbersController.delete
);

// ==========================================
// SERVICES CATALOG
// ==========================================
router.get('/services', authenticateJwt, tenantContext, ServicesController.list);
router.post(
  '/services', 
  authenticateJwt, 
  tenantContext, 
  authorizeRoles(['barber_owner', 'super_admin']), 
  ServicesController.create
);
router.put(
  '/services/:id', 
  authenticateJwt, 
  tenantContext, 
  authorizeRoles(['barber_owner', 'super_admin']), 
  ServicesController.update
);
router.delete(
  '/services/:id', 
  authenticateJwt, 
  tenantContext, 
  authorizeRoles(['barber_owner', 'super_admin']), 
  ServicesController.delete
);

// ==========================================
// APPOINTMENTS SCHEDULER
// ==========================================
router.get('/appointments', authenticateJwt, tenantContext, AppointmentsController.list);
router.post('/appointments', authenticateJwt, tenantContext, AppointmentsController.create);
router.delete('/appointments/:id', authenticateJwt, tenantContext, AppointmentsController.cancel);

export default router;
