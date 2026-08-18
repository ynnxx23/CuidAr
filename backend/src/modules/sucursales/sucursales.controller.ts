import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendSuccess } from "../../utils/response";
import { HTTP_STATUS } from "../../config/constants";
import { servicioSucursal } from "./sucursales.service";
import { validacionSucursal } from "./sucursales.validation";

export class ControladorSucursal {
  static listar = asyncHandler(async (req: Request, res: Response) => {
    const hospitalId = req.query.hospitalId as string | undefined;
    const sucursales = await servicioSucursal.listar(hospitalId);
    sendSuccess(res, sucursales, "Sucursales obtenidas exitosamente");
  });

  static buscarPorId = asyncHandler(async (req: Request, res: Response) => {
    const sucursal = await servicioSucursal.buscarPorId(req.params.id as string);
    sendSuccess(res, sucursal, "Sucursal obtenida exitosamente");
  });

  static crear = asyncHandler(async (req: Request, res: Response) => {
    validacionSucursal.validarCrear(req.body);
    const sucursal = await servicioSucursal.crear(req.body);
    sendSuccess(res, sucursal, "Sucursal creada exitosamente", HTTP_STATUS.CREATED);
  });

  static actualizar = asyncHandler(async (req: Request, res: Response) => {
    validacionSucursal.validarActualizar(req.body);
    const sucursal = await servicioSucursal.actualizar(req.params.id as string, req.body);
    sendSuccess(res, sucursal, "Sucursal actualizada exitosamente");
  });

  static eliminar = asyncHandler(async (req: Request, res: Response) => {
    await servicioSucursal.eliminar(req.params.id as string);
    sendSuccess(res, null, "Sucursal eliminada exitosamente");
  });
}
