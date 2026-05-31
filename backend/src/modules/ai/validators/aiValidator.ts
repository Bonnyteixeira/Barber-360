import { Request, Response, NextFunction } from 'express';
import { aiConfigSchema } from '../dto/aiDto.js';

export class AiValidator {
  static validateUpdate(req: Request, res: Response, next: NextFunction) {
    const parse = aiConfigSchema.safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({
        success: false,
        data: null,
        message: 'Falha na validação de parâmetros de IA.',
        errors: parse.error.errors.map(err => err.message)
      });
    }
    next();
  }
}
