import { prisma } from "../../config/prisma";

export class RepositorioDepartamento {
  listar(hospitalId?: string) {
    return prisma.departamento.findMany({
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
    return prisma.departamento.findUnique({
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
    return prisma.departamento.findFirst({
      where: { hospitalId, nombre },
    });
  }

  crear(datos: { hospitalId: string; nombre: string; descripcion?: string }) {
    return prisma.departamento.create({
      data: {
        hospitalId: datos.hospitalId,
        nombre: datos.nombre,
        descripcion: datos.descripcion ?? null,
      },
    });
  }

  actualizar(id: string, datos: { nombre?: string; descripcion?: string }) {
    return prisma.departamento.update({
      where: { id },
      data: {
        nombre: datos.nombre,
        descripcion: datos.descripcion,
      },
    });
  }

  eliminar(id: string) {
    return prisma.departamento.delete({ where: { id } });
  }

  contarConsultorios(id: string) {
    return prisma.consultorio.count({ where: { departamentoId: id } });
  }
}

export const repositorioDepartamento = new RepositorioDepartamento();
