import { Request, Response, NextFunction } from 'express';
import { sendMessageSchema } from '../dto/chatDto.js';

export class ChatValidator {
  static validateSend(req: Request, res: Response, next: NextFunction) {
    const parse = sendMessageSchema.safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({
        success: false,
        data: null,
        message: 'Mensagem inválida.',
        errors: parse.error.errors.map(err => err.message)
      });
    }
    next();
  }
}
