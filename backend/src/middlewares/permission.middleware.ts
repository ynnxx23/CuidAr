import { Request, Response, NextFunction } from "express";
import { servicioAutorizacion } from "../services/autorizacion.service";
import { ForbiddenError, UnauthorizedError } from "../utils/apiError";

export class MiddlewarePermiso {
  static verificarPermiso(permisoCodigo: string | string[]) {
    return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
      const usuario = (req as any).usuario;
      if (!usuario || !usuario.usuarioId) {
        throw new UnauthorizedError("Token de acceso requerido");
      }

      const codigos = Array.isArray(permisoCodigo) ? permisoCodigo : [permisoCodigo];
      const permisos = await servicioAutorizacion.obtenerPermisos(usuario.usuarioId);
      const tieneAlguno = codigos.some((c) => permisos.includes(c));

      if (!tieneAlguno) {
        throw new ForbiddenError("Permiso insuficiente");
      }

      next();
    };
  }
}
