import { Request } from 'express';
import rateLimit from 'express-rate-limit';
import { HTTP_STATUS } from '../config/constants';

function extraerUsuarioId(req: Request): string | undefined {
  return req.usuario?.usuarioId;
}

function clavePorIP(req: Request): string {
  return req.ip || req.socket.remoteAddress || 'unknown';
}

function clavePorUsuarioOIP(req: Request): string {
  const usuarioId = extraerUsuarioId(req);
  return usuarioId ? `user:${usuarioId}` : `ip:${clavePorIP(req)}`;
}

export const limitadorGeneral = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  keyGenerator: clavePorIP,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Demasiadas solicitudes, intente más tarde',
    error: { code: 'RATE_LIMITED' },
  },
  statusCode: HTTP_STATUS.TOO_MANY_REQUESTS,
});

export const limitadorAutenticacion = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  keyGenerator: clavePorIP,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Demasiados intentos de autenticación, intente más tarde',
    error: { code: 'RATE_LIMITED' },
  },
  statusCode: HTTP_STATUS.TOO_MANY_REQUESTS,
});

export const limitadorBruteForce = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  keyGenerator: clavePorIP,
  skipSuccessfulRequests: true,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Demasiados intentos fallidos, cuenta bloqueada temporalmente',
    error: { code: 'RATE_LIMITED' },
  },
  statusCode: HTTP_STATUS.TOO_MANY_REQUESTS,
});

export const limitadorEscritura = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 30,
  keyGenerator: clavePorUsuarioOIP,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Demasiadas escrituras, intente más tarde',
    error: { code: 'RATE_LIMITED' },
  },
  statusCode: HTTP_STATUS.TOO_MANY_REQUESTS,
});

export const limitadorSubidaArchivos = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 20,
  keyGenerator: clavePorUsuarioOIP,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Demasiadas subidas de archivos, intente más tarde',
    error: { code: 'RATE_LIMITED' },
  },
  statusCode: HTTP_STATUS.TOO_MANY_REQUESTS,
});
