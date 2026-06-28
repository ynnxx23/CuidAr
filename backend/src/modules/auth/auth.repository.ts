import { prisma } from "../../config/prisma";

export class RepositorioAuth {
  async buscarPorCorreo(correoElectronico: string) {
    return prisma.usuario.findUnique({
      where: { correoElectronico },
      include: {
        usuariosRoles: {
          include: { rol: true },
        },
      },
    });
  }

  async buscarPorDni(dni: string) {
    return prisma.usuario.findUnique({ where: { dni } });
  }

  async buscarPorId(id: string) {
    return prisma.usuario.findUnique({
      where: { id },
      include: {
        usuariosRoles: {
          include: { rol: true },
        },
      },
    });
  }

  async crearUsuario(datos: {
    dni: string;
    correoElectronico: string;
    hashContrasena: string;
    nombre: string;
    apellido: string;
    telefono?: string;
    fechaNacimiento?: Date;
    genero?: string;
  }) {
    return prisma.usuario.create({ data: datos });
  }

  async crearSesion(datos: {
    usuarioId: string;
    hashTokenActualizacion: string;
    nombreDispositivo?: string;
    soDispositivo?: string;
    modeloDispositivo?: string;
    nombreNavegador?: string;
    direccionIp?: string;
  }) {
    return prisma.sesion.create({ data: datos });
  }

  async buscarSesionPorId(id: string) {
    return prisma.sesion.findUnique({ where: { id } });
  }

  async buscarSesionPorHash(hash: string) {
    return prisma.sesion.findFirst({ where: { hashTokenActualizacion: hash, activo: true } });
  }

  async desactivarSesion(id: string) {
    return prisma.sesion.update({
      where: { id },
      data: { activo: false, revocadoEn: new Date() },
    });
  }

  async desactivarSesionesPorUsuario(usuarioId: string) {
    return prisma.sesion.updateMany({
      where: { usuarioId, activo: true },
      data: { activo: false, revocadoEn: new Date() },
    });
  }

  async listarSesionesActivas(usuarioId: string) {
    return prisma.sesion.findMany({
      where: { usuarioId, activo: true },
      orderBy: { creadoEn: "desc" },
    });
  }

  async actualizarContrasena(usuarioId: string, hashContrasena: string) {
    return prisma.usuario.update({
      where: { id: usuarioId },
      data: { hashContrasena },
    });
  }
}

export const repositorioAuth = new RepositorioAuth();
