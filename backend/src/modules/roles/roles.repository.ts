import { prisma } from "../../config/prisma";

export class RepositorioRol {
  listar() {
    return prisma.rol.findMany({
      orderBy: { nombre: "asc" },
      include: { _count: { select: { usuariosRoles: true } } },
    });
  }

  buscarPorId(id: string) {
    return prisma.rol.findUnique({
      where: { id },
      include: {
        rolesPermisos: {
          include: { permiso: true },
        },
        _count: { select: { usuariosRoles: true } },
      },
    });
  }

  buscarPorCodigo(codigo: string) {
    return prisma.rol.findUnique({ where: { codigo } });
  }

  crear(datos: { codigo: string; nombre: string; descripcion?: string }) {
    return prisma.rol.create({
      data: {
        codigo: datos.codigo,
        nombre: datos.nombre,
        descripcion: datos.descripcion ?? null,
      },
    });
  }

  actualizar(id: string, datos: { codigo?: string; nombre?: string; descripcion?: string }) {
    return prisma.rol.update({
      where: { id },
      data: {
        codigo: datos.codigo,
        nombre: datos.nombre,
        descripcion: datos.descripcion,
      },
    });
  }

  eliminar(id: string) {
    return prisma.rol.delete({ where: { id } });
  }

  asignarPermiso(rolId: string, permisoId: string) {
    return prisma.rolPermiso.create({
      data: { rolId, permisoId },
    });
  }

  removerPermiso(rolId: string, permisoId: string) {
    return prisma.rolPermiso.delete({
      where: { rolId_permisoId: { rolId, permisoId } },
    });
  }
}

export const repositorioRol = new RepositorioRol();
