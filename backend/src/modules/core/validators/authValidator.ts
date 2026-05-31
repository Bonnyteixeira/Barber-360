import { Request, Response, NextFunction } from 'express';
import { loginSchema, registerSchema } from '../dto/authDto.js';

export class AuthValidator {
  static validateLogin(req: Request, res: Response, next: NextFunction) {
    const parse = loginSchema.safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({
        success: false,
        data: null,
        message: 'Falha na validação de login.',
        errors: parse.error.errors.map(err => err.message)
      });
    }
    next();
  }

  static validateRegister(req: Request, res: Response, next: NextFunction) {
    const parse = registerSchema.safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({
        success: false,
        data: null,
        message: 'Falha na validação de registro.',
        errors: parse.error.errors.map(err => err.message)
      });
    }
    next();
  }
}
