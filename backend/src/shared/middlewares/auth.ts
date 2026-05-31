import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { TenantRequest } from './tenant.js';

const JWT_SECRET = process.env.JWT_SECRET || 'BARBER_360_SUPER_SECRET_KEY_ENTERPRISE_9944';

export function authenticateJwt(
  req: TenantRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      data: null,
      message: 'Acesso recusado. É necessário enviar o Token JWT no cabeçalho Authorization Bearer.',
      errors: ['No token provided']
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    
    req.userClaims = {
      id: decoded.id,
      tenantId: decoded.tenantId,
      email: decoded.email,
      roles: decoded.roles || []
    };

    // Auto align tenantId in the request context
    if (decoded.tenantId) {
      req.tenantId = decoded.tenantId;
    }

    next();
  } catch (error: any) {
    return res.status(401).json({
      success: false,
      data: null,
      message: 'Token expirado, inválido ou corrupto.',
      errors: [error.message || 'Invalid token JWT']
    });
  }
}
