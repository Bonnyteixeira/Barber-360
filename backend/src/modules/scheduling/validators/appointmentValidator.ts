import { Request, Response, NextFunction } from 'express';
import { appointmentCreateSchema } from '../dto/appointmentDto.js';

export class AppointmentValidator {
  static validateCreate(req: Request, res: Response, next: NextFunction) {
    const parse = appointmentCreateSchema.safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({
        success: false,
        data: null,
        message: 'Falha na validação do agendamento.',
        errors: parse.error.errors.map(err => err.message)
      });
    }
    next();
  }
}
