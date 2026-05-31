import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
  status?: number;
  errors?: any[];
}

export function errorHandler(
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error(`[Error Handler] Catched exception on ${req.method} ${req.url}:`, err);

  const status = err.status || 500;
  const message = err.message || 'Ocorreu um erro interno de processamento no servidor.';
  const errors = err.errors || [];

  return res.status(status).json({
    success: false,
    data: null,
    message,
    errors: errors.length > 0 ? errors : [err.stack || message]
  });
}
