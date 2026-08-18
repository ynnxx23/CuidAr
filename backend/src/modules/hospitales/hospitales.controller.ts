import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendSuccess } from "../../utils/response";
import { HTTP_STATUS } from "../../config/constants";
import { servicioHospital } from "./hospitales.service";
import { validacionHospital } from "./hospitales.validation";

export class ControladorHospital {
  static listar = asyncHandler(async (req: Request, res: Response) => {
    const provinciaId = req.query.provinciaId as string | undefined;
    const estado = req.query.estado as string | undefined;
    const hospitales = await servicioHospital.listar(provinciaId, estado);
    sendSuccess(res, hospitales, "Hospitales obtenidos exitosamente");
  });

  static buscarPorId = asyncHandler(async (req: Request, res: Response) => {
    const hospital = await servicioHospital.buscarPorId(req.params.id as string);
    sendSuccess(res, hospital, "Hospital obtenido exitosamente");
  });

  static crear = asyncHandler(async (req: Request, res: Response) => {
    validacionHospital.validarCrear(req.body);
    const hospital = await servicioHospital.crear(req.body);
    sendSuccess(res, hospital, "Hospital creado exitosamente", HTTP_STATUS.CREATED);
  });

  static actualizar = asyncHandler(async (req: Request, res: Response) => {
    validacionHospital.validarActualizar(req.body);
    const hospital = await servicioHospital.actualizar(req.params.id as string, req.body);
    sendSuccess(res, hospital, "Hospital actualizado exitosamente");
  });

  static eliminar = asyncHandler(async (req: Request, res: Response) => {
    await servicioHospital.eliminar(req.params.id as string);
    sendSuccess(res, null, "Hospital eliminado exitosamente");
  });
}
