import { Request, Response, NextFunction } from 'express';
import { servicioDisponibilidad } from './availability.service';
import { validarCrearRegla, validarActualizarRegla, validarCrearExcepcion } from './availability.validation';
import { sendSuccess } from '../../utils/response';
import { asyncHandler } from '../../utils/asyncHandler';

export class ControladorDisponibilidad {
  static crearRegla = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    validarCrearRegla(req.body);
    const regla = await servicioDisponibilidad.crearRegla(req.body);
    sendSuccess(res, regla, 'Regla de disponibilidad creada', 201);
  });

  static listarReglas = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const { medicoId, hospitalId } = req.query;
    const reglas = await servicioDisponibilidad.listarReglas(
      medicoId as string | undefined,
      hospitalId as string | undefined,
    );
    sendSuccess(res, reglas, 'Reglas obtenidas');
  });

  static obtenerRegla = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const regla = await servicioDisponibilidad.obtenerRegla(req.params.id as string);
    sendSuccess(res, regla, 'Regla obtenida');
  });

  static actualizarRegla = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    validarActualizarRegla(req.body);
    const regla = await servicioDisponibilidad.actualizarRegla(req.params.id as string, req.body);
    sendSuccess(res, regla, 'Regla actualizada');
  });

  static eliminarRegla = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    await servicioDisponibilidad.eliminarRegla(req.params.id as string);
    sendSuccess(res, null, 'Regla eliminada');
  });

  static crearExcepcion = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    validarCrearExcepcion(req.body);
    const excepcion = await servicioDisponibilidad.crearExcepcion(req.body);
    sendSuccess(res, excepcion, 'Excepción creada', 201);
  });

  static listarExcepciones = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const { medicoId, hospitalId, fecha } = req.query;
    const excepciones = await servicioDisponibilidad.listarExcepciones(
      medicoId as string | undefined,
      hospitalId as string | undefined,
      fecha as string | undefined,
    );
    sendSuccess(res, excepciones, 'Excepciones obtenidas');
  });

  static eliminarExcepcion = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    await servicioDisponibilidad.eliminarExcepcion(req.params.id as string);
    sendSuccess(res, null, 'Excepción eliminada');
  });
}
