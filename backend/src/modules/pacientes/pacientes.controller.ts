import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendSuccess } from "../../utils/response";
import { HTTP_STATUS } from "../../config/constants";
import { servicioPaciente } from "./pacientes.service";
import { validacionPaciente } from "./pacientes.validation";

export class ControladorPaciente {
  static listar = asyncHandler(async (_req: Request, res: Response) => {
    const pacientes = await servicioPaciente.listar();
    sendSuccess(res, pacientes, "Pacientes obtenidos exitosamente");
  });

  static buscarPorId = asyncHandler(async (req: Request, res: Response) => {
    const paciente = await servicioPaciente.buscarPorId(req.params.id as string);
    sendSuccess(res, paciente, "Paciente obtenido exitosamente");
  });

  static crear = asyncHandler(async (req: Request, res: Response) => {
    validacionPaciente.validarCrear(req.body);
    const paciente = await servicioPaciente.crear(req.body);
    sendSuccess(res, paciente, "Paciente creado exitosamente", HTTP_STATUS.CREATED);
  });

  static actualizar = asyncHandler(async (req: Request, res: Response) => {
    validacionPaciente.validarActualizar(req.body);
    const paciente = await servicioPaciente.actualizar(req.params.id as string, req.body);
    sendSuccess(res, paciente, "Paciente actualizado exitosamente");
  });

  static eliminar = asyncHandler(async (req: Request, res: Response) => {
    await servicioPaciente.eliminar(req.params.id as string);
    sendSuccess(res, null, "Paciente eliminado exitosamente");
  });
}
