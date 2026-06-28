import { prisma } from "../../config/prisma";

export class RepositorioPermiso {
  async listar(filtro?: { recurso?: string }) {
    return prisma.permiso.findMany({
      where: filtro?.recurso ? { recurso: filtro.recurso } : undefined,
      orderBy: [{ recurso: "asc" }, { accion: "asc" }],
    });
  }

  async buscarPorId(id: string) {
    return prisma.permiso.findUnique({ where: { id } });
  }

  async buscarPorCodigo(codigo: string) {
    return prisma.permiso.findUnique({ where: { codigo } });
  }

  async crear(datos: { codigo: string; nombre: string; recurso: string; accion: string; descripcion?: string }) {
    return prisma.permiso.create({ data: datos });
  }

  async actualizar(id: string, datos: { codigo?: string; nombre?: string; recurso?: string; accion?: string; descripcion?: string }) {
    return prisma.permiso.update({
      where: { id },
      data: datos,
    });
  }

  async eliminar(id: string) {
    return prisma.permiso.delete({ where: { id } });
  }
}

export const repositorioPermiso = new RepositorioPermiso();
