import { prisma } from "../../config/prisma";

export class RepositorioRol {
  async listar() {
    return prisma.rol.findMany({
      orderBy: { creadoEn: "asc" },
      include: {
        _count: {
          select: { usuariosRoles: true },
        },
      },
    });
  }

  async buscarPorId(id: string) {
    return prisma.rol.findUnique({
      where: { id },
      include: {
        rolesPermisos: {
          include: { permiso: true },
        },
        _count: {
          select: { usuariosRoles: true },
        },
      },
    });
  }

  async buscarPorCodigo(codigo: string) {
    return prisma.rol.findUnique({ where: { codigo } });
  }

  async crear(datos: { codigo: string; nombre: string; descripcion?: string }) {
    return prisma.rol.create({ data: datos });
  }

  async actualizar(id: string, datos: { codigo?: string; nombre?: string; descripcion?: string }) {
    return prisma.rol.update({
      where: { id },
      data: datos,
    });
  }

  async eliminar(id: string) {
    return prisma.rol.delete({ where: { id } });
  }

  async asignarPermiso(rolId: string, permisoId: string) {
    return prisma.rolPermiso.create({
      data: { rolId, permisoId },
    });
  }

  async removerPermiso(rolId: string, permisoId: string) {
    return prisma.rolPermiso.delete({
      where: { rolId_permisoId: { rolId, permisoId } },
    });
  }
}

export const repositorioRol = new RepositorioRol();
