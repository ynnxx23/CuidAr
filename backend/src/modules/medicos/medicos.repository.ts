import { prisma } from "../../config/prisma";
import { EstadoLaboralMedico } from "../../generated/prisma/client";

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
  usuario: SELECT_USUARIO,
  especialidades: { include: { especialidad: true } },
  hospitales: { include: { hospital: true } },
};

export class RepositorioMedico {
  listar() {
    return prisma.medico.findMany({
      orderBy: { creadoEn: "desc" },
      include: INCLUDE_RELACIONES,
    });
  }

  buscarPorId(id: string) {
    return prisma.medico.findUnique({
      where: { id },
      include: INCLUDE_RELACIONES,
    });
  }

  buscarPorUsuarioId(usuarioId: string) {
    return prisma.medico.findUnique({
      where: { usuarioId },
      include: INCLUDE_RELACIONES,
    });
  }

  buscarPorNumeroMatricula(numeroMatricula: string) {
    return prisma.medico.findUnique({ where: { numeroMatricula } });
  }

  buscarUsuario(id: string) {
    return prisma.usuario.findUnique({ where: { id } });
  }

  crear(datos: { usuarioId: string; numeroMatricula: string; biografia?: string; estadoLaboral?: string; notas?: string }) {
    return prisma.medico.create({
      data: {
        usuarioId: datos.usuarioId,
        numeroMatricula: datos.numeroMatricula,
        biografia: datos.biografia ?? null,
        notas: datos.notas ?? null,
        estadoLaboral: (datos.estadoLaboral ?? "disponible") as EstadoLaboralMedico,
      },
      include: INCLUDE_RELACIONES,
    });
  }

  actualizar(id: string, datos: { numeroMatricula?: string; biografia?: string; estadoLaboral?: string; notas?: string }) {
    return prisma.medico.update({
      where: { id },
      data: {
        numeroMatricula: datos.numeroMatricula,
        biografia: datos.biografia,
        notas: datos.notas,
        estadoLaboral: datos.estadoLaboral as EstadoLaboralMedico | undefined,
      },
      include: INCLUDE_RELACIONES,
    });
  }

  eliminar(id: string) {
    return prisma.medico.delete({ where: { id } });
  }

  contarMatriculas(id: string) {
    return prisma.matricula.count({ where: { medicoId: id } });
  }

  contarEspecialidades(id: string) {
    return prisma.especialidadMedico.count({ where: { medicoId: id } });
  }

  contarHospitales(id: string) {
    return prisma.hospitalMedico.count({ where: { medicoId: id } });
  }

  contarTurnos(id: string) {
    return prisma.turno.count({ where: { medicoId: id } });
  }

  contarBloquesHorarios(id: string) {
    return prisma.bloqueHorario.count({ where: { medicoId: id } });
  }
}

export const repositorioMedico = new RepositorioMedico();
