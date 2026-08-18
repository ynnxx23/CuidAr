import { prisma } from "../../config/prisma";

export class RepositorioSucursal {
  listar(hospitalId?: string) {
    return prisma.sucursalHospital.findMany({
      where: {
        ...(hospitalId ? { hospitalId } : {}),
      },
      orderBy: { nombre: "asc" },
      include: {
        hospital: { select: { id: true, nombre: true } },
      },
    });
  }

  buscarPorId(id: string) {
    return prisma.sucursalHospital.findUnique({
      where: { id },
      include: {
        hospital: { select: { id: true, nombre: true } },
      },
    });
  }

  buscarHospital(id: string) {
    return prisma.hospital.findUnique({ where: { id } });
  }

  buscarPorHospitalYNombre(hospitalId: string, nombre: string) {
    return prisma.sucursalHospital.findFirst({
      where: { hospitalId, nombre },
    });
  }

  crear(datos: {
    hospitalId: string;
    nombre: string;
    direccion?: string;
    telefono?: string;
    correoElectronico?: string;
  }) {
    return prisma.sucursalHospital.create({
      data: {
        hospitalId: datos.hospitalId,
        nombre: datos.nombre,
        direccion: datos.direccion ?? null,
        telefono: datos.telefono ?? null,
        correoElectronico: datos.correoElectronico ?? null,
      },
    });
  }

  actualizar(id: string, datos: {
    nombre?: string;
    direccion?: string;
    telefono?: string;
    correoElectronico?: string;
  }) {
    return prisma.sucursalHospital.update({
      where: { id },
      data: {
        nombre: datos.nombre,
        direccion: datos.direccion,
        telefono: datos.telefono,
        correoElectronico: datos.correoElectronico,
      },
    });
  }

  eliminar(id: string) {
    return prisma.sucursalHospital.delete({ where: { id } });
  }
}

export const repositorioSucursal = new RepositorioSucursal();
