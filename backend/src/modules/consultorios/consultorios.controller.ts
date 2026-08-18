import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendSuccess } from "../../utils/response";
import { HTTP_STATUS } from "../../config/constants";
import { servicioConsultorio } from "./consultorios.service";
import { validacionConsultorio } from "./consultorios.validation";

export class ControladorConsultorio {
  static listar = asyncHandler(async (req: Request, res: Response) => {
    const hospitalId = req.query.hospitalId as string | undefined;
    const departamentoId = req.query.departamentoId as string | undefined;
    const areaMedicaId = req.query.areaMedicaId as string | undefined;
    const consultorios = await servicioConsultorio.listar(hospitalId, departamentoId, areaMedicaId);
    sendSuccess(res, consultorios, "Consultorios obtenidos exitosamente");
  });

  static buscarPorId = asyncHandler(async (req: Request, res: Response) => {
    const consultorio = await servicioConsultorio.buscarPorId(req.params.id as string);
    sendSuccess(res, consultorio, "Consultorio obtenido exitosamente");
  });

  static crear = asyncHandler(async (req: Request, res: Response) => {
    validacionConsultorio.validarCrear(req.body);
    const consultorio = await servicioConsultorio.crear(req.body);
    sendSuccess(res, consultorio, "Consultorio creado exitosamente", HTTP_STATUS.CREATED);
  });

  static actualizar = asyncHandler(async (req: Request, res: Response) => {
    validacionConsultorio.validarActualizar(req.body);
    const consultorio = await servicioConsultorio.actualizar(req.params.id as string, req.body);
    sendSuccess(res, consultorio, "Consultorio actualizado exitosamente");
  });

  static eliminar = asyncHandler(async (req: Request, res: Response) => {
    await servicioConsultorio.eliminar(req.params.id as string);
    sendSuccess(res, null, "Consultorio eliminado exitosamente");
  });
}
