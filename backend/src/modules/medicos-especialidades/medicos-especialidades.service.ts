import { repositorioMedicoEspecialidad } from "./medicos-especialidades.repository";
import { ConflictError, NotFoundError } from "../../utils/apiError";

export class ServicioMedicoEspecialidad {
  listar(medicoId?: string, especialidadId?: string) {
    return repositorioMedicoEspecialidad.listar(medicoId, especialidadId);
  }

  async buscarPorId(id: string) {
    const relacion = await repositorioMedicoEspecialidad.buscarPorId(id);
    if (!relacion) {
      throw new NotFoundError("Asignación de especialidad no encontrada");
    }
    return relacion;
  }

  async crear(datos: { medicoId: string; especialidadId: string; principal?: boolean }) {
    const medico = await repositorioMedicoEspecialidad.buscarMedico(datos.medicoId);
    if (!medico) {
      throw new NotFoundError("Médico no encontrado");
    }
    const especialidad = await repositorioMedicoEspecialidad.buscarEspecialidad(datos.especialidadId);
    if (!especialidad) {
      throw new NotFoundError("Especialidad no encontrada");
    }
    const existente = await repositorioMedicoEspecialidad.buscarPorMedicoYEspecialidad(
      datos.medicoId,
      datos.especialidadId,
    );
    if (existente) {
      throw new ConflictError("El médico ya tiene asignada esa especialidad");
    }
    return repositorioMedicoEspecialidad.crear(datos);
  }

  async actualizar(id: string, datos: { principal?: boolean }) {
    const relacion = await repositorioMedicoEspecialidad.buscarPorId(id);
    if (!relacion) {
      throw new NotFoundError("Asignación de especialidad no encontrada");
    }
    return repositorioMedicoEspecialidad.actualizar(id, datos);
  }

  async eliminar(id: string) {
    const relacion = await repositorioMedicoEspecialidad.buscarPorId(id);
    if (!relacion) {
      throw new NotFoundError("Asignación de especialidad no encontrada");
    }
    return repositorioMedicoEspecialidad.eliminar(id);
  }
}

export const servicioMedicoEspecialidad = new ServicioMedicoEspecialidad();
