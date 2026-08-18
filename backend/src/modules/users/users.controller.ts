import { Request, Response, NextFunction } from 'express';
import { servicioUsuario } from './users.service';
import { validarActualizarUsuario } from './users.validation';
import { sendSuccess } from '../../utils/response';
import { asyncHandler } from '../../utils/asyncHandler';

export class ControladorUsuario {
  static obtenerPorId = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const usuario = await servicioUsuario.obtenerPorId(req.params.id as string);
    sendSuccess(res, usuario, 'Usuario obtenido');
  });

  static listar = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const { nombre, email, dni, estado } = req.query;
    const usuarios = await servicioUsuario.listar({
      nombre: nombre as string | undefined,
      email: email as string | undefined,
      dni: dni as string | undefined,
      estado: estado as string | undefined,
    });
    sendSuccess(res, usuarios, 'Usuarios obtenidos');
  });

  static actualizar = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    validarActualizarUsuario(req.body);
    const usuario = await servicioUsuario.actualizar(req.params.id as string, req.body);
    sendSuccess(res, usuario, 'Usuario actualizado');
  });

  static eliminar = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    await servicioUsuario.eliminar(req.params.id as string);
    sendSuccess(res, null, 'Usuario eliminado');
  });
}
