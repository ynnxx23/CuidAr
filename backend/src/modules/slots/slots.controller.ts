import { Request, Response, NextFunction } from 'express';
import { servicioSlots } from './slots.service';
import { sendSuccess } from '../../utils/response';
import { asyncHandler } from '../../utils/asyncHandler';
import { ValidationError } from '../../utils/apiError';

export class ControladorSlots {
  static generar = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const { medicoId, hospitalId, fechaInicio, fechaFin } = req.body;
    if (!medicoId || !hospitalId || !fechaInicio || !fechaFin) {
      throw new ValidationError('medicoId, hospitalId, fechaInicio y fechaFin son obligatorios');
    }
    const resultado = await servicioSlots.generarSlots({ medicoId, hospitalId, fechaInicio, fechaFin });
    sendSuccess(res, resultado, 'Slots generados', 201);
  });

  static regenerar = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const { medicoId, hospitalId, fechaInicio, fechaFin } = req.body;
    if (!medicoId || !hospitalId || !fechaInicio || !fechaFin) {
      throw new ValidationError('medicoId, hospitalId, fechaInicio y fechaFin son obligatorios');
    }
    const resultado = await servicioSlots.regenerarSlots({ medicoId, hospitalId, fechaInicio, fechaFin });
    sendSuccess(res, resultado, 'Slots regenerados', 201);
  });

  static listarDisponibles = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const { doctorId, hospitalId, date } = req.query;
    if (!doctorId || !hospitalId || !date) {
      throw new ValidationError('doctorId, hospitalId y date son obligatorios');
    }
    const slots = await servicioSlots.listarSlotsDisponibles(
      doctorId as string,
      hospitalId as string,
      date as string,
    );
    sendSuccess(res, slots, 'Slots disponibles');
  });

  static listarPorMedico = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const doctorId = req.params.doctorId as string;
    const { hospitalId } = req.query;
    const slots = await servicioSlots.listarSlotsPorMedico(doctorId, hospitalId as string | undefined);
    sendSuccess(res, slots, 'Slots del médico');
  });

  static bloquear = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const slot = await servicioSlots.bloquearSlot(req.params.id as string);
    sendSuccess(res, slot, 'Slot bloqueado');
  });

  static desbloquear = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const slot = await servicioSlots.desbloquearSlot(req.params.id as string);
    sendSuccess(res, slot, 'Slot desbloqueado');
  });
}
