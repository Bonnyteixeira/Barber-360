import { Response, NextFunction } from 'express';
import { TenantRequest } from '../../../shared/middlewares/tenant.js';

export class CrmPolicy {
  static canTagVip(req: TenantRequest, res: Response, next: NextFunction) {
    // Only administrators or accounts owner can manually promote to vip category
    next();
  }
}
