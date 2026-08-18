import { repositorioEspecialidad } from "./especialidades.repository";
import { ConflictError, NotFoundError } from "../../utils/apiError";

export class ServicioEspecialidad {
  listar() {
    return repositorioEspecialidad.listar();
  }

  async buscarPorId(id: string) {
    const especialidad = await repositorioEspecialidad.buscarPorId(id);
    if (!especialidad) {
      throw new NotFoundError("Especialidad no encontrada");
    }
    return especialidad;
  }

  async crear(datos: { nombre: string; descripcion?: string; especialidadPadreId?: string }) {
    const existente = await repositorioEspecialidad.buscarPorNombre(datos.nombre);
    if (existente) {
      throw new ConflictError("Ya existe una especialidad con ese nombre");
    }
    if (datos.especialidadPadreId) {
      const padre = await repositorioEspecialidad.buscarPorId(datos.especialidadPadreId);
      if (!padre) {
        throw new NotFoundError("Especialidad padre no encontrada");
      }
    }
    return repositorioEspecialidad.crear(datos);
  }

  async actualizar(id: string, datos: { nombre?: string; descripcion?: string; especialidadPadreId?: string }) {
    const especialidad = await repositorioEspecialidad.buscarPorId(id);
    if (!especialidad) {
      throw new NotFoundError("Especialidad no encontrada");
    }
    if (datos.nombre && datos.nombre !== especialidad.nombre) {
      const existente = await repositorioEspecialidad.buscarPorNombre(datos.nombre);
      if (existente) {
        throw new ConflictError("Ya existe una especialidad con ese nombre");
      }
    }
    if (datos.especialidadPadreId) {
      if (datos.especialidadPadreId === id) {
        throw new ConflictError("Una especialidad no puede ser subespecialidad de sí misma");
      }
      const padre = await repositorioEspecialidad.buscarPorId(datos.especialidadPadreId);
      if (!padre) {
        throw new NotFoundError("Especialidad padre no encontrada");
      }
    }
    return repositorioEspecialidad.actualizar(id, datos);
  }

  async eliminar(id: string) {
    const especialidad = await repositorioEspecialidad.buscarPorId(id);
    if (!especialidad) {
      throw new NotFoundError("Especialidad no encontrada");
    }
    const subespecialidades = await repositorioEspecialidad.contarSubespecialidades(id);
    if (subespecialidades > 0) {
      throw new ConflictError("No se puede eliminar una especialidad con subespecialidades asociadas");
    }
    const especialidadesMedico = await repositorioEspecialidad.contarEspecialidadesMedico(id);
    if (especialidadesMedico > 0) {
      throw new ConflictError("No se puede eliminar una especialidad asignada a médicos");
    }
    const especialidadesHospital = await repositorioEspecialidad.contarEspecialidadesHospital(id);
    if (especialidadesHospital > 0) {
      throw new ConflictError("No se puede eliminar una especialidad asociada a hospitales");
    }
    const matriculas = await repositorioEspecialidad.contarMatriculas(id);
    if (matriculas > 0) {
      throw new ConflictError("No se puede eliminar una especialidad con matrículas asociadas");
    }
    return repositorioEspecialidad.eliminar(id);
  }
}

export const servicioEspecialidad = new ServicioEspecialidad();
