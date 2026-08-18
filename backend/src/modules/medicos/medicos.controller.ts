import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendSuccess } from "../../utils/response";
import { HTTP_STATUS } from "../../config/constants";
import { servicioMedico } from "./medicos.service";
import { validacionMedico } from "./medicos.validation";

export class ControladorMedico {
  static listar = asyncHandler(async (_req: Request, res: Response) => {
    const medicos = await servicioMedico.listar();
    sendSuccess(res, medicos, "Médicos obtenidos exitosamente");
  });

  static buscarPorId = asyncHandler(async (req: Request, res: Response) => {
    const medico = await servicioMedico.buscarPorId(req.params.id as string);
    sendSuccess(res, medico, "Médico obtenido exitosamente");
  });

  static crear = asyncHandler(async (req: Request, res: Response) => {
    validacionMedico.validarCrear(req.body);
    const medico = await servicioMedico.crear(req.body);
    sendSuccess(res, medico, "Médico creado exitosamente", HTTP_STATUS.CREATED);
  });

  static actualizar = asyncHandler(async (req: Request, res: Response) => {
    validacionMedico.validarActualizar(req.body);
    const medico = await servicioMedico.actualizar(req.params.id as string, req.body);
    sendSuccess(res, medico, "Médico actualizado exitosamente");
  });

  static eliminar = asyncHandler(async (req: Request, res: Response) => {
    await servicioMedico.eliminar(req.params.id as string);
    sendSuccess(res, null, "Médico eliminado exitosamente");
  });
}
