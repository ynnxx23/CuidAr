import { prisma } from "../../config/prisma";

export class RepositorioConsultorio {
  listar(hospitalId?: string, departamentoId?: string, areaMedicaId?: string) {
    return prisma.consultorio.findMany({
      where: {
        ...(hospitalId ? { hospitalId } : {}),
        ...(departamentoId ? { departamentoId } : {}),
        ...(areaMedicaId ? { areaMedicaId } : {}),
      },
      orderBy: { nombre: "asc" },
      include: {
        hospital: { select: { id: true, nombre: true } },
        departamento: { select: { id: true, nombre: true } },
        areaMedica: { select: { id: true, nombre: true } },
      },
    });
  }

  buscarPorId(id: string) {
    return prisma.consultorio.findUnique({
      where: { id },
      include: {
        hospital: { select: { id: true, nombre: true } },
        departamento: { select: { id: true, nombre: true } },
        areaMedica: { select: { id: true, nombre: true } },
      },
    });
  }

  buscarHospital(id: string) {
    return prisma.hospital.findUnique({ where: { id } });
  }

  buscarDepartamento(id: string) {
    return prisma.departamento.findUnique({ where: { id } });
  }

  buscarAreaMedica(id: string) {
    return prisma.areaMedica.findUnique({ where: { id } });
  }

  buscarPorHospitalYNombre(hospitalId: string, nombre: string) {
    return prisma.consultorio.findFirst({
      where: { hospitalId, nombre },
    });
  }

  crear(datos: {
    hospitalId: string;
    nombre: string;
    departamentoId?: string;
    areaMedicaId?: string;
    codigoConsultorio?: string;
  }) {
    return prisma.consultorio.create({
      data: {
        hospitalId: datos.hospitalId,
        nombre: datos.nombre,
        departamentoId: datos.departamentoId ?? null,
        areaMedicaId: datos.areaMedicaId ?? null,
        codigoConsultorio: datos.codigoConsultorio ?? null,
      },
    });
  }

  actualizar(id: string, datos: {
    nombre?: string;
    departamentoId?: string;
    areaMedicaId?: string;
    codigoConsultorio?: string;
  }) {
    return prisma.consultorio.update({
      where: { id },
      data: {
        nombre: datos.nombre,
        departamentoId: datos.departamentoId,
        areaMedicaId: datos.areaMedicaId,
        codigoConsultorio: datos.codigoConsultorio,
      },
    });
  }

  eliminar(id: string) {
    return prisma.consultorio.delete({ where: { id } });
  }

  contarTurnos(id: string) {
    return prisma.turno.count({ where: { consultorioId: id } });
  }
}

export const repositorioConsultorio = new RepositorioConsultorio();
