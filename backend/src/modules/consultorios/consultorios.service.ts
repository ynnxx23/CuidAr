import { repositorioConsultorio } from "./consultorios.repository";
import { ConflictError, NotFoundError } from "../../utils/apiError";

export class ServicioConsultorio {
  listar(hospitalId?: string, departamentoId?: string, areaMedicaId?: string) {
    return repositorioConsultorio.listar(hospitalId, departamentoId, areaMedicaId);
  }

  async buscarPorId(id: string) {
    const consultorio = await repositorioConsultorio.buscarPorId(id);
    if (!consultorio) {
      throw new NotFoundError("Consultorio no encontrado");
    }
    return consultorio;
  }

  async crear(datos: {
    hospitalId: string;
    nombre: string;
    departamentoId?: string;
    areaMedicaId?: string;
    codigoConsultorio?: string;
  }) {
    await this.validarRelaciones(datos.hospitalId, datos.departamentoId, datos.areaMedicaId);
    const existente = await repositorioConsultorio.buscarPorHospitalYNombre(datos.hospitalId, datos.nombre);
    if (existente) {
      throw new ConflictError("Ya existe un consultorio con ese nombre en el hospital");
    }
    return repositorioConsultorio.crear(datos);
  }

  async actualizar(id: string, datos: {
    nombre?: string;
    departamentoId?: string;
    areaMedicaId?: string;
    codigoConsultorio?: string;
  }) {
    const consultorio = await repositorioConsultorio.buscarPorId(id);
    if (!consultorio) {
      throw new NotFoundError("Consultorio no encontrado");
    }
    const hospitalId = consultorio.hospitalId;
    const departamentoId = datos.departamentoId !== undefined ? datos.departamentoId : consultorio.departamentoId;
    const areaMedicaId = datos.areaMedicaId !== undefined ? datos.areaMedicaId : consultorio.areaMedicaId;
    await this.validarRelaciones(hospitalId, departamentoId ?? undefined, areaMedicaId ?? undefined);

    if (datos.nombre && datos.nombre !== consultorio.nombre) {
      const existente = await repositorioConsultorio.buscarPorHospitalYNombre(hospitalId, datos.nombre);
      if (existente) {
        throw new ConflictError("Ya existe un consultorio con ese nombre en el hospital");
      }
    }
    return repositorioConsultorio.actualizar(id, datos);
  }

  async eliminar(id: string) {
    const consultorio = await repositorioConsultorio.buscarPorId(id);
    if (!consultorio) {
      throw new NotFoundError("Consultorio no encontrado");
    }
    const turnos = await repositorioConsultorio.contarTurnos(id);
    if (turnos > 0) {
      throw new ConflictError("No se puede eliminar un consultorio con turnos asociados");
    }
    return repositorioConsultorio.eliminar(id);
  }

  private async validarRelaciones(hospitalId: string, departamentoId?: string, areaMedicaId?: string) {
    const hospital = await repositorioConsultorio.buscarHospital(hospitalId);
    if (!hospital) {
      throw new NotFoundError("Hospital no encontrado");
    }
    if (departamentoId) {
      const departamento = await repositorioConsultorio.buscarDepartamento(departamentoId);
      if (!departamento) {
        throw new NotFoundError("Departamento no encontrado");
      }
      if (departamento.hospitalId !== hospitalId) {
        throw new ConflictError("El departamento no pertenece al hospital indicado");
      }
    }
    if (areaMedicaId) {
      const areaMedica = await repositorioConsultorio.buscarAreaMedica(areaMedicaId);
      if (!areaMedica) {
        throw new NotFoundError("Área médica no encontrada");
      }
    }
  }
}

export const servicioConsultorio = new ServicioConsultorio();
