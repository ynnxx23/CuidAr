import { Request, Response, NextFunction } from "express";
import { servicioToken } from "../services/token.service";
import { UnauthorizedError } from "../utils/apiError";

export class MiddlewareAuth {
  static verificarToken(req: Request, _res: Response, next: NextFunction): void {
    const encabezado = req.headers.authorization;
    if (!encabezado || !encabezado.startsWith("Bearer ")) {
      throw new UnauthorizedError("Token de acceso requerido");
    }

    const token = encabezado.split(" ")[1];
    try {
      const payload = servicioToken.verificarTokenAcceso(token);
      (req as any).usuario = payload;
      next();
    } catch {
      throw new UnauthorizedError("Token de acceso inválido o expirado");
    }
  }
}
