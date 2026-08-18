import { NextFunction, Request, Response } from "express";
import { servicioAutorizacion } from "../services/autorizacion.service";
import { ForbiddenError, UnauthorizedError } from "../utils/apiError";

export class MiddlewareRol {
  static verificarRol(...rolesPermitidos: string[]) {
    return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
      const usuarioId = req.usuario?.usuarioId;

      if (!usuarioId) {
        throw new UnauthorizedError("Autenticación requerida");
      }

      const tieneRol = await servicioAutorizacion.tieneRol(usuarioId, rolesPermitidos);
      if (!tieneRol) {
        throw new ForbiddenError("Acceso denegado para este rol");
      }

      next();
    };
  }
}
