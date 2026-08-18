import { prisma } from "../../config/prisma";
import { TipoHospital } from "../../generated/prisma/client";

export class RepositorioHospital {
  listar(provinciaId?: string, estado?: string) {
    return prisma.hospital.findMany({
      where: {
        ...(provinciaId ? { provinciaId } : {}),
        ...(estado ? { estado } : {}),
      },
      orderBy: { nombre: "asc" },
      include: {
        provincia: { select: { id: true, nombre: true } },
        localidad: { select: { id: true, nombre: true } },
        barrio: { select: { id: true, nombre: true } },
        areaMedica: { select: { id: true, nombre: true } },
      },
    });
  }

  buscarPorId(id: string) {
    return prisma.hospital.findUnique({
      where: { id },
      include: {
        provincia: { select: { id: true, nombre: true } },
        localidad: { select: { id: true, nombre: true } },
        barrio: { select: { id: true, nombre: true } },
        areaMedica: { select: { id: true, nombre: true } },
      },
    });
  }

  buscarPorCodigoInterno(codigoInterno: string) {
    return prisma.hospital.findUnique({ where: { codigoInterno } });
  }

  buscarProvincia(id: string) {
    return prisma.provincia.findUnique({ where: { id } });
  }

  buscarLocalidad(id: string) {
    return prisma.localidad.findUnique({ where: { id } });
  }

  buscarBarrio(id: string) {
    return prisma.barrio.findUnique({ where: { id } });
  }

  buscarAreaMedica(id: string) {
    return prisma.areaMedica.findUnique({ where: { id } });
  }

  crear(datos: {
    nombre: string;
    tipoHospital: string;
    provinciaId: string;
    localidadId: string;
    codigoInterno?: string;
    correoElectronico?: string;
    telefono?: string;
    direccion?: string;
    barrioId?: string;
    areaMedicaId?: string;
  }) {
    return prisma.hospital.create({
      data: {
        nombre: datos.nombre,
        tipoHospital: datos.tipoHospital as TipoHospital,
        provinciaId: datos.provinciaId,
        localidadId: datos.localidadId,
        codigoInterno: datos.codigoInterno ?? null,
        correoElectronico: datos.correoElectronico ?? null,
        telefono: datos.telefono ?? null,
        direccion: datos.direccion ?? null,
        barrioId: datos.barrioId ?? null,
        areaMedicaId: datos.areaMedicaId ?? null,
      },
    });
  }

  actualizar(id: string, datos: {
    nombre?: string;
    tipoHospital?: string;
    provinciaId?: string;
    localidadId?: string;
    codigoInterno?: string;
    correoElectronico?: string;
    telefono?: string;
    direccion?: string;
    barrioId?: string;
    areaMedicaId?: string;
  }) {
    return prisma.hospital.update({
      where: { id },
      data: {
        nombre: datos.nombre,
        tipoHospital: datos.tipoHospital as TipoHospital,
        provinciaId: datos.provinciaId,
        localidadId: datos.localidadId,
        codigoInterno: datos.codigoInterno,
        correoElectronico: datos.correoElectronico,
        telefono: datos.telefono,
        direccion: datos.direccion,
        barrioId: datos.barrioId,
        areaMedicaId: datos.areaMedicaId,
      },
    });
  }

  eliminar(id: string) {
    return prisma.hospital.update({
      where: { id },
      data: {
        estado: "inactive",
        eliminadoEn: new Date(),
      },
    });
  }
}

export const repositorioHospital = new RepositorioHospital();
