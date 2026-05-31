import { Request, Response, NextFunction } from 'express';
import { financialCreateSchema } from '../dto/financialDto.js';

export class FinancialValidator {
  static validateCreate(req: Request, res: Response, next: NextFunction) {
    const parse = financialCreateSchema.safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({
        success: false,
        data: null,
        message: 'Lançamento financeiro inválido.',
        errors: parse.error.errors.map(err => err.message)
      });
    }
    next();
  }
}
