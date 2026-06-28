import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendSuccess } from "../../utils/response";
import { HTTP_STATUS } from "../../config/constants";
import { servicioPermiso } from "./permisos.service";
import { validacionPermiso } from "./permisos.validation";

export class ControladorPermiso {
  static listar = asyncHandler(async (req: Request, res: Response) => {
    const filtro = req.query.recurso ? { recurso: req.query.recurso as string } : undefined;
    const permisos = await servicioPermiso.listar(filtro);
    sendSuccess(res, permisos, "Permisos obtenidos exitosamente");
  });

  static buscarPorId = asyncHandler(async (req: Request, res: Response) => {
    const permiso = await servicioPermiso.buscarPorId(req.params.id as string);
    sendSuccess(res, permiso, "Permiso obtenido exitosamente");
  });

  static crear = asyncHandler(async (req: Request, res: Response) => {
    validacionPermiso.validarCrear(req.body);
    const permiso = await servicioPermiso.crear(req.body);
    sendSuccess(res, permiso, "Permiso creado exitosamente", HTTP_STATUS.CREATED);
  });

  static actualizar = asyncHandler(async (req: Request, res: Response) => {
    validacionPermiso.validarActualizar(req.body);
    const permiso = await servicioPermiso.actualizar(req.params.id as string, req.body);
    sendSuccess(res, permiso, "Permiso actualizado exitosamente");
  });

  static eliminar = asyncHandler(async (req: Request, res: Response) => {
    await servicioPermiso.eliminar(req.params.id as string);
    sendSuccess(res, null, "Permiso eliminado exitosamente");
  });
}
