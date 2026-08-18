import { NextFunction, Request, Response } from "express";
import { servicioToken } from "../services/token.service";
import { UnauthorizedError } from "../utils/apiError";

export class MiddlewareAuth {
  static verificarToken(req: Request, _res: Response, next: NextFunction): void {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
      throw new UnauthorizedError("Token de autenticación requerido");
    }

    const token = header.slice(7);

    try {
      const payload = servicioToken.verificarTokenAcceso(token);
      req.usuario = { usuarioId: payload.usuarioId, correoElectronico: payload.correoElectronico };
      next();
    } catch {
      throw new UnauthorizedError("Token inválido o expirado");
    }
  }
}
