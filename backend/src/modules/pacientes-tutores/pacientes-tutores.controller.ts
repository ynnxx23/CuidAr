import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendSuccess } from "../../utils/response";
import { HTTP_STATUS } from "../../config/constants";
import { servicioPacienteTutor } from "./pacientes-tutores.service";
import { validacionPacienteTutor } from "./pacientes-tutores.validation";

export class ControladorPacienteTutor {
  static listar = asyncHandler(async (req: Request, res: Response) => {
    const pacienteId = req.query.pacienteId as string | undefined;
    const relaciones = await servicioPacienteTutor.listar(pacienteId);
    sendSuccess(res, relaciones, "Relaciones tutor-paciente obtenidas exitosamente");
  });

  static buscarPorId = asyncHandler(async (req: Request, res: Response) => {
    const relacion = await servicioPacienteTutor.buscarPorId(req.params.id as string);
    sendSuccess(res, relacion, "Relación tutor-paciente obtenida exitosamente");
  });

  static crear = asyncHandler(async (req: Request, res: Response) => {
    validacionPacienteTutor.validarCrear(req.body);
    const relacion = await servicioPacienteTutor.crear(req.body);
    sendSuccess(res, relacion, "Relación tutor-paciente creada exitosamente", HTTP_STATUS.CREATED);
  });

  static actualizar = asyncHandler(async (req: Request, res: Response) => {
    validacionPacienteTutor.validarActualizar(req.body);
    const relacion = await servicioPacienteTutor.actualizar(req.params.id as string, req.body);
    sendSuccess(res, relacion, "Relación tutor-paciente actualizada exitosamente");
  });

  static eliminar = asyncHandler(async (req: Request, res: Response) => {
    await servicioPacienteTutor.eliminar(req.params.id as string);
    sendSuccess(res, null, "Relación tutor-paciente eliminada exitosamente");
  });
}
