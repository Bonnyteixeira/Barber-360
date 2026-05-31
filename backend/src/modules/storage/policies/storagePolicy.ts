import { Response, NextFunction } from 'express';
import { TenantRequest } from '../../../shared/middlewares/tenant.js';

export class StoragePolicy {
  static canUpload(req: TenantRequest, res: Response, next: NextFunction) {
    next();
  }
}
