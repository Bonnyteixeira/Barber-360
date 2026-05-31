import { Response, NextFunction } from 'express';
import { TenantRequest } from '../../../shared/middlewares/tenant.js';

export class BillingPolicy {
  static canAccessMetrics(req: TenantRequest, res: Response, next: NextFunction) {
    next();
  }
}
