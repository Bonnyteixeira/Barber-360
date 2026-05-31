import { Request, Response, NextFunction } from 'express';
import { clientCreateSchema } from '../dto/clientDto.js';

export class ClientValidator {
  static validateCreate(req: Request, res: Response, next: NextFunction) {
    const parse = clientCreateSchema.safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({
        success: false,
        data: null,
        message: 'Falha na validação de dados de cliente.',
        errors: parse.error.errors.map(err => err.message)
      });
    }
    next();
  }
}
