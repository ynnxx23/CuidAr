import { prisma } from '../../config/prisma';

export class RepositorioTurnos {
  async buscarMedico(id: string) {
    return prisma.medico.findUnique({ where: { id } });
  }

  async buscarPaciente(id: string) {
    return prisma.paciente.findUnique({ where: { id } });
  }

  async buscarEspecialidad(id: string) {
    return prisma.especialidad.findUnique({ where: { id } });
  }

  async buscarConsultorio(id: string) {
    return prisma.consultorio.findUnique({ where: { id } });
  }

  async buscarSlot(id: string) {
    return prisma.bloqueHorario.findUnique({ where: { id } });
  }

  async crear(datos: {
    bloqueId: string;
    hospitalId: string;
    medicoId: string;
    pacienteId?: string;
    especialidadId: string;
    consultorioId?: string;
    creadoPorUsuarioId: string;
    fechaTurno: Date;
    horaInicio: Date;
    horaFin: Date;
    modo: string;
    motivo?: string;
    notas?: string;
  }) {
    return prisma.turno.create({
      data: {
        bloqueId: datos.bloqueId,
        hospitalId: datos.hospitalId,
        medicoId: datos.medicoId,
        pacienteId: datos.pacienteId || null,
        especialidadId: datos.especialidadId,
        consultorioId: datos.consultorioId || null,
        creadoPorUsuarioId: datos.creadoPorUsuarioId,
        fechaTurno: datos.fechaTurno,
        horaInicio: datos.horaInicio,
        horaFin: datos.horaFin,
        modo: datos.modo as never,
        estado: 'reservado',
        motivo: datos.motivo || null,
        notas: datos.notas || null,
      },
    });
  }

  async buscarPorId(id: string) {
    return prisma.turno.findUnique({
      where: { id },
      include: {
        medico: { include: { usuario: true } },
        paciente: { include: { usuario: true } },
        hospital: true,
        especialidad: true,
        consultorio: true,
        creadoPor: true,
        slot: true,
        statusHistory: { orderBy: { creadoEn: 'asc' } },
      },
    });
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
    const where: Record<string, unknown> = {};
    if (filtros.hospitalId) where.hospitalId = filtros.hospitalId;
    if (filtros.medicoId) where.medicoId = filtros.medicoId;
    if (filtros.pacienteId) where.pacienteId = filtros.pacienteId;
    if (filtros.estado) where.estado = filtros.estado;
    if (filtros.modo) where.modo = filtros.modo;
    if (filtros.especialidadId) where.especialidadId = filtros.especialidadId;

    if (filtros.medicoNombre) {
      where.medico = {
        usuario: {
          OR: [
            { nombre: { contains: filtros.medicoNombre, mode: 'insensitive' } },
            { apellido: { contains: filtros.medicoNombre, mode: 'insensitive' } },
          ],
        },
      };
    }

    if (filtros.pacienteNombre) {
      where.paciente = {
        usuario: {
          OR: [
            { nombre: { contains: filtros.pacienteNombre, mode: 'insensitive' } },
            { apellido: { contains: filtros.pacienteNombre, mode: 'insensitive' } },
          ],
        },
      };
    }

    if (filtros.fechaDesde || filtros.fechaHasta) {
      where.fechaTurno = {};
      if (filtros.fechaDesde) (where.fechaTurno as Record<string, unknown>).gte = new Date(filtros.fechaDesde);
      if (filtros.fechaHasta) (where.fechaTurno as Record<string, unknown>).lte = new Date(filtros.fechaHasta);
    }

    return prisma.turno.findMany({
      where,
      include: {
        medico: { include: { usuario: true } },
        paciente: { include: { usuario: true } },
        hospital: true,
        especialidad: true,
      },
      orderBy: [{ fechaTurno: 'asc' }, { horaInicio: 'asc' }],
    });
  }

  async actualizarEstado(id: string, nuevoEstado: string, cambiadoPorId?: string, motivo?: string) {
    const turno = await prisma.turno.findUnique({ where: { id } });
    if (!turno) return null;

    const [actualizado] = await prisma.$transaction([
      prisma.turno.update({
        where: { id },
        data: { estado: nuevoEstado as never },
      }),
      prisma.historialEstadoTurno.create({
        data: {
          turnoId: id,
          estadoAnterior: turno.estado,
          estadoNuevo: nuevoEstado,
          cambiadoPorUsuarioId: cambiadoPorId || null,
          motivo: motivo || null,
        },
      }),
    ]);

    return actualizado;
  }

  async actualizar(id: string, datos: Record<string, unknown>) {
    return prisma.turno.update({ where: { id }, data: datos });
  }

  async eliminar(id: string) {
    return prisma.turno.delete({ where: { id } });
  }

  async marcarSlotEstado(slotId: string, estado: string) {
    return prisma.bloqueHorario.update({
      where: { id: slotId },
      data: { estado: estado as never },
    });
  }

  async existeTurnoParaSlot(slotId: string) {
    const turno = await prisma.turno.findFirst({
      where: { bloqueId: slotId, estado: { in: ['reservado', 'confirmado', 'enCurso'] } },
    });
    return !!turno;
  }

  async existeTurnoActivoParaMedico(medicoId: string, fecha: Date, horaInicio: Date, hospitalId: string) {
    const turno = await prisma.turno.findFirst({
      where: {
        medicoId,
        hospitalId,
        fechaTurno: fecha,
        horaInicio,
        estado: { in: ['reservado', 'confirmado', 'enCurso'] },
      },
    });
    return !!turno;
  }

  async existeTurnoActivoParaPaciente(pacienteId: string, fecha: Date, horaInicio: Date) {
    const turno = await prisma.turno.findFirst({
      where: {
        pacienteId,
        fechaTurno: fecha,
        horaInicio,
        estado: { in: ['reservado', 'confirmado', 'enCurso'] },
      },
    });
    return !!turno;
  }
}

export const repositorioTurnos = new RepositorioTurnos();
