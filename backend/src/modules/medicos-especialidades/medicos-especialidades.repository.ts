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
  especialidad: true,
};

export class RepositorioMedicoEspecialidad {
  listar(medicoId?: string, especialidadId?: string) {
    return prisma.especialidadMedico.findMany({
      where: {
        ...(medicoId ? { medicoId } : {}),
        ...(especialidadId ? { especialidadId } : {}),
      },
      orderBy: { creadoEn: "desc" },
      include: INCLUDE_RELACIONES,
    });
  }

  buscarPorId(id: string) {
    return prisma.especialidadMedico.findUnique({
      where: { id },
      include: INCLUDE_RELACIONES,
    });
  }

  buscarPorMedicoYEspecialidad(medicoId: string, especialidadId: string) {
    return prisma.especialidadMedico.findUnique({
      where: { medicoId_especialidadId: { medicoId, especialidadId } },
    });
  }

  buscarMedico(id: string) {
    return prisma.medico.findUnique({ where: { id } });
  }

  buscarEspecialidad(id: string) {
    return prisma.especialidad.findUnique({ where: { id } });
  }

  crear(datos: { medicoId: string; especialidadId: string; principal?: boolean }) {
    return prisma.especialidadMedico.create({
      data: {
        medicoId: datos.medicoId,
        especialidadId: datos.especialidadId,
        principal: datos.principal ?? false,
      },
      include: INCLUDE_RELACIONES,
    });
  }

  actualizar(id: string, datos: { principal?: boolean }) {
    return prisma.especialidadMedico.update({
      where: { id },
      data: { principal: datos.principal },
      include: INCLUDE_RELACIONES,
    });
  }

  eliminar(id: string) {
    return prisma.especialidadMedico.delete({ where: { id } });
  }
}

export const repositorioMedicoEspecialidad = new RepositorioMedicoEspecialidad();
