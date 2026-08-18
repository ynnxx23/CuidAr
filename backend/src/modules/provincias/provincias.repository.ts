import { prisma } from "../../config/prisma";

export class RepositorioProvincia {
  listar(paisId?: string) {
    return prisma.provincia.findMany({
      where: paisId ? { paisId } : undefined,
      orderBy: { nombre: "asc" },
    });
  }

  buscarPorId(id: string) {
    return prisma.provincia.findUnique({ where: { id } });
  }

  buscarPorPaisYNombre(paisId: string, nombre: string) {
    return prisma.provincia.findUnique({
      where: { paisId_nombre: { paisId, nombre } },
    });
  }

  buscarPorCodigoIso(codigoIso: string) {
    return prisma.provincia.findFirst({ where: { codigoIso } });
  }

  buscarPais(id: string) {
    return prisma.pais.findUnique({ where: { id } });
  }

  crear(datos: { paisId: string; nombre: string; codigoIso?: string }) {
    return prisma.provincia.create({
      data: {
        paisId: datos.paisId,
        nombre: datos.nombre,
        codigoIso: datos.codigoIso ?? null,
      },
    });
  }

  actualizar(id: string, datos: { paisId?: string; nombre?: string; codigoIso?: string }) {
    return prisma.provincia.update({
      where: { id },
      data: {
        paisId: datos.paisId,
        nombre: datos.nombre,
        codigoIso: datos.codigoIso,
      },
    });
  }

  eliminar(id: string) {
    return prisma.provincia.delete({ where: { id } });
  }

  contarLocalidades(id: string) {
    return prisma.localidad.count({ where: { provinciaId: id } });
  }
}

export const repositorioProvincia = new RepositorioProvincia();
