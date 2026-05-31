import { Request, Response, NextFunction } from 'express';
import { analyticsQuerySchema } from '../dto/analyticsDto.js';

export class AnalyticsValidator {
  static validateQuery(req: Request, res: Response, next: NextFunction) {
    const parse = analyticsQuerySchema.safeParse(req.query);
    if (!parse.success) {
      return res.status(400).json({ success: false, errors: parse.error.errors.map(err => err.message) });
    }
    next();
  }
}
