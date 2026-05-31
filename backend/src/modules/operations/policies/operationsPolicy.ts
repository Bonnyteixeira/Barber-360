import { Response, NextFunction } from 'express';
import { TenantRequest } from '../../../shared/middlewares/tenant.js';

export class OperationsPolicy {
  static canRunOps(req: TenantRequest, res: Response, next: NextFunction) {
    next();
  }
}
