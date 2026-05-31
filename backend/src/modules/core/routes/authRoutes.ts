import { Router } from 'express';
import { AuthController } from '../controllers/authController.js';
import { authenticateJwt } from '../../../shared/middlewares/auth.js';
import { tenantContext } from '../../../shared/middlewares/tenant.js';

const router = Router();

router.post('/register', tenantContext, AuthController.register);
router.post('/login', tenantContext, AuthController.login);
router.get('/me', authenticateJwt, tenantContext, AuthController.me);

export default router;
