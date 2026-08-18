import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendSuccess } from "../../utils/response";
import { HTTP_STATUS } from "../../config/constants";
import { servicioPais } from "./paises.service";
import { validacionPais } from "./paises.validation";

export class ControladorPais {
  static listar = asyncHandler(async (req: Request, res: Response) => {
    const incluirProvincias = req.query.incluirProvincias === "true";
    const paises = await servicioPais.listar(incluirProvincias);
    sendSuccess(res, paises, "Países obtenidos exitosamente");
  });

  static buscarPorId = asyncHandler(async (req: Request, res: Response) => {
    const pais = await servicioPais.buscarPorId(req.params.id as string);
    sendSuccess(res, pais, "País obtenido exitosamente");
  });

  static crear = asyncHandler(async (req: Request, res: Response) => {
    validacionPais.validarCrear(req.body);
    const pais = await servicioPais.crear(req.body);
    sendSuccess(res, pais, "País creado exitosamente", HTTP_STATUS.CREATED);
  });

  static actualizar = asyncHandler(async (req: Request, res: Response) => {
    validacionPais.validarActualizar(req.body);
    const pais = await servicioPais.actualizar(req.params.id as string, req.body);
    sendSuccess(res, pais, "País actualizado exitosamente");
  });

  static eliminar = asyncHandler(async (req: Request, res: Response) => {
    await servicioPais.eliminar(req.params.id as string);
    sendSuccess(res, null, "País eliminado exitosamente");
  });
}
