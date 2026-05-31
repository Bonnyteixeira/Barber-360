import { Request, Response, NextFunction } from 'express';
import { campaignCreateSchema } from '../dto/marketingDto.js';

export class MarketingValidator {
  static validateCreate(req: Request, res: Response, next: NextFunction) {
    const parse = campaignCreateSchema.safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({ success: false, errors: parse.error.errors.map(err => err.message) });
    }
    next();
  }
}
