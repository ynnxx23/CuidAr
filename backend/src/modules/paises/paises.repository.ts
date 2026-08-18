import { prisma } from "../../config/prisma";

export class RepositorioPais {
  listar(incluirProvincias?: boolean) {
    return prisma.pais.findMany({
      orderBy: { nombre: "asc" },
      include: { provincias: incluirProvincias ? { orderBy: { nombre: "asc" } } : false },
    });
  }

  buscarPorId(id: string) {
    return prisma.pais.findUnique({ where: { id } });
  }

  buscarPorNombre(nombre: string) {
    return prisma.pais.findUnique({ where: { nombre } });
  }

  buscarPorCodigoIso(codigoIso: string) {
    return prisma.pais.findUnique({ where: { codigoIso } });
  }

  crear(datos: { nombre: string; codigoIso?: string }) {
    return prisma.pais.create({
      data: {
        nombre: datos.nombre,
        codigoIso: datos.codigoIso ?? null,
      },
    });
  }

  actualizar(id: string, datos: { nombre?: string; codigoIso?: string }) {
    return prisma.pais.update({
      where: { id },
      data: {
        nombre: datos.nombre,
        codigoIso: datos.codigoIso,
      },
    });
  }

  eliminar(id: string) {
    return prisma.pais.delete({ where: { id } });
  }

  contarProvincias(id: string) {
    return prisma.provincia.count({ where: { paisId: id } });
  }
}

export const repositorioPais = new RepositorioPais();
