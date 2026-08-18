import { prisma } from "../../config/prisma";

export class RepositorioLocalidad {
  listar(provinciaId?: string) {
    return prisma.localidad.findMany({
      where: provinciaId ? { provinciaId } : undefined,
      orderBy: { nombre: "asc" },
    });
  }

  buscarPorId(id: string) {
    return prisma.localidad.findUnique({ where: { id } });
  }

  buscarPorProvinciaYNombre(provinciaId: string, nombre: string) {
    return prisma.localidad.findUnique({
      where: { provinciaId_nombre: { provinciaId, nombre } },
    });
  }

  buscarProvincia(id: string) {
    return prisma.provincia.findUnique({ where: { id } });
  }

  crear(datos: { provinciaId: string; nombre: string }) {
    return prisma.localidad.create({
      data: {
        provinciaId: datos.provinciaId,
        nombre: datos.nombre,
      },
    });
  }

  actualizar(id: string, datos: { provinciaId?: string; nombre?: string }) {
    return prisma.localidad.update({
      where: { id },
      data: {
        provinciaId: datos.provinciaId,
        nombre: datos.nombre,
      },
    });
  }

  eliminar(id: string) {
    return prisma.localidad.delete({ where: { id } });
  }

  contarBarrios(id: string) {
    return prisma.barrio.count({ where: { localidadId: id } });
  }
}

export const repositorioLocalidad = new RepositorioLocalidad();
