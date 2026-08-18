import { prisma } from "../../config/prisma";

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

export class RepositorioTutor {
  listar() {
    return prisma.tutor.findMany({
      orderBy: { creadoEn: "desc" },
      include: { usuario: SELECT_USUARIO },
    });
  }

  buscarPorId(id: string) {
    return prisma.tutor.findUnique({
      where: { id },
      include: { usuario: SELECT_USUARIO },
    });
  }

  buscarPorUsuarioId(usuarioId: string) {
    return prisma.tutor.findUnique({
      where: { usuarioId },
      include: { usuario: SELECT_USUARIO },
    });
  }

  buscarUsuario(id: string) {
    return prisma.usuario.findUnique({ where: { id } });
  }

  crear(datos: { usuarioId: string; notasRelacion?: string }) {
    return prisma.tutor.create({
      data: {
        usuarioId: datos.usuarioId,
        notasRelacion: datos.notasRelacion ?? null,
      },
      include: { usuario: SELECT_USUARIO },
    });
  }

  actualizar(id: string, datos: { notasRelacion?: string }) {
    return prisma.tutor.update({
      where: { id },
      data: {
        notasRelacion: datos.notasRelacion,
      },
      include: { usuario: SELECT_USUARIO },
    });
  }

  eliminar(id: string) {
    return prisma.tutor.delete({ where: { id } });
  }

  contarRelacionesPacientes(usuarioId: string) {
    return prisma.pacienteTutor.count({ where: { tutorUsuarioId: usuarioId } });
  }
}

export const repositorioTutor = new RepositorioTutor();
