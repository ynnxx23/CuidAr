import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendSuccess } from "../../utils/response";
import { HTTP_STATUS } from "../../config/constants";
import { servicioLocalidad } from "./localidades.service";
import { validacionLocalidad } from "./localidades.validation";

export class ControladorLocalidad {
  static listar = asyncHandler(async (req: Request, res: Response) => {
    const provinciaId = typeof req.query.provinciaId === "string" ? req.query.provinciaId : undefined;
    const localidades = await servicioLocalidad.listar(provinciaId);
    sendSuccess(res, localidades, "Localidades obtenidas exitosamente");
  });

  static buscarPorId = asyncHandler(async (req: Request, res: Response) => {
    const localidad = await servicioLocalidad.buscarPorId(req.params.id as string);
    sendSuccess(res, localidad, "Localidad obtenida exitosamente");
  });

  static crear = asyncHandler(async (req: Request, res: Response) => {
    validacionLocalidad.validarCrear(req.body);
    const localidad = await servicioLocalidad.crear(req.body);
    sendSuccess(res, localidad, "Localidad creada exitosamente", HTTP_STATUS.CREATED);
  });

  static actualizar = asyncHandler(async (req: Request, res: Response) => {
    validacionLocalidad.validarActualizar(req.body);
    const localidad = await servicioLocalidad.actualizar(req.params.id as string, req.body);
    sendSuccess(res, localidad, "Localidad actualizada exitosamente");
  });

  static eliminar = asyncHandler(async (req: Request, res: Response) => {
    await servicioLocalidad.eliminar(req.params.id as string);
    sendSuccess(res, null, "Localidad eliminada exitosamente");
  });
}
