import { Request, Response, NextFunction } from 'express';
import { uploadRequestSchema } from '../dto/storageDto.js';

export class StorageValidator {
  static validateUpload(req: Request, res: Response, next: NextFunction) {
    const parse = uploadRequestSchema.safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({ success: false, errors: parse.error.errors.map(err => err.message) });
    }
    next();
  }
}
