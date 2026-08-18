import { repositorioPaciente } from "./pacientes.repository";
import { ConflictError, NotFoundError } from "../../utils/apiError";

export class ServicioPaciente {
  listar() {
    return repositorioPaciente.listar();
  }

  async buscarPorId(id: string) {
    const paciente = await repositorioPaciente.buscarPorId(id);
    if (!paciente) {
      throw new NotFoundError("Paciente no encontrado");
    }
    return paciente;
  }

  async crear(datos: {
    usuarioId: string;
    tipoSangre?: string;
    alergias?: string;
    condicionesCronicas?: string;
    medicacionActual?: string;
    contactoEmergenciaNombre?: string;
    contactoEmergenciaTelefono?: string;
    notasMedicas?: string;
  }) {
    const usuario = await repositorioPaciente.buscarUsuario(datos.usuarioId);
    if (!usuario) {
      throw new NotFoundError("Usuario no encontrado");
    }
    const existente = await repositorioPaciente.buscarPorUsuarioId(datos.usuarioId);
    if (existente) {
      throw new ConflictError("El usuario ya tiene un perfil de paciente");
    }
    return repositorioPaciente.crear(datos);
  }

  async actualizar(id: string, datos: {
    tipoSangre?: string;
    alergias?: string;
    condicionesCronicas?: string;
    medicacionActual?: string;
    contactoEmergenciaNombre?: string;
    contactoEmergenciaTelefono?: string;
    notasMedicas?: string;
  }) {
    const paciente = await repositorioPaciente.buscarPorId(id);
    if (!paciente) {
      throw new NotFoundError("Paciente no encontrado");
    }
    return repositorioPaciente.actualizar(id, datos);
  }

  async eliminar(id: string) {
    const paciente = await repositorioPaciente.buscarPorId(id);
    if (!paciente) {
      throw new NotFoundError("Paciente no encontrado");
    }
    const turnos = await repositorioPaciente.contarTurnos(id);
    if (turnos > 0) {
      throw new ConflictError("No se puede eliminar un paciente con turnos asociados");
    }
    const historiasClinicas = await repositorioPaciente.contarHistoriasClinicas(id);
    if (historiasClinicas > 0) {
      throw new ConflictError("No se puede eliminar un paciente con historias clínicas asociadas");
    }
    const inscripciones = await repositorioPaciente.contarInscripciones(id);
    if (inscripciones > 0) {
      throw new ConflictError("No se puede eliminar un paciente con inscripciones hospitalarias asociadas");
    }
    const relacionesTutores = await repositorioPaciente.contarRelacionesTutores(id);
    if (relacionesTutores > 0) {
      throw new ConflictError("No se puede eliminar un paciente con tutores asociados");
    }
    return repositorioPaciente.eliminar(id);
  }
}

export const servicioPaciente = new ServicioPaciente();
