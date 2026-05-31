import { Response, NextFunction } from 'express';
import { TenantRequest } from '../../../shared/middlewares/tenant.js';

export class AuthPolicy {
  static checkAccountStatus(req: TenantRequest, res: Response, next: NextFunction) {
    // In an enterprise system, verify tenant subscription status
    // For trial, active, past_due, etc.
    next();
  }
}
