import { repositorioPacienteTutor } from "./pacientes-tutores.repository";
import { ConflictError, NotFoundError } from "../../utils/apiError";

export class ServicioPacienteTutor {
  listar(pacienteId?: string) {
    return repositorioPacienteTutor.listar(pacienteId);
  }

  async buscarPorId(id: string) {
    const relacion = await repositorioPacienteTutor.buscarPorId(id);
    if (!relacion) {
      throw new NotFoundError("Relación tutor-paciente no encontrada");
    }
    return relacion;
  }

  async crear(datos: {
    pacienteId: string;
    tutorUsuarioId: string;
    tipoRelacion: string;
    estadoAutorizacion?: string;
  }) {
    const paciente = await repositorioPacienteTutor.buscarPaciente(datos.pacienteId);
    if (!paciente) {
      throw new NotFoundError("Paciente no encontrado");
    }
    const tutor = await repositorioPacienteTutor.buscarTutorPorUsuarioId(datos.tutorUsuarioId);
    if (!tutor) {
      throw new NotFoundError("Tutor no encontrado");
    }
    const existente = await repositorioPacienteTutor.buscarPorPacienteYTutor(datos.pacienteId, datos.tutorUsuarioId);
    if (existente) {
      throw new ConflictError("El tutor ya está asociado a este paciente");
    }
    return repositorioPacienteTutor.crear(datos);
  }

  async actualizar(id: string, datos: { tipoRelacion?: string; estadoAutorizacion?: string }) {
    const relacion = await repositorioPacienteTutor.buscarPorId(id);
    if (!relacion) {
      throw new NotFoundError("Relación tutor-paciente no encontrada");
    }
    return repositorioPacienteTutor.actualizar(id, datos);
  }

  async eliminar(id: string) {
    const relacion = await repositorioPacienteTutor.buscarPorId(id);
    if (!relacion) {
      throw new NotFoundError("Relación tutor-paciente no encontrada");
    }
    return repositorioPacienteTutor.eliminar(id);
  }
}

export const servicioPacienteTutor = new ServicioPacienteTutor();
