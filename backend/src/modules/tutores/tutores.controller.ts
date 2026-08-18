import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendSuccess } from "../../utils/response";
import { HTTP_STATUS } from "../../config/constants";
import { servicioTutor } from "./tutores.service";
import { validacionTutor } from "./tutores.validation";

export class ControladorTutor {
  static listar = asyncHandler(async (_req: Request, res: Response) => {
    const tutores = await servicioTutor.listar();
    sendSuccess(res, tutores, "Tutores obtenidos exitosamente");
  });

  static buscarPorId = asyncHandler(async (req: Request, res: Response) => {
    const tutor = await servicioTutor.buscarPorId(req.params.id as string);
    sendSuccess(res, tutor, "Tutor obtenido exitosamente");
  });

  static crear = asyncHandler(async (req: Request, res: Response) => {
    validacionTutor.validarCrear(req.body);
    const tutor = await servicioTutor.crear(req.body);
    sendSuccess(res, tutor, "Tutor creado exitosamente", HTTP_STATUS.CREATED);
  });

  static actualizar = asyncHandler(async (req: Request, res: Response) => {
    validacionTutor.validarActualizar(req.body);
    const tutor = await servicioTutor.actualizar(req.params.id as string, req.body);
    sendSuccess(res, tutor, "Tutor actualizado exitosamente");
  });

  static eliminar = asyncHandler(async (req: Request, res: Response) => {
    await servicioTutor.eliminar(req.params.id as string);
    sendSuccess(res, null, "Tutor eliminado exitosamente");
  });
}
