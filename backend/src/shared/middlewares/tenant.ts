import { Request, Response, NextFunction } from 'express';

export interface TenantRequest extends Request {
  tenantId?: string;
  userClaims?: {
    id: string;
    tenantId?: string;
    email: string;
    roles: string[];
  };
}

export function tenantContext(
  req: TenantRequest,
  res: Response,
  next: NextFunction
) {
  // 1. Try to extract from custom header
  let tenantId = req.headers['x-tenant-id'] as string;

  // 2. Try to extract from query parameters
  if (!tenantId && req.query.tenant_id) {
    tenantId = req.query.tenant_id as string;
  }

  // 3. Fallback to authenticated user token context if already set by auth middleware
  if (!tenantId && req.userClaims?.tenantId) {
    tenantId = req.userClaims.tenantId;
  }

  // If we have a tenant ID, assign it to the request context
  if (tenantId) {
    req.tenantId = tenantId;
  }

  // For operations/global requests, tenantId might be empty/null, which is acceptable
  next();
}
