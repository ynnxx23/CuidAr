import { repositorioTurnos } from './appointments.repository';
import { ReservarTurnoDTO, ReprogramarTurnoDTO, CancelarTurnoDTO } from './appointments.validation';
import { NotFoundError, ConflictError } from '../../utils/apiError';
import { logger } from '../../config/logger';

export class ServicioTurnos {
  async reservar(datos: ReservarTurnoDTO, userId: string) {
    const slot = await repositorioTurnos.buscarSlot(datos.slotId);
    if (!slot) throw new NotFoundError('Slot no encontrado');
    if (slot.estado !== 'disponible') throw new ConflictError('El slot no está disponible');

    const yaReservado = await repositorioTurnos.existeTurnoParaSlot(datos.slotId);
    if (yaReservado) throw new ConflictError('El slot ya tiene un turno asignado');

    if (datos.pacienteId) {
      const paciente = await repositorioTurnos.buscarPaciente(datos.pacienteId);
      if (!paciente) throw new NotFoundError('Paciente no encontrado');

      const conflictoPaciente = await repositorioTurnos.existeTurnoActivoParaPaciente(
        datos.pacienteId,
        slot.fechaBloque,
        slot.horaInicio,
      );
      if (conflictoPaciente) {
        throw new ConflictError('El paciente ya tiene un turno en ese horario');
      }
    }

    const especialidad = await repositorioTurnos.buscarEspecialidad(datos.especialidadId);
    if (!especialidad) throw new NotFoundError('Especialidad no encontrada');

    if (datos.consultorioId) {
      const consultorio = await repositorioTurnos.buscarConsultorio(datos.consultorioId);
      if (!consultorio || consultorio.hospitalId !== slot.hospitalId) {
        throw new NotFoundError('Consultorio no válido para este hospital');
      }
    }

    const turno = await repositorioTurnos.crear({
      bloqueId: datos.slotId,
      hospitalId: slot.hospitalId,
      medicoId: slot.medicoId,
      pacienteId: datos.pacienteId,
      especialidadId: datos.especialidadId,
      consultorioId: datos.consultorioId,
      creadoPorUsuarioId: userId,
      fechaTurno: slot.fechaBloque,
      horaInicio: slot.horaInicio,
      horaFin: slot.horaFin,
      modo: datos.modo,
      motivo: datos.motivo,
      notas: datos.notas,
    });

    await repositorioTurnos.marcarSlotEstado(datos.slotId, 'reservado');
    await repositorioTurnos.actualizarEstado(turno.id, 'reservado', userId);

    logger.info({ turnoId: turno.id, medicoId: slot.medicoId, pacienteId: datos.pacienteId }, 'Turno reservado');

    return repositorioTurnos.buscarPorId(turno.id);
  }

  async confirmar(id: string, userId: string) {
    const turno = await repositorioTurnos.buscarPorId(id);
    if (!turno) throw new NotFoundError('Turno no encontrado');
    if (turno.estado !== 'reservado') {
      throw new ConflictError('Solo se pueden confirmar turnos en estado reservado');
    }

    await repositorioTurnos.actualizarEstado(id, 'confirmado', userId);
    return repositorioTurnos.buscarPorId(id);
  }

  async checkIn(id: string, userId: string) {
    const turno = await repositorioTurnos.buscarPorId(id);
    if (!turno) throw new NotFoundError('Turno no encontrado');
    if (turno.estado !== 'confirmado') {
      throw new ConflictError('Solo se puede hacer check-in de turnos confirmados');
    }

    await repositorioTurnos.actualizarEstado(id, 'enCurso', userId);
    return repositorioTurnos.buscarPorId(id);
  }

  async finalizar(id: string, userId: string) {
    const turno = await repositorioTurnos.buscarPorId(id);
    if (!turno) throw new NotFoundError('Turno no encontrado');
    if (turno.estado !== 'enCurso') {
      throw new ConflictError('Solo se pueden finalizar turnos en curso');
    }

    await repositorioTurnos.actualizarEstado(id, 'atendido', userId);
    return repositorioTurnos.buscarPorId(id);
  }

