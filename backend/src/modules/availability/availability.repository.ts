import { prisma } from '../../config/prisma';
import { CrearReglaDTO, CrearExcepcionDTO } from './availability.validation';

export class RepositorioDisponibilidad {
  async buscarMedico(id: string) {
    return prisma.medico.findUnique({ where: { id } });
  }

  async buscarHospital(id: string) {
    return prisma.hospital.findUnique({ where: { id } });
  }

  async buscarDepartamento(id: string) {
    return prisma.departamento.findUnique({ where: { id } });
  }

  private convertirHora(hora: string): Date {
    const [h, m] = hora.split(':').map(Number);
    return new Date(`1970-01-01T${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00.000Z`);
  }

  async crearRegla(datos: CrearReglaDTO) {
    return prisma.reglaDisponibilidadMedico.create({
      data: {
        medicoId: datos.medicoId,
        hospitalId: datos.hospitalId,
        departamentoId: datos.departamentoId || null,
        diaSemana: datos.diaSemana,
        horaInicio: this.convertirHora(datos.horaInicio),
        horaFin: this.convertirHora(datos.horaFin),
        duracionBloqueMinutos: datos.duracionBloqueMinutos,
        minutosDescanso: datos.minutosDescanso ?? 0,
      },
    });
  }

  async buscarReglaPorId(id: string) {
    return prisma.reglaDisponibilidadMedico.findUnique({ where: { id } });
  }

  async buscarReglaDuplicada(medicoId: string, hospitalId: string, diaSemana: number, horaInicio: string) {
    const [h, m] = horaInicio.split(':').map(Number);
    const horaInicioDate = new Date(`1970-01-01T${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00.000Z`);
    return prisma.reglaDisponibilidadMedico.findFirst({
      where: { medicoId, hospitalId, diaSemana, horaInicio: horaInicioDate },
    });
  }

  async listarReglas(medicoId?: string, hospitalId?: string) {
    const where: Record<string, unknown> = {};
    if (medicoId) where.medicoId = medicoId;
    if (hospitalId) where.hospitalId = hospitalId;
    return prisma.reglaDisponibilidadMedico.findMany({
      where,
      include: { medico: { include: { usuario: true } }, hospital: true, departamento: true },
      orderBy: [{ medicoId: 'asc' }, { diaSemana: 'asc' }, { horaInicio: 'asc' }],
    });
  }

  async actualizarRegla(id: string, datos: Record<string, unknown>) {
    const data: Record<string, unknown> = { ...datos };
    if (typeof data.horaInicio === 'string') data.horaInicio = this.convertirHora(data.horaInicio);
    if (typeof data.horaFin === 'string') data.horaFin = this.convertirHora(data.horaFin);
    return prisma.reglaDisponibilidadMedico.update({ where: { id }, data });
  }

  async eliminarRegla(id: string) {
    return prisma.reglaDisponibilidadMedico.delete({ where: { id } });
  }

  async contarBloquesPorRegla(reglaId: string) {
    return prisma.bloqueHorario.count({ where: { reglaDisponibilidadId: reglaId } });
  }

  async crearExcepcion(datos: CrearExcepcionDTO) {
    return prisma.excepcionDisponibilidadMedico.create({
      data: {
        medicoId: datos.medicoId,
        hospitalId: datos.hospitalId,
        fecha: new Date(datos.fecha),
        tipoExcepcion: datos.tipoExcepcion,
        horaInicio: datos.horaInicio ? this.convertirHora(datos.horaInicio) : null,
        horaFin: datos.horaFin ? this.convertirHora(datos.horaFin) : null,
        mensaje: datos.mensaje || null,
      },
    });
  }

  async buscarExcepcionPorId(id: string) {
    return prisma.excepcionDisponibilidadMedico.findUnique({ where: { id } });
  }

  async listarExcepciones(medicoId?: string, hospitalId?: string, fecha?: string) {
    const where: Record<string, unknown> = {};
    if (medicoId) where.medicoId = medicoId;
    if (hospitalId) where.hospitalId = hospitalId;
    if (fecha) where.fecha = new Date(fecha);
    return prisma.excepcionDisponibilidadMedico.findMany({
      where,
      include: { medico: { include: { usuario: true } }, hospital: true },
      orderBy: { fecha: 'asc' },
    });
  }

  async eliminarExcepcion(id: string) {
    return prisma.excepcionDisponibilidadMedico.delete({ where: { id } });
  }
}

export const repositorioDisponibilidad = new RepositorioDisponibilidad();
