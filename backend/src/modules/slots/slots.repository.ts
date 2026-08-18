import { prisma } from '../../config/prisma';
import { SlotGenerado } from './slots.constants';

export class RepositorioSlots {
  async buscarMedico(id: string) {
    return prisma.medico.findUnique({ where: { id } });
  }

  async buscarHospital(id: string) {
    return prisma.hospital.findUnique({ where: { id } });
  }

  async buscarEspecialidadMedico(medicoId: string) {
    return prisma.especialidadMedico.findFirst({ where: { medicoId } });
  }

  async listarReglasActivas(medicoId: string, hospitalId: string) {
    return prisma.reglaDisponibilidadMedico.findMany({
      where: { medicoId, hospitalId, activo: true },
    });
  }

  async listarExcepciones(medicoId: string, hospitalId: string, fechaInicio: Date, fechaFin: Date) {
    return prisma.excepcionDisponibilidadMedico.findMany({
      where: {
        medicoId,
        hospitalId,
        fecha: { gte: fechaInicio, lte: fechaFin },
      },
    });
  }

  async crearMuchos(slots: SlotGenerado[]) {
    const chunkSize = 500;
    let total = 0;
    for (let i = 0; i < slots.length; i += chunkSize) {
      const chunk = slots.slice(i, i + chunkSize);
      const result = await prisma.bloqueHorario.createMany({
        data: chunk.map((s) => ({
          medicoId: s.medicoId,
          hospitalId: s.hospitalId,
          departamentoId: s.departamentoId,
          especialidadId: s.especialidadId,
          reglaDisponibilidadId: s.reglaDisponibilidadId,
          fechaBloque: s.fechaBloque,
          horaInicio: s.horaInicio,
          horaFin: s.horaFin,
          estado: 'disponible' as const,
        })),
        skipDuplicates: true,
      });
      total += result.count;
    }
    return total;
  }

  async eliminarPorMedicoHospitalFecha(medicoId: string, hospitalId: string, fechaInicio: Date, fechaFin: Date) {
    return prisma.bloqueHorario.deleteMany({
      where: {
        medicoId,
        hospitalId,
        fechaBloque: { gte: fechaInicio, lte: fechaFin },
        estado: 'disponible',
      },
    });
  }

  async buscarPorId(id: string) {
    return prisma.bloqueHorario.findUnique({
      where: { id },
      include: {
        medico: { include: { usuario: true } },
        hospital: true,
        especialidad: true,
        consultorio: true,
      },
    });
  }

  async buscarDisponibles(medicoId: string, hospitalId: string, fecha: Date) {
    return prisma.bloqueHorario.findMany({
      where: { medicoId, hospitalId, fechaBloque: fecha, estado: 'disponible' },
      include: {
        medico: { include: { usuario: true } },
        hospital: true,
        especialidad: true,
        consultorio: true,
      },
      orderBy: { horaInicio: 'asc' },
    });
  }

  async buscarPorMedico(medicoId: string, hospitalId?: string) {
    const where: Record<string, unknown> = { medicoId };
    if (hospitalId) where.hospitalId = hospitalId;
    return prisma.bloqueHorario.findMany({
      where,
      include: { hospital: true, especialidad: true, consultorio: true },
      orderBy: [{ fechaBloque: 'asc' }, { horaInicio: 'asc' }],
    });
  }

  async marcarEstado(id: string, estado: string) {
    return prisma.bloqueHorario.update({
      where: { id },
      data: { estado: estado as never },
    });
  }
}

export const repositorioSlots = new RepositorioSlots();
