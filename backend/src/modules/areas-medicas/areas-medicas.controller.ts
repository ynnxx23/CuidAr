import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendSuccess } from "../../utils/response";
import { HTTP_STATUS } from "../../config/constants";
import { servicioAreaMedica } from "./areas-medicas.service";
import { validacionAreaMedica } from "./areas-medicas.validation";

export class ControladorAreaMedica {
  static listar = asyncHandler(async (_req: Request, res: Response) => {
    const areasMedicas = await servicioAreaMedica.listar();
    sendSuccess(res, areasMedicas, "Áreas médicas obtenidas exitosamente");
  });

  static buscarPorId = asyncHandler(async (req: Request, res: Response) => {
    const areaMedica = await servicioAreaMedica.buscarPorId(req.params.id as string);
    sendSuccess(res, areaMedica, "Área médica obtenida exitosamente");
  });

  static crear = asyncHandler(async (req: Request, res: Response) => {
    validacionAreaMedica.validarCrear(req.body);
    const areaMedica = await servicioAreaMedica.crear(req.body);
    sendSuccess(res, areaMedica, "Área médica creada exitosamente", HTTP_STATUS.CREATED);
  });

  static actualizar = asyncHandler(async (req: Request, res: Response) => {
    validacionAreaMedica.validarActualizar(req.body);
    const areaMedica = await servicioAreaMedica.actualizar(req.params.id as string, req.body);
    sendSuccess(res, areaMedica, "Área médica actualizada exitosamente");
  });

  static eliminar = asyncHandler(async (req: Request, res: Response) => {
    await servicioAreaMedica.eliminar(req.params.id as string);
    sendSuccess(res, null, "Área médica eliminada exitosamente");
  });
}
