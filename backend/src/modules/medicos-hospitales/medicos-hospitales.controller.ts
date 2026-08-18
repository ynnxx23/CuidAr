import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendSuccess } from "../../utils/response";
import { HTTP_STATUS } from "../../config/constants";
import { servicioMedicoHospital } from "./medicos-hospitales.service";
import { validacionMedicoHospital } from "./medicos-hospitales.validation";

export class ControladorMedicoHospital {
  static listar = asyncHandler(async (req: Request, res: Response) => {
    const medicoId = typeof req.query.medicoId === "string" ? req.query.medicoId : undefined;
    const hospitalId = typeof req.query.hospitalId === "string" ? req.query.hospitalId : undefined;
    const relaciones = await servicioMedicoHospital.listar(medicoId, hospitalId);
    sendSuccess(res, relaciones, "Hospitales de médicos obtenidos exitosamente");
  });

  static buscarPorId = asyncHandler(async (req: Request, res: Response) => {
    const relacion = await servicioMedicoHospital.buscarPorId(req.params.id as string);
    sendSuccess(res, relacion, "Asignación de hospital obtenida exitosamente");
  });

  static crear = asyncHandler(async (req: Request, res: Response) => {
    validacionMedicoHospital.validarCrear(req.body);
    const relacion = await servicioMedicoHospital.crear(req.body);
    sendSuccess(res, relacion, "Hospital asignado al médico exitosamente", HTTP_STATUS.CREATED);
  });

  static actualizar = asyncHandler(async (req: Request, res: Response) => {
    validacionMedicoHospital.validarActualizar(req.body);
    const relacion = await servicioMedicoHospital.actualizar(req.params.id as string, req.body);
    sendSuccess(res, relacion, "Asignación de hospital actualizada exitosamente");
  });

  static eliminar = asyncHandler(async (req: Request, res: Response) => {
    await servicioMedicoHospital.eliminar(req.params.id as string);
    sendSuccess(res, null, "Hospital desasignado del médico exitosamente");
  });
}
