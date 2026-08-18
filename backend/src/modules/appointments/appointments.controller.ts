import { Request, Response, NextFunction } from 'express';
import { servicioTurnos } from './appointments.service';
import {
  validarReservarTurno,
  validarReprogramarTurno,
  validarCancelarTurno,
} from './appointments.validation';
import { sendSuccess } from '../../utils/response';
import { asyncHandler } from '../../utils/asyncHandler';

export class ControladorTurnos {
  static reservar = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    validarReservarTurno(req.body);
    const usuarioId = req.usuario?.usuarioId;
    if (!usuarioId) { sendSuccess(res, null, 'No autenticado', 401); return; }
    const turno = await servicioTurnos.reservar(req.body, usuarioId);
    sendSuccess(res, turno, 'Turno reservado', 201);
  });

  static obtenerPorId = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const turno = await servicioTurnos.obtenerPorId(req.params.id as string);
    sendSuccess(res, turno, 'Turno obtenido');
  });

  static listar = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const {
      hospitalId, medicoId, pacienteId, medicoNombre, pacienteNombre,
      estado, modo, fechaDesde, fechaHasta, especialidadId,
    } = req.query;
    const turnos = await servicioTurnos.listar({
      hospitalId: hospitalId as string | undefined,
      medicoId: medicoId as string | undefined,
      pacienteId: pacienteId as string | undefined,
      medicoNombre: medicoNombre as string | undefined,
      pacienteNombre: pacienteNombre as string | undefined,
      estado: estado as string | undefined,
      modo: modo as string | undefined,
      fechaDesde: fechaDesde as string | undefined,
      fechaHasta: fechaHasta as string | undefined,
      especialidadId: especialidadId as string | undefined,
    });
    sendSuccess(res, turnos, 'Turnos obtenidos');
  });

  static actualizar = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const turno = await servicioTurnos.actualizar(req.params.id as string, req.body);
    sendSuccess(res, turno, 'Turno actualizado');
  });

  static eliminar = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const usuarioId = req.usuario?.usuarioId;
    if (!usuarioId) { sendSuccess(res, null, 'No autenticado', 401); return; }
    await servicioTurnos.eliminar(req.params.id as string, usuarioId);
    sendSuccess(res, null, 'Turno eliminado');
  });

  static confirmar = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const usuarioId = req.usuario?.usuarioId;
    if (!usuarioId) { sendSuccess(res, null, 'No autenticado', 401); return; }
    const turno = await servicioTurnos.confirmar(req.params.id as string, usuarioId);
    sendSuccess(res, turno, 'Turno confirmado');
  });

  static checkIn = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const usuarioId = req.usuario?.usuarioId;
    if (!usuarioId) { sendSuccess(res, null, 'No autenticado', 401); return; }
    const turno = await servicioTurnos.checkIn(req.params.id as string, usuarioId);
    sendSuccess(res, turno, 'Check-in registrado');
  });

  static finalizar = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const usuarioId = req.usuario?.usuarioId;
    if (!usuarioId) { sendSuccess(res, null, 'No autenticado', 401); return; }
    const turno = await servicioTurnos.finalizar(req.params.id as string, usuarioId);
    sendSuccess(res, turno, 'Turno finalizado');
  });

  static cancelar = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    validarCancelarTurno(req.body);
    const usuarioId = req.usuario?.usuarioId;
    if (!usuarioId) { sendSuccess(res, null, 'No autenticado', 401); return; }
    const turno = await servicioTurnos.cancelar(req.params.id as string, usuarioId, req.body);
    sendSuccess(res, turno, 'Turno cancelado');
  });

  static reprogramar = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    validarReprogramarTurno(req.body);
    const usuarioId = req.usuario?.usuarioId;
    if (!usuarioId) { sendSuccess(res, null, 'No autenticado', 401); return; }
    const turno = await servicioTurnos.reprogramar(req.params.id as string, usuarioId, req.body);
    sendSuccess(res, turno, 'Turno reprogramado');
  });
}