  async cancelar(id: string, userId: string, datos: CancelarTurnoDTO) {
    const turno = await repositorioTurnos.buscarPorId(id);
    if (!turno) throw new NotFoundError('Turno no encontrado');
    if (['cancelado', 'atendido', 'ausente'].includes(turno.estado)) {
      throw new ConflictError('No se puede cancelar un turno en este estado');
    }

    if (turno.bloqueId) {
      await repositorioTurnos.marcarSlotEstado(turno.bloqueId, 'disponible');
    }
    await repositorioTurnos.actualizarEstado(id, 'cancelado', userId, datos.motivo);
    await repositorioTurnos.actualizar(id, { bloqueId: null } as Record<string, unknown>);

    logger.info({ turnoId: id, motivo: datos.motivo }, 'Turno cancelado');
    return repositorioTurnos.buscarPorId(id);
  }

  async reprogramar(id: string, userId: string, datos: ReprogramarTurnoDTO) {
    const turno = await repositorioTurnos.buscarPorId(id);
    if (!turno) throw new NotFoundError('Turno no encontrado');
    if (!['reservado', 'confirmado'].includes(turno.estado)) {
      throw new ConflictError('No se puede reprogramar un turno en este estado');
    }

    const nuevoSlot = await repositorioTurnos.buscarSlot(datos.nuevoSlotId);
    if (!nuevoSlot) throw new NotFoundError('Nuevo slot no encontrado');
    if (nuevoSlot.estado !== 'disponible') throw new ConflictError('El nuevo slot no está disponible');

    const yaReservado = await repositorioTurnos.existeTurnoParaSlot(datos.nuevoSlotId);
    if (yaReservado) throw new ConflictError('El nuevo slot ya tiene un turno asignado');

    if (turno.pacienteId) {
      const conflictoPaciente = await repositorioTurnos.existeTurnoActivoParaPaciente(
        turno.pacienteId,
        nuevoSlot.fechaBloque,
        nuevoSlot.horaInicio,
      );
      if (conflictoPaciente) {
        throw new ConflictError('El paciente tiene un conflicto de horario en el nuevo slot');
      }
    }

    if (turno.bloqueId) {
      await repositorioTurnos.marcarSlotEstado(turno.bloqueId, 'disponible');
    }

    await repositorioTurnos.actualizar(id, {
      bloqueId: datos.nuevoSlotId,
      hospitalId: nuevoSlot.hospitalId,
      fechaTurno: nuevoSlot.fechaBloque,
      horaInicio: nuevoSlot.horaInicio,
      horaFin: nuevoSlot.horaFin,
      estado: 'reservado',
    });

    await repositorioTurnos.marcarSlotEstado(datos.nuevoSlotId, 'reservado');
    await repositorioTurnos.actualizarEstado(id, 'reprogramado', userId, datos.motivo);

    logger.info({ turnoId: id, nuevoSlotId: datos.nuevoSlotId }, 'Turno reprogramado');
    return repositorioTurnos.buscarPorId(id);
  }

  async eliminar(id: string, userId: string) {
    const turno = await repositorioTurnos.buscarPorId(id);
    if (!turno) throw new NotFoundError('Turno no encontrado');
    if (!['cancelado', 'reprogramado'].includes(turno.estado)) {
      throw new ConflictError('Solo se pueden eliminar turnos cancelados o reprogramados');
    }

    await repositorioTurnos.eliminar(id);
    logger.info({ turnoId: id, eliminadoPor: userId }, 'Turno eliminado');
  }

  async actualizar(id: string, datos: { notas?: string; motivo?: string; consultorioId?: string }) {
    const turno = await repositorioTurnos.buscarPorId(id);
    if (!turno) throw new NotFoundError('Turno no encontrado');
    if (!['reservado', 'confirmado'].includes(turno.estado)) {
      throw new ConflictError('No se puede editar un turno en este estado');
    }

    if (datos.consultorioId && datos.consultorioId !== turno.consultorioId) {
      const consultorio = await repositorioTurnos.buscarConsultorio(datos.consultorioId);
      if (!consultorio || consultorio.hospitalId !== turno.hospitalId) {
        throw new NotFoundError('Consultorio no válido para este hospital');
      }
    }

    return repositorioTurnos.actualizar(id, datos as Record<string, unknown>);
  }

  async obtenerPorId(id: string) {
    const turno = await repositorioTurnos.buscarPorId(id);
    if (!turno) throw new NotFoundError('Turno no encontrado');
    return turno;
  }

  async listar(filtros: {
    hospitalId?: string;
    medicoId?: string;
    pacienteId?: string;
    medicoNombre?: string;
    pacienteNombre?: string;
    estado?: string;
    modo?: string;
    fechaDesde?: string;
    fechaHasta?: string;
    especialidadId?: string;
  }) {
    return repositorioTurnos.listar(filtros);
  }
}

export const servicioTurnos = new ServicioTurnos();
