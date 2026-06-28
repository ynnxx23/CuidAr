import { Request, Response, NextFunction } from "express";
import { servicioAutorizacion } from "../services/autorizacion.service";
import { ForbiddenError, UnauthorizedError } from "../utils/apiError";

export class MiddlewareRol {
  static verificarRol(...rolesPermitidos: string[]) {
    return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
      const usuario = (req as any).usuario;
      if (!usuario || !usuario.usuarioId) {
        throw new UnauthorizedError("Token de acceso requerido");
      }

      const tieneRol = await servicioAutorizacion.tieneRol(usuario.usuarioId, rolesPermitidos);
      if (!tieneRol) {
        throw new ForbiddenError("Acceso denegado para este rol");
      }

      next();
    };
  }
}
