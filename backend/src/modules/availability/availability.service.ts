import { repositorioDisponibilidad } from './availability.repository';
import { CrearReglaDTO, ActualizarReglaDTO, CrearExcepcionDTO } from './availability.validation';
import { NotFoundError, ValidationError, ConflictError } from '../../utils/apiError';

export class ServicioDisponibilidad {
  private extraerHora(valor: unknown): string {
    const d = valor instanceof Date ? valor : new Date(valor as string);
    return `${String(d.getUTCHours()).padStart(2, '0')}:${String(d.getUTCMinutes()).padStart(2, '0')}`;
  }

  async crearRegla(datos: CrearReglaDTO) {
    const medico = await repositorioDisponibilidad.buscarMedico(datos.medicoId);
    if (!medico) throw new NotFoundError('Médico no encontrado');

    const hospital = await repositorioDisponibilidad.buscarHospital(datos.hospitalId);
    if (!hospital) throw new NotFoundError('Hospital no encontrado');

    if (datos.departamentoId) {
      const depto = await repositorioDisponibilidad.buscarDepartamento(datos.departamentoId);
      if (!depto || depto.hospitalId !== datos.hospitalId) {
        throw new ValidationError('Departamento no pertenece al hospital especificado');
      }
    }

    const existente = await repositorioDisponibilidad.buscarReglaDuplicada(
      datos.medicoId,
      datos.hospitalId,
      datos.diaSemana,
      datos.horaInicio,
    );
    if (existente) {
      throw new ValidationError('Ya existe una regla para este médico, día y hora de inicio');
    }

    return repositorioDisponibilidad.crearRegla(datos);
  }

  async obtenerRegla(id: string) {
    const regla = await repositorioDisponibilidad.buscarReglaPorId(id);
    if (!regla) throw new NotFoundError('Regla de disponibilidad no encontrada');
    return regla;
  }

  async listarReglas(medicoId?: string, hospitalId?: string) {
    return repositorioDisponibilidad.listarReglas(medicoId, hospitalId);
  }

  async actualizarRegla(id: string, datos: ActualizarReglaDTO) {
    const regla = await repositorioDisponibilidad.buscarReglaPorId(id);
    if (!regla) throw new NotFoundError('Regla de disponibilidad no encontrada');

    const horaInicio = datos.horaInicio || this.extraerHora(regla.horaInicio);
    const horaFin = datos.horaFin || this.extraerHora(regla.horaFin);
    if (horaInicio >= horaFin) {
      throw new ValidationError('La hora de fin debe ser posterior a la hora de inicio');
    }

    return repositorioDisponibilidad.actualizarRegla(id, datos as Record<string, unknown>);
  }

  async eliminarRegla(id: string) {
    const regla = await repositorioDisponibilidad.buscarReglaPorId(id);
    if (!regla) throw new NotFoundError('Regla de disponibilidad no encontrada');

    const bloques = await repositorioDisponibilidad.contarBloquesPorRegla(id);
    if (bloques > 0) {
      throw new ConflictError('No se puede eliminar: existen bloques horarios generados desde esta regla');
    }

    return repositorioDisponibilidad.eliminarRegla(id);
  }

  async crearExcepcion(datos: CrearExcepcionDTO) {
    const medico = await repositorioDisponibilidad.buscarMedico(datos.medicoId);
    if (!medico) throw new NotFoundError('Médico no encontrado');

    const hospital = await repositorioDisponibilidad.buscarHospital(datos.hospitalId);
    if (!hospital) throw new NotFoundError('Hospital no encontrado');

    if (datos.horaInicio && datos.horaFin && datos.horaInicio >= datos.horaFin) {
      throw new ValidationError('La hora de fin debe ser posterior a la hora de inicio');
    }

    return repositorioDisponibilidad.crearExcepcion(datos);
  }

  async listarExcepciones(medicoId?: string, hospitalId?: string, fecha?: string) {
    return repositorioDisponibilidad.listarExcepciones(medicoId, hospitalId, fecha);
  }

  async eliminarExcepcion(id: string) {
    const excepcion = await repositorioDisponibilidad.buscarExcepcionPorId(id);
    if (!excepcion) throw new NotFoundError('Excepción no encontrada');
    return repositorioDisponibilidad.eliminarExcepcion(id);
  }
}

export const servicioDisponibilidad = new ServicioDisponibilidad();
