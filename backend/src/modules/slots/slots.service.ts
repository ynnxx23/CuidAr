import { repositorioSlots } from './slots.repository';
import { SlotGenerado } from './slots.constants';
import { NotFoundError, ValidationError, ConflictError } from '../../utils/apiError';
import { logger } from '../../config/logger';

export interface GenerarSlotsDTO {
  medicoId: string;
  hospitalId: string;
  fechaInicio: string;
  fechaFin: string;
}

export class ServicioSlots {
  async generarSlots(datos: GenerarSlotsDTO) {
    const medico = await repositorioSlots.buscarMedico(datos.medicoId);
    if (!medico) throw new NotFoundError('Médico no encontrado');

    const hospital = await repositorioSlots.buscarHospital(datos.hospitalId);
    if (!hospital) throw new NotFoundError('Hospital no encontrado');

    const reglas = await repositorioSlots.listarReglasActivas(datos.medicoId, datos.hospitalId);
    if (reglas.length === 0) {
      throw new ValidationError('No hay reglas de disponibilidad activas para este médico en este hospital');
    }

    const fechaInicio = new Date(datos.fechaInicio);
    const fechaFin = new Date(datos.fechaFin);

    if (fechaInicio > fechaFin) {
      throw new ValidationError('La fecha de inicio debe ser anterior a la fecha de fin');
    }

    const diasEnRango = Math.ceil((fechaFin.getTime() - fechaInicio.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    if (diasEnRango > 90) {
      throw new ValidationError('El rango no puede superar 90 días');
    }

    const excepciones = await repositorioSlots.listarExcepciones(
      datos.medicoId,
      datos.hospitalId,
      fechaInicio,
      fechaFin,
    );

    const especialidadMedico = await repositorioSlots.buscarEspecialidadMedico(datos.medicoId);
    const especialidadId = especialidadMedico?.especialidadId || '';

    const slotsGenerados = this.generarSlotsEnRango(
      reglas,
      fechaInicio,
      fechaFin,
      especialidadId,
      excepciones,
    );

    const slotsCreados = await repositorioSlots.crearMuchos(slotsGenerados);

    logger.info({ medicoId: datos.medicoId, hospitalId: datos.hospitalId, slotsCreados }, 'Slots generados');
    return { slotsCreados };
  }

  async regenerarSlots(datos: GenerarSlotsDTO) {
    const fechaInicio = new Date(datos.fechaInicio);
    const fechaFin = new Date(datos.fechaFin);

    if (fechaInicio > fechaFin) {
      throw new ValidationError('La fecha de inicio debe ser anterior a la fecha de fin');
    }

    const medico = await repositorioSlots.buscarMedico(datos.medicoId);
    if (!medico) throw new NotFoundError('Médico no encontrado');

    const hospital = await repositorioSlots.buscarHospital(datos.hospitalId);
    if (!hospital) throw new NotFoundError('Hospital no encontrado');

    await repositorioSlots.eliminarPorMedicoHospitalFecha(datos.medicoId, datos.hospitalId, fechaInicio, fechaFin);

    return this.generarSlots(datos);
  }

  async listarSlotsDisponibles(medicoId: string, hospitalId: string, fecha: string) {
    return repositorioSlots.buscarDisponibles(medicoId, hospitalId, new Date(fecha));
  }

  async listarSlotsPorMedico(medicoId: string, hospitalId?: string) {
    return repositorioSlots.buscarPorMedico(medicoId, hospitalId);
  }

  async bloquearSlot(id: string) {
    const slot = await repositorioSlots.buscarPorId(id);
    if (!slot) throw new NotFoundError('Slot no encontrado');
    if (slot.estado !== 'disponible') {
      throw new ConflictError('El slot no está disponible');
    }
    return repositorioSlots.marcarEstado(id, 'bloqueado');
  }

  async desbloquearSlot(id: string) {
    const slot = await repositorioSlots.buscarPorId(id);
    if (!slot) throw new NotFoundError('Slot no encontrado');
    if (slot.estado !== 'bloqueado') {
      throw new ConflictError('El slot no está bloqueado');
    }
    return repositorioSlots.marcarEstado(id, 'disponible');
  }

  private generarSlotsEnRango(
    reglas: Array<{
      id: string;
      horaInicio: Date;
      horaFin: Date;
      duracionBloqueMinutos: number;
      minutosDescanso: number;
      medicoId: string;
      hospitalId: string;
      departamentoId: string | null;
      diaSemana: number;
    }>,
    fechaInicio: Date,
    fechaFin: Date,
    especialidadId: string,
    excepciones: Array<{
      fecha: Date;
      tipoExcepcion: string;
      horaInicio: Date | null;
      horaFin: Date | null;
    }>,
  ): SlotGenerado[] {
    const slots: SlotGenerado[] = [];
    const fechaActual = new Date(fechaInicio);

    while (fechaActual <= fechaFin) {
      const diaSemana = fechaActual.getDay();
      const regla = reglas.find((r) => r.diaSemana === diaSemana);

      if (regla) {
        const excepcionDia = excepciones.find(
          (e) => e.fecha.toISOString().split('T')[0] === fechaActual.toISOString().split('T')[0],
        );

        if (excepcionDia && ['ausencia', 'licencia', 'feriado'].includes(excepcionDia.tipoExcepcion)) {
          fechaActual.setDate(fechaActual.getDate() + 1);
          continue;
        }

        const slotsDelDia = this.generarSlotsParaDia(
          regla,
          new Date(fechaActual),
          especialidadId,
          excepcionDia,
        );
        slots.push(...slotsDelDia);
      }

      fechaActual.setDate(fechaActual.getDate() + 1);
    }

    return slots;
  }

  private extraerHora(valor: unknown): string {
    const d = valor instanceof Date ? valor : new Date(valor as string);
    return `${String(d.getUTCHours()).padStart(2, '0')}:${String(d.getUTCMinutes()).padStart(2, '0')}`;
  }

  private generarSlotsParaDia(
    regla: {
      id: string;
      horaInicio: Date;
      horaFin: Date;
      duracionBloqueMinutos: number;
      minutosDescanso: number;
      medicoId: string;
      hospitalId: string;
      departamentoId: string | null;
    },
    fecha: Date,
    especialidadId: string,
    excepcion?: {
      horaInicio: Date | null;
      horaFin: Date | null;
      tipoExcepcion: string;
    } | null,
  ): SlotGenerado[] {
    const horaInicioStr = this.extraerHora(regla.horaInicio);
    const horaFinStr = this.extraerHora(regla.horaFin);

    let inicioMinutos = this.timeAMinutos(horaInicioStr);
    const finMinutos = this.timeAMinutos(horaFinStr);

    if (excepcion?.tipoExcepcion === 'retraso' && excepcion.horaInicio) {
      const retrasoMinutos = this.timeAMinutos(this.extraerHora(excepcion.horaInicio));
      inicioMinutos = Math.max(inicioMinutos, retrasoMinutos);
    }

    if (excepcion?.tipoExcepcion === 'bloqueo' && excepcion.horaInicio && excepcion.horaFin) {
      const bloqueoInicio = this.timeAMinutos(this.extraerHora(excepcion.horaInicio));
      const bloqueoFin = this.timeAMinutos(this.extraerHora(excepcion.horaFin));
      const slotsAntes = this.crearSlotsEnRango(regla, fecha, especialidadId, inicioMinutos, bloqueoInicio);
      const slotsDespues = this.crearSlotsEnRango(regla, fecha, especialidadId, bloqueoFin, finMinutos);
      return [...slotsAntes, ...slotsDespues];
    }

    return this.crearSlotsEnRango(regla, fecha, especialidadId, inicioMinutos, finMinutos);
  }

  private crearSlotsEnRango(
    regla: {
      id: string;
      duracionBloqueMinutos: number;
      minutosDescanso: number;
      medicoId: string;
      hospitalId: string;
      departamentoId: string | null;
    },
    fecha: Date,
    especialidadId: string,
    inicioMinutos: number,
    finMinutos: number,
  ): SlotGenerado[] {
    const slots: SlotGenerado[] = [];
    let actual = inicioMinutos;
    const duracion = regla.duracionBloqueMinutos;
    const descanso = regla.minutosDescanso;

    while (actual + duracion <= finMinutos) {
      slots.push({
        medicoId: regla.medicoId,
        hospitalId: regla.hospitalId,
        departamentoId: regla.departamentoId,
        especialidadId,
        reglaDisponibilidadId: regla.id,
        fechaBloque: new Date(fecha),
        horaInicio: this.minutosADate(actual),
        horaFin: this.minutosADate(actual + duracion),
      });
      actual += duracion + descanso;
    }

    return slots;
  }

  private timeAMinutos(time: string): number {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
  }

  private minutosADate(minutos: number): Date {
    const h = Math.floor(minutos / 60);
    const m = minutos % 60;
    return new Date(`1970-01-01T${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00.000Z`);
  }
}

export const servicioSlots = new ServicioSlots();
