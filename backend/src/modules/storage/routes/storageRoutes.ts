import { Router } from 'express';
import { StorageController } from '../controllers/storageController.js';
import { authenticateJwt } from '../../../shared/middlewares/auth.js';
import { tenantContext } from '../../../shared/middlewares/tenant.js';

const router = Router();

router.post('/storage/upload', authenticateJwt, tenantContext, StorageController.uploadMedia);

export default router;
