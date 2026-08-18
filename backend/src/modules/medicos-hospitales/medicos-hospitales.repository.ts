import { prisma } from "../../config/prisma";

const SELECT_USUARIO = {
  select: {
    id: true,
    dni: true,
    nombre: true,
    apellido: true,
    correoElectronico: true,
    telefono: true,
    fechaNacimiento: true,
    genero: true,
  },
};

const INCLUDE_RELACIONES = {
  medico: { include: { usuario: SELECT_USUARIO } },
  hospital: true,
  departamento: true,
};

export class RepositorioMedicoHospital {
  listar(medicoId?: string, hospitalId?: string) {
    return prisma.hospitalMedico.findMany({
      where: {
        ...(medicoId ? { medicoId } : {}),
        ...(hospitalId ? { hospitalId } : {}),
      },
      orderBy: { creadoEn: "desc" },
      include: INCLUDE_RELACIONES,
    });
  }

  buscarPorId(id: string) {
    return prisma.hospitalMedico.findUnique({
      where: { id },
      include: INCLUDE_RELACIONES,
    });
  }

  buscarDuplicado(medicoId: string, hospitalId: string, departamentoId?: string) {
    if (departamentoId) {
      return prisma.hospitalMedico.findUnique({
        where: { medicoId_hospitalId_departamentoId: { medicoId, hospitalId, departamentoId } },
      });
    }
    return prisma.hospitalMedico.findFirst({
      where: { medicoId, hospitalId, departamentoId: null },
    });
  }

  buscarMedico(id: string) {
    return prisma.medico.findUnique({ where: { id } });
  }

  buscarHospital(id: string) {
    return prisma.hospital.findUnique({ where: { id } });
  }

  buscarDepartamento(id: string) {
    return prisma.departamento.findUnique({ where: { id } });
  }

  crear(datos: { medicoId: string; hospitalId: string; departamentoId?: string; activo?: boolean }) {
    return prisma.hospitalMedico.create({
      data: {
        medicoId: datos.medicoId,
        hospitalId: datos.hospitalId,
        departamentoId: datos.departamentoId ?? null,
        activo: datos.activo ?? true,
      },
      include: INCLUDE_RELACIONES,
    });
  }

  actualizar(id: string, datos: { activo?: boolean }) {
    return prisma.hospitalMedico.update({
      where: { id },
      data: { activo: datos.activo },
      include: INCLUDE_RELACIONES,
    });
  }

  eliminar(id: string) {
    return prisma.hospitalMedico.delete({ where: { id } });
  }
}

export const repositorioMedicoHospital = new RepositorioMedicoHospital();
