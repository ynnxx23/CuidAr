import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendSuccess } from "../../utils/response";
import { HTTP_STATUS } from "../../config/constants";
import { servicioRol } from "./roles.service";
import { validacionRol } from "./roles.validation";

export class ControladorRol {
  static listar = asyncHandler(async (_req: Request, res: Response) => {
    const roles = await servicioRol.listar();
    sendSuccess(res, roles, "Roles obtenidos exitosamente");
  });

  static buscarPorId = asyncHandler(async (req: Request, res: Response) => {
    const rol = await servicioRol.buscarPorId(req.params.id as string);
    sendSuccess(res, rol, "Rol obtenido exitosamente");
  });

  static crear = asyncHandler(async (req: Request, res: Response) => {
    validacionRol.validarCrear(req.body);
    const rol = await servicioRol.crear(req.body);
    sendSuccess(res, rol, "Rol creado exitosamente", HTTP_STATUS.CREATED);
  });

  static actualizar = asyncHandler(async (req: Request, res: Response) => {
    validacionRol.validarActualizar(req.body);
    const rol = await servicioRol.actualizar(req.params.id as string, req.body);
    sendSuccess(res, rol, "Rol actualizado exitosamente");
  });

  static eliminar = asyncHandler(async (req: Request, res: Response) => {
    await servicioRol.eliminar(req.params.id as string);
    sendSuccess(res, null, "Rol eliminado exitosamente");
  });

  static asignarPermiso = asyncHandler(async (req: Request, res: Response) => {
    const { permisoId } = req.body;
    const resultado = await servicioRol.asignarPermiso(req.params.id as string, permisoId);
    sendSuccess(res, resultado, "Permiso asignado al rol exitosamente", HTTP_STATUS.CREATED);
  });

  static removerPermiso = asyncHandler(async (req: Request, res: Response) => {
    await servicioRol.removerPermiso(req.params.id as string, req.params.permisoId as string);
    sendSuccess(res, null, "Permiso removido del rol exitosamente");
  });
}
