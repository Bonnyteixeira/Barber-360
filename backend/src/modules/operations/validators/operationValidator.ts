import { Request, Response, NextFunction } from 'express';
import { auditQuerySchema } from '../dto/operationDto.js';

export class OperationValidator {
  static validateQuery(req: Request, res: Response, next: NextFunction) {
    const parse = auditQuerySchema.safeParse(req.query);
    if (!parse.success) {
      return res.status(400).json({ success: false, errors: parse.error.errors.map(err => err.message) });
    }
    next();
  }
}
