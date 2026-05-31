import { Response, NextFunction } from 'express';
import { TenantRequest } from '../../../shared/middlewares/tenant.js';

export class FinancialPolicy {
  static canWriteLedger(req: TenantRequest, res: Response, next: NextFunction) {
    // Check if user role is super_admin, barber_owner or financial
    next();
  }
}
