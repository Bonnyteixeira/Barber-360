import { Response, NextFunction } from 'express';
import { TenantRequest } from './tenant.js';

export function authorizeRoles(allowedRoles: string[]) {
  return (req: TenantRequest, res: Response, next: NextFunction) => {
    const claims = req.userClaims;

    if (!claims) {
      return res.status(401).json({
        success: false,
        data: null,
        message: 'Usuário não autenticado no sistema.',
        errors: ['Authentication context missing']
      });
    }

    const hasAllowedRole = claims.roles.some((role) => allowedRoles.includes(role));

    if (!hasAllowedRole) {
      return res.status(403).json({
        success: false,
        data: null,
        message: 'Acesso negado. Seu perfil de usuário não possui as permissões necessárias para acessar este recurso.',
        errors: [`Forbidden. Requires any role of: [${allowedRoles.join(', ')}]`]
      });
    }

    next();
  };
}
