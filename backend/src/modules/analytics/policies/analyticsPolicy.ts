import { Response, NextFunction } from 'express';
import { TenantRequest } from '../../../shared/middlewares/tenant.js';

export class AnalyticsPolicy {
  static canViewReport(req: TenantRequest, res: Response, next: NextFunction) {
    next();
  }
}
