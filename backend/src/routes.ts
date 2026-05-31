import { Router } from 'express';
import { AuthController } from './modules/auth/authController.js';
import { BarbersController } from './modules/barbers/barbersController.js';
import { ClientsController } from './modules/clients/clientsController.js';
import { ServicesController } from './modules/services/servicesController.js';
import { AppointmentsController } from './modules/appointments/appointmentsController.js';
import { FinancialController } from './modules/financial/financialController.js';
import { DashboardController } from './modules/dashboard/dashboardController.js';

import { authenticateJwt } from './shared/middlewares/auth.js';
import { authorizeRoles } from './shared/middlewares/role.js';
import { tenantContext } from './shared/middlewares/tenant.js';

const router = Router();

// ==========================================
// 1. PUBLIC ROUTES & AUTH
// ==========================================
router.post('/auth/register', tenantContext, AuthController.register);
router.post('/auth/login', tenantContext, AuthController.login);
router.get('/auth/me', authenticateJwt, tenantContext, AuthController.me);

// ==========================================
// 2. BARBERS MANAGEMENT (RBAC Controlled)
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
// 3. CLIENTS DIRECTORIES
// ==========================================
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

// ==========================================
// 4. SERVICES CATALOG
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
// 5. APPOINTMENTS SCHEDULER
// ==========================================
router.get('/appointments', authenticateJwt, tenantContext, AppointmentsController.list);
router.post('/appointments', authenticateJwt, tenantContext, AppointmentsController.create);
router.delete('/appointments/:id', authenticateJwt, tenantContext, AppointmentsController.cancel);

// ==========================================
// 6. FINANCIAL LEDGERS (RBAC Protected)
// ==========================================
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

// ==========================================
// 7. ANALYTICS & MONITORING
// ==========================================
router.get(
  '/dashboard/metrics', 
  authenticateJwt, 
  tenantContext, 
  authorizeRoles(['barber_owner', 'financial', 'super_admin', 'operations_manager']), 
  DashboardController.getMetrics
);

export default router;
