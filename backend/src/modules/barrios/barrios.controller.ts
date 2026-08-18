import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendSuccess } from "../../utils/response";
import { HTTP_STATUS } from "../../config/constants";
import { servicioBarrio } from "./barrios.service";
import { validacionBarrio } from "./barrios.validation";

export class ControladorBarrio {
  static listar = asyncHandler(async (req: Request, res: Response) => {
    const localidadId = typeof req.query.localidadId === "string" ? req.query.localidadId : undefined;
    const barrios = await servicioBarrio.listar(localidadId);
    sendSuccess(res, barrios, "Barrios obtenidos exitosamente");
  });

  static buscarPorId = asyncHandler(async (req: Request, res: Response) => {
    const barrio = await servicioBarrio.buscarPorId(req.params.id as string);
    sendSuccess(res, barrio, "Barrio obtenido exitosamente");
  });

  static crear = asyncHandler(async (req: Request, res: Response) => {
    validacionBarrio.validarCrear(req.body);
    const barrio = await servicioBarrio.crear(req.body);
    sendSuccess(res, barrio, "Barrio creado exitosamente", HTTP_STATUS.CREATED);
  });

  static actualizar = asyncHandler(async (req: Request, res: Response) => {
    validacionBarrio.validarActualizar(req.body);
    const barrio = await servicioBarrio.actualizar(req.params.id as string, req.body);
    sendSuccess(res, barrio, "Barrio actualizado exitosamente");
  });

  static eliminar = asyncHandler(async (req: Request, res: Response) => {
    await servicioBarrio.eliminar(req.params.id as string);
    sendSuccess(res, null, "Barrio eliminado exitosamente");
  });
}
