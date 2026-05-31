import { Response, NextFunction } from 'express';
import { TenantRequest } from '../../../shared/middlewares/tenant.js';

export class MarketingPolicy {
  static canSendCampaign(req: TenantRequest, res: Response, next: NextFunction) {
    next();
  }
}
