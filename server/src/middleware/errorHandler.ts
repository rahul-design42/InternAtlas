import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const isProd = process.env.NODE_ENV === 'production';
  
  // Always log the full error server-side for observability
  console.error(`[Error] ${req.method} ${req.url} - ${err.message}`);
  if (!isProd) {
    console.error(err.stack);
  }

  // In production: return a generic message to avoid leaking internal details
  // In development: include error message and stack for debugging
  res.status(500).json({
    success: false,
    message: isProd ? 'An internal server error occurred.' : err.message || 'Internal Server Error',
    ...(isProd ? {} : { stack: err.stack }),
  });
};

