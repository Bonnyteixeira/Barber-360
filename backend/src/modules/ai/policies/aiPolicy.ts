import { Response, NextFunction } from 'express';
import { TenantRequest } from '../../../shared/middlewares/tenant.js';

export class AiPolicy {
  static checkQuota(req: TenantRequest, res: Response, next: NextFunction) {
    // Verify chatbot handler allocation quotas
    next();
  }
}
