import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendSuccess } from "../../utils/response";
import { HTTP_STATUS } from "../../config/constants";
import { servicioEspecialidad } from "./especialidades.service";
import { validacionEspecialidad } from "./especialidades.validation";

export class ControladorEspecialidad {
  static listar = asyncHandler(async (_req: Request, res: Response) => {
    const especialidades = await servicioEspecialidad.listar();
    sendSuccess(res, especialidades, "Especialidades obtenidas exitosamente");
  });

  static buscarPorId = asyncHandler(async (req: Request, res: Response) => {
    const especialidad = await servicioEspecialidad.buscarPorId(req.params.id as string);
    sendSuccess(res, especialidad, "Especialidad obtenida exitosamente");
  });

  static crear = asyncHandler(async (req: Request, res: Response) => {
    validacionEspecialidad.validarCrear(req.body);
    const especialidad = await servicioEspecialidad.crear(req.body);
    sendSuccess(res, especialidad, "Especialidad creada exitosamente", HTTP_STATUS.CREATED);
  });

  static actualizar = asyncHandler(async (req: Request, res: Response) => {
    validacionEspecialidad.validarActualizar(req.body);
    const especialidad = await servicioEspecialidad.actualizar(req.params.id as string, req.body);
    sendSuccess(res, especialidad, "Especialidad actualizada exitosamente");
  });

  static eliminar = asyncHandler(async (req: Request, res: Response) => {
    await servicioEspecialidad.eliminar(req.params.id as string);
    sendSuccess(res, null, "Especialidad eliminada exitosamente");
  });
}
