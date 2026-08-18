import { prisma } from "../../config/prisma";

export interface FiltroPermiso {
  recurso?: string;
}

export class RepositorioPermiso {
  listar(filtro?: FiltroPermiso) {
    return prisma.permiso.findMany({
      where: filtro?.recurso ? { recurso: filtro.recurso } : undefined,
      orderBy: [{ recurso: "asc" }, { accion: "asc" }],
    });
  }

  buscarPorId(id: string) {
    return prisma.permiso.findUnique({ where: { id } });
  }

  buscarPorCodigo(codigo: string) {
    return prisma.permiso.findUnique({ where: { codigo } });
  }

  crear(datos: { codigo: string; nombre: string; recurso: string; accion: string; descripcion?: string }) {
    return prisma.permiso.create({
      data: {
        codigo: datos.codigo,
        nombre: datos.nombre,
        recurso: datos.recurso,
        accion: datos.accion,
        descripcion: datos.descripcion ?? null,
      },
    });
  }

  actualizar(
    id: string,
    datos: { codigo?: string; nombre?: string; recurso?: string; accion?: string; descripcion?: string },
  ) {
    return prisma.permiso.update({
      where: { id },
      data: {
        codigo: datos.codigo,
        nombre: datos.nombre,
        recurso: datos.recurso,
        accion: datos.accion,
        descripcion: datos.descripcion,
      },
    });
  }

  eliminar(id: string) {
    return prisma.permiso.delete({ where: { id } });
  }
}

export const repositorioPermiso = new RepositorioPermiso();
