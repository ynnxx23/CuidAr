import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendSuccess } from "../../utils/response";
import { HTTP_STATUS } from "../../config/constants";
import { servicioMedicoEspecialidad } from "./medicos-especialidades.service";
import { validacionMedicoEspecialidad } from "./medicos-especialidades.validation";

export class ControladorMedicoEspecialidad {
  static listar = asyncHandler(async (req: Request, res: Response) => {
    const medicoId = typeof req.query.medicoId === "string" ? req.query.medicoId : undefined;
    const especialidadId = typeof req.query.especialidadId === "string" ? req.query.especialidadId : undefined;
    const relaciones = await servicioMedicoEspecialidad.listar(medicoId, especialidadId);
    sendSuccess(res, relaciones, "Especialidades de médicos obtenidas exitosamente");
  });

  static buscarPorId = asyncHandler(async (req: Request, res: Response) => {
    const relacion = await servicioMedicoEspecialidad.buscarPorId(req.params.id as string);
    sendSuccess(res, relacion, "Asignación de especialidad obtenida exitosamente");
  });

  static crear = asyncHandler(async (req: Request, res: Response) => {
    validacionMedicoEspecialidad.validarCrear(req.body);
    const relacion = await servicioMedicoEspecialidad.crear(req.body);
    sendSuccess(res, relacion, "Especialidad asignada al médico exitosamente", HTTP_STATUS.CREATED);
  });

  static actualizar = asyncHandler(async (req: Request, res: Response) => {
    validacionMedicoEspecialidad.validarActualizar(req.body);
    const relacion = await servicioMedicoEspecialidad.actualizar(req.params.id as string, req.body);
    sendSuccess(res, relacion, "Asignación de especialidad actualizada exitosamente");
  });

  static eliminar = asyncHandler(async (req: Request, res: Response) => {
    await servicioMedicoEspecialidad.eliminar(req.params.id as string);
    sendSuccess(res, null, "Especialidad desasignada del médico exitosamente");
  });
}
