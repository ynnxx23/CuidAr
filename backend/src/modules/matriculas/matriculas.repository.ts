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

export class RepositorioMatricula {
  listar(medicoId?: string) {
    return prisma.matricula.findMany({
      where: {
        ...(medicoId ? { medicoId } : {}),
      },
      orderBy: { creadoEn: "desc" },
      include: INCLUDE_RELACIONES,
    });
  }

  buscarPorId(id: string) {
    return prisma.matricula.findUnique({
      where: { id },
      include: INCLUDE_RELACIONES,
    });
  }

  buscarPorMedicoYNumero(medicoId: string, numeroMatricula: string) {
    return prisma.matricula.findUnique({
      where: { medicoId_numeroMatricula: { medicoId, numeroMatricula } },
    });
  }

  buscarMedico(id: string) {
    return prisma.medico.findUnique({ where: { id } });
  }

  buscarEspecialidad(id: string) {
    return prisma.especialidad.findUnique({ where: { id } });
  }

  crear(datos: {
    medicoId: string;
    numeroMatricula: string;
    tipo?: string;
    autoridadEmisora?: string;
    fechaEmision?: string;
    fechaVencimiento?: string;
    archivoUrl?: string;
    especialidadId?: string;
  }) {
    return prisma.matricula.create({
      data: {
        medicoId: datos.medicoId,
        numeroMatricula: datos.numeroMatricula,
        tipo: datos.tipo ?? "nacional",
        autoridadEmisora: datos.autoridadEmisora ?? null,
        fechaEmision: datos.fechaEmision ? new Date(datos.fechaEmision) : null,
        fechaVencimiento: datos.fechaVencimiento ? new Date(datos.fechaVencimiento) : null,
        archivoUrl: datos.archivoUrl ?? null,
        especialidadId: datos.especialidadId ?? null,
      },
      include: INCLUDE_RELACIONES,
    });
  }

  actualizar(id: string, datos: {
    numeroMatricula?: string;
    tipo?: string;
    autoridadEmisora?: string;
    fechaEmision?: string;
    fechaVencimiento?: string;
    archivoUrl?: string;
    activo?: boolean;
    especialidadId?: string;
  }) {
    return prisma.matricula.update({
      where: { id },
      data: {
        numeroMatricula: datos.numeroMatricula,
        tipo: datos.tipo,
        autoridadEmisora: datos.autoridadEmisora,
        fechaEmision: datos.fechaEmision !== undefined ? new Date(datos.fechaEmision) : undefined,
        fechaVencimiento: datos.fechaVencimiento !== undefined ? new Date(datos.fechaVencimiento) : undefined,
        archivoUrl: datos.archivoUrl,
        activo: datos.activo,
        especialidadId: datos.especialidadId,
      },
      include: INCLUDE_RELACIONES,
    });
  }

  eliminar(id: string) {
    return prisma.matricula.delete({ where: { id } });
  }
}

export const repositorioMatricula = new RepositorioMatricula();
