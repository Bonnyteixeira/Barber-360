import { Request, Response, NextFunction } from 'express';
import { checkoutSchema } from '../dto/billingDto.js';

export class BillingValidator {
  static validateCheckout(req: Request, res: Response, next: NextFunction) {
    const parse = checkoutSchema.safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({ success: false, errors: parse.error.errors.map(err => err.message) });
    }
    next();
  }
}
