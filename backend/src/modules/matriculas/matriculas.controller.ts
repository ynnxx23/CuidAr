import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendSuccess } from "../../utils/response";
import { HTTP_STATUS } from "../../config/constants";
import { servicioMatricula } from "./matriculas.service";
import { validacionMatricula } from "./matriculas.validation";

export class ControladorMatricula {
  static listar = asyncHandler(async (req: Request, res: Response) => {
    const medicoId = typeof req.query.medicoId === "string" ? req.query.medicoId : undefined;
    const matriculas = await servicioMatricula.listar(medicoId);
    sendSuccess(res, matriculas, "Matrículas obtenidas exitosamente");
  });

  static buscarPorId = asyncHandler(async (req: Request, res: Response) => {
    const matricula = await servicioMatricula.buscarPorId(req.params.id as string);
    sendSuccess(res, matricula, "Matrícula obtenida exitosamente");
  });

  static crear = asyncHandler(async (req: Request, res: Response) => {
    validacionMatricula.validarCrear(req.body);
    const matricula = await servicioMatricula.crear(req.body);
    sendSuccess(res, matricula, "Matrícula creada exitosamente", HTTP_STATUS.CREATED);
  });

  static actualizar = asyncHandler(async (req: Request, res: Response) => {
    validacionMatricula.validarActualizar(req.body);
    const matricula = await servicioMatricula.actualizar(req.params.id as string, req.body);
    sendSuccess(res, matricula, "Matrícula actualizada exitosamente");
  });

  static eliminar = asyncHandler(async (req: Request, res: Response) => {
    await servicioMatricula.eliminar(req.params.id as string);
    sendSuccess(res, null, "Matrícula eliminada exitosamente");
  });
}
