import { NextFunction, Request, Response } from "express";
import { servicioAutorizacion } from "../services/autorizacion.service";
import { ForbiddenError, UnauthorizedError } from "../utils/apiError";

export class MiddlewarePermiso {
  static verificarPermiso(permisoCodigo: string | string[]) {
    return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
      const usuarioId = req.usuario?.usuarioId;

      if (!usuarioId) {
        throw new UnauthorizedError("Autenticación requerida");
      }

      const permisos = await servicioAutorizacion.obtenerPermisos(usuarioId);
      const requeridos = Array.isArray(permisoCodigo) ? permisoCodigo : [permisoCodigo];

      const autorizado = requeridos.some((codigo) => permisos.includes(codigo));
      if (!autorizado) {
        throw new ForbiddenError("Permiso insuficiente");
      }

      next();
    };
  }
}
