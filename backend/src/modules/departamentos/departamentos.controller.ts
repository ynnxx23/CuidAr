import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendSuccess } from "../../utils/response";
import { HTTP_STATUS } from "../../config/constants";
import { servicioDepartamento } from "./departamentos.service";
import { validacionDepartamento } from "./departamentos.validation";

export class ControladorDepartamento {
  static listar = asyncHandler(async (req: Request, res: Response) => {
    const hospitalId = req.query.hospitalId as string | undefined;
    const departamentos = await servicioDepartamento.listar(hospitalId);
    sendSuccess(res, departamentos, "Departamentos obtenidos exitosamente");
  });

  static buscarPorId = asyncHandler(async (req: Request, res: Response) => {
    const departamento = await servicioDepartamento.buscarPorId(req.params.id as string);
    sendSuccess(res, departamento, "Departamento obtenido exitosamente");
  });

  static crear = asyncHandler(async (req: Request, res: Response) => {
    validacionDepartamento.validarCrear(req.body);
    const departamento = await servicioDepartamento.crear(req.body);
    sendSuccess(res, departamento, "Departamento creado exitosamente", HTTP_STATUS.CREATED);
  });

  static actualizar = asyncHandler(async (req: Request, res: Response) => {
    validacionDepartamento.validarActualizar(req.body);
    const departamento = await servicioDepartamento.actualizar(req.params.id as string, req.body);
    sendSuccess(res, departamento, "Departamento actualizado exitosamente");
  });

  static eliminar = asyncHandler(async (req: Request, res: Response) => {
    await servicioDepartamento.eliminar(req.params.id as string);
    sendSuccess(res, null, "Departamento eliminado exitosamente");
  });
}
