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

export class RepositorioPaciente {
  listar() {
    return prisma.paciente.findMany({
      orderBy: { creadoEn: "desc" },
      include: { usuario: SELECT_USUARIO },
    });
  }

  buscarPorId(id: string) {
    return prisma.paciente.findUnique({
      where: { id },
      include: { usuario: SELECT_USUARIO },
    });
  }

  buscarPorUsuarioId(usuarioId: string) {
    return prisma.paciente.findUnique({
      where: { usuarioId },
      include: { usuario: SELECT_USUARIO },
    });
  }

  buscarUsuario(id: string) {
    return prisma.usuario.findUnique({ where: { id } });
  }

  crear(datos: {
    usuarioId: string;
    tipoSangre?: string;
    alergias?: string;
    condicionesCronicas?: string;
    medicacionActual?: string;
    contactoEmergenciaNombre?: string;
    contactoEmergenciaTelefono?: string;
    notasMedicas?: string;
  }) {
    return prisma.paciente.create({
      data: {
        usuarioId: datos.usuarioId,
        tipoSangre: datos.tipoSangre ?? null,
        alergias: datos.alergias ?? null,
        condicionesCronicas: datos.condicionesCronicas ?? null,
        medicacionActual: datos.medicacionActual ?? null,
        contactoEmergenciaNombre: datos.contactoEmergenciaNombre ?? null,
        contactoEmergenciaTelefono: datos.contactoEmergenciaTelefono ?? null,
        notasMedicas: datos.notasMedicas ?? null,
      },
      include: { usuario: SELECT_USUARIO },
    });
  }

  actualizar(id: string, datos: {
    tipoSangre?: string;
    alergias?: string;
    condicionesCronicas?: string;
    medicacionActual?: string;
    contactoEmergenciaNombre?: string;
    contactoEmergenciaTelefono?: string;
    notasMedicas?: string;
  }) {
    return prisma.paciente.update({
      where: { id },
      data: {
        tipoSangre: datos.tipoSangre,
        alergias: datos.alergias,
        condicionesCronicas: datos.condicionesCronicas,
        medicacionActual: datos.medicacionActual,
        contactoEmergenciaNombre: datos.contactoEmergenciaNombre,
        contactoEmergenciaTelefono: datos.contactoEmergenciaTelefono,
        notasMedicas: datos.notasMedicas,
      },
      include: { usuario: SELECT_USUARIO },
    });
  }

  eliminar(id: string) {
    return prisma.paciente.delete({ where: { id } });
  }

  contarTurnos(id: string) {
    return prisma.turno.count({ where: { pacienteId: id } });
  }

  contarHistoriasClinicas(id: string) {
    return prisma.historiaClinica.count({ where: { pacienteId: id } });
  }

  contarInscripciones(id: string) {
    return prisma.inscripcionHospitalPaciente.count({ where: { pacienteId: id } });
  }

  contarRelacionesTutores(id: string) {
    return prisma.pacienteTutor.count({ where: { pacienteId: id } });
  }
}

export const repositorioPaciente = new RepositorioPaciente();
