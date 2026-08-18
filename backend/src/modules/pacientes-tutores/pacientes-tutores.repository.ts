import { prisma } from "../../config/prisma";
import { EstadoVerificacion } from "../../generated/prisma/client";

const SELECT_USUARIO = {
  select: {
    id: true,
    dni: true,
    nombre: true,
    apellido: true,
    correoElectronico: true,
    telefono: true,
    fechaNacimiento: true,
    genero: true,
  },
};

export class RepositorioPacienteTutor {
  listar(pacienteId?: string) {
    return prisma.pacienteTutor.findMany({
      where: {
        ...(pacienteId ? { pacienteId } : {}),
      },
      orderBy: { creadoEn: "desc" },
      include: {
        paciente: { include: { usuario: SELECT_USUARIO } },
        tutor: { include: { usuario: SELECT_USUARIO } },
      },
    });
  }

  buscarPorId(id: string) {
    return prisma.pacienteTutor.findUnique({
      where: { id },
      include: {
        paciente: { include: { usuario: SELECT_USUARIO } },
        tutor: { include: { usuario: SELECT_USUARIO } },
      },
    });
  }

  buscarPaciente(id: string) {
    return prisma.paciente.findUnique({ where: { id } });
  }

  buscarTutorPorUsuarioId(usuarioId: string) {
    return prisma.tutor.findUnique({ where: { usuarioId } });
  }

  buscarPorPacienteYTutor(pacienteId: string, tutorUsuarioId: string) {
    return prisma.pacienteTutor.findUnique({
      where: { pacienteId_tutorUsuarioId: { pacienteId, tutorUsuarioId } },
    });
  }

  crear(datos: {
    pacienteId: string;
    tutorUsuarioId: string;
    tipoRelacion: string;
    estadoAutorizacion?: string;
  }) {
    return prisma.pacienteTutor.create({
      data: {
        pacienteId: datos.pacienteId,
        tutorUsuarioId: datos.tutorUsuarioId,
        tipoRelacion: datos.tipoRelacion,
        estadoAutorizacion: (datos.estadoAutorizacion ?? "pendiente") as EstadoVerificacion,
      },
      include: {
        paciente: { include: { usuario: SELECT_USUARIO } },
        tutor: { include: { usuario: SELECT_USUARIO } },
      },
    });
  }

  actualizar(id: string, datos: { tipoRelacion?: string; estadoAutorizacion?: string }) {
    return prisma.pacienteTutor.update({
      where: { id },
      data: {
        tipoRelacion: datos.tipoRelacion,
        estadoAutorizacion: datos.estadoAutorizacion as EstadoVerificacion | undefined,
      },
      include: {
        paciente: { include: { usuario: SELECT_USUARIO } },
        tutor: { include: { usuario: SELECT_USUARIO } },
      },
    });
  }

  eliminar(id: string) {
    return prisma.pacienteTutor.delete({ where: { id } });
  }
}

export const repositorioPacienteTutor = new RepositorioPacienteTutor();
