import { prisma } from "../../config/prisma";

export class RepositorioBarrio {
  listar(localidadId?: string) {
    return prisma.barrio.findMany({
      where: localidadId ? { localidadId } : undefined,
      orderBy: { nombre: "asc" },
    });
  }

  buscarPorId(id: string) {
    return prisma.barrio.findUnique({ where: { id } });
  }

  buscarPorLocalidadYNombre(localidadId: string, nombre: string) {
    return prisma.barrio.findUnique({
      where: { localidadId_nombre: { localidadId, nombre } },
    });
  }

  buscarLocalidad(id: string) {
    return prisma.localidad.findUnique({ where: { id } });
  }

  crear(datos: { localidadId: string; nombre: string }) {
    return prisma.barrio.create({
      data: {
        localidadId: datos.localidadId,
        nombre: datos.nombre,
      },
    });
  }

  actualizar(id: string, datos: { localidadId?: string; nombre?: string }) {
    return prisma.barrio.update({
      where: { id },
      data: {
        localidadId: datos.localidadId,
        nombre: datos.nombre,
      },
    });
  }

  eliminar(id: string) {
    return prisma.barrio.delete({ where: { id } });
  }

  contarHospitales(id: string) {
    return prisma.hospital.count({ where: { barrioId: id } });
  }
}

export const repositorioBarrio = new RepositorioBarrio();
