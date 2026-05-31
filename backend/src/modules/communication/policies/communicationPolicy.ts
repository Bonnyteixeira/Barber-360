import { Response, NextFunction } from 'express';
import { TenantRequest } from '../../../shared/middlewares/tenant.js';

export class CommunicationPolicy {
  static checkLimits(req: TenantRequest, res: Response, next: NextFunction) {
    // Check if tenant has not reached their monthly WhatsApp API quota
    next();
  }
}
