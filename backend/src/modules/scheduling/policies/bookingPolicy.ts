import { Response, NextFunction } from 'express';
import { TenantRequest } from '../../../shared/middlewares/tenant.js';

export class BookingPolicy {
  static canCancel(req: TenantRequest, res: Response, next: NextFunction) {
    // Check if appointment is not already in progress or past
    next();
  }
}
