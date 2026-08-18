import { repositorioMatricula } from "./matriculas.repository";
import { ConflictError, NotFoundError } from "../../utils/apiError";

export class ServicioMatricula {
  listar(medicoId?: string) {
    return repositorioMatricula.listar(medicoId);
  }

  async buscarPorId(id: string) {
    const matricula = await repositorioMatricula.buscarPorId(id);
    if (!matricula) {
      throw new NotFoundError("Matrícula no encontrada");
    }
    return matricula;
  }

  async crear(datos: {
    medicoId: string;
    numeroMatricula: string;
    tipo?: string;
    autoridadEmisora?: string;
    fechaEmision?: string;
    fechaVencimiento?: string;
    archivoUrl?: string;
    especialidadId?: string;
  }) {
    const medico = await repositorioMatricula.buscarMedico(datos.medicoId);
    if (!medico) {
      throw new NotFoundError("Médico no encontrado");
    }
    if (datos.especialidadId) {
      const especialidad = await repositorioMatricula.buscarEspecialidad(datos.especialidadId);
      if (!especialidad) {
        throw new NotFoundError("Especialidad no encontrada");
      }
    }
    const existente = await repositorioMatricula.buscarPorMedicoYNumero(datos.medicoId, datos.numeroMatricula);
    if (existente) {
      throw new ConflictError("El médico ya tiene una matrícula con ese número");
    }
    return repositorioMatricula.crear(datos);
  }

  async actualizar(id: string, datos: {
    numeroMatricula?: string;
    tipo?: string;
    autoridadEmisora?: string;
    fechaEmision?: string;
    fechaVencimiento?: string;
    archivoUrl?: string;
    activo?: boolean;
    especialidadId?: string;
  }) {
    const matricula = await repositorioMatricula.buscarPorId(id);
    if (!matricula) {
      throw new NotFoundError("Matrícula no encontrada");
    }
    if (datos.especialidadId) {
      const especialidad = await repositorioMatricula.buscarEspecialidad(datos.especialidadId);
      if (!especialidad) {
        throw new NotFoundError("Especialidad no encontrada");
      }
    }
    if (datos.numeroMatricula && datos.numeroMatricula !== matricula.numeroMatricula) {
      const existente = await repositorioMatricula.buscarPorMedicoYNumero(
        matricula.medicoId,
        datos.numeroMatricula,
      );
      if (existente) {
        throw new ConflictError("El médico ya tiene una matrícula con ese número");
      }
    }
    return repositorioMatricula.actualizar(id, datos);
  }

  async eliminar(id: string) {
    const matricula = await repositorioMatricula.buscarPorId(id);
    if (!matricula) {
      throw new NotFoundError("Matrícula no encontrada");
    }
    return repositorioMatricula.eliminar(id);
  }
}

export const servicioMatricula = new ServicioMatricula();
