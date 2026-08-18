import { prisma } from '../../config/prisma';

const SELECT_SIN_PASSWORD = {
  id: true,
  dni: true,
  nombre: true,
  apellido: true,
  correoElectronico: true,
  telefono: true,
  fechaNacimiento: true,
  genero: true,
  estado: true,
  emailVerificadoEn: true,
  identidadVerificadaEn: true,
  creadoEn: true,
  actualizadoEn: true,
};

export class RepositorioUsuario {
  async buscarPorId(id: string) {
    return prisma.usuario.findUnique({
      where: { id },
      select: SELECT_SIN_PASSWORD,
    });
  }

  async buscarPorEmail(correoElectronico: string) {
    return prisma.usuario.findUnique({
      where: { correoElectronico },
      select: SELECT_SIN_PASSWORD,
    });
  }

  async buscarPorDni(dni: string) {
    return prisma.usuario.findUnique({
      where: { dni },
      select: SELECT_SIN_PASSWORD,
    });
  }

  async listar(filtros: {
    nombre?: string;
    email?: string;
    dni?: string;
    estado?: string;
  }) {
    const where: Record<string, unknown> = {};
    if (filtros.estado) where.estado = filtros.estado;
    if (filtros.email) where.correoElectronico = { contains: filtros.email, mode: 'insensitive' };
    if (filtros.dni) where.dni = { contains: filtros.dni };
    if (filtros.nombre) {
      where.OR = [
        { nombre: { contains: filtros.nombre, mode: 'insensitive' } },
        { apellido: { contains: filtros.nombre, mode: 'insensitive' } },
      ];
    }

    return prisma.usuario.findMany({
      where,
      select: SELECT_SIN_PASSWORD,
      orderBy: { creadoEn: 'desc' },
    });
  }

  async actualizar(id: string, datos: Record<string, unknown>) {
    return prisma.usuario.update({
      where: { id },
      data: datos,
      select: SELECT_SIN_PASSWORD,
    });
  }

  async eliminar(id: string) {
    return prisma.usuario.update({
      where: { id },
      data: { eliminadoEn: new Date() },
      select: SELECT_SIN_PASSWORD,
    });
  }
}

export const repositorioUsuario = new RepositorioUsuario();
