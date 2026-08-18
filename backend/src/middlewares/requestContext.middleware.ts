import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

export function middlewareContextoSolicitud(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  const requestId = (req.headers['x-request-id'] as string) || crypto.randomUUID();

  req.requestId = requestId;
  req.solicitudInicio = Date.now();

  next();
}
