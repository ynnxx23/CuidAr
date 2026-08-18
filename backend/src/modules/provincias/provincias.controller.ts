import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendSuccess } from "../../utils/response";
import { HTTP_STATUS } from "../../config/constants";
import { servicioProvincia } from "./provincias.service";
import { validacionProvincia } from "./provincias.validation";

export class ControladorProvincia {
  static listar = asyncHandler(async (req: Request, res: Response) => {
    const paisId = typeof req.query.paisId === "string" ? req.query.paisId : undefined;
    const provincias = await servicioProvincia.listar(paisId);
    sendSuccess(res, provincias, "Provincias obtenidas exitosamente");
  });

  static buscarPorId = asyncHandler(async (req: Request, res: Response) => {
    const provincia = await servicioProvincia.buscarPorId(req.params.id as string);
    sendSuccess(res, provincia, "Provincia obtenida exitosamente");
  });

  static crear = asyncHandler(async (req: Request, res: Response) => {
    validacionProvincia.validarCrear(req.body);
    const provincia = await servicioProvincia.crear(req.body);
    sendSuccess(res, provincia, "Provincia creada exitosamente", HTTP_STATUS.CREATED);
  });

  static actualizar = asyncHandler(async (req: Request, res: Response) => {
    validacionProvincia.validarActualizar(req.body);
    const provincia = await servicioProvincia.actualizar(req.params.id as string, req.body);
    sendSuccess(res, provincia, "Provincia actualizada exitosamente");
  });

  static eliminar = asyncHandler(async (req: Request, res: Response) => {
    await servicioProvincia.eliminar(req.params.id as string);
    sendSuccess(res, null, "Provincia eliminada exitosamente");
  });
}
