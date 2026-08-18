import { repositorioMedicoHospital } from "./medicos-hospitales.repository";
import { ConflictError, NotFoundError } from "../../utils/apiError";

export class ServicioMedicoHospital {
  listar(medicoId?: string, hospitalId?: string) {
    return repositorioMedicoHospital.listar(medicoId, hospitalId);
  }

  async buscarPorId(id: string) {
    const relacion = await repositorioMedicoHospital.buscarPorId(id);
    if (!relacion) {
      throw new NotFoundError("Asignación de hospital no encontrada");
    }
    return relacion;
  }

  async crear(datos: { medicoId: string; hospitalId: string; departamentoId?: string; activo?: boolean }) {
    const medico = await repositorioMedicoHospital.buscarMedico(datos.medicoId);
    if (!medico) {
      throw new NotFoundError("Médico no encontrado");
    }
    const hospital = await repositorioMedicoHospital.buscarHospital(datos.hospitalId);
    if (!hospital) {
      throw new NotFoundError("Hospital no encontrado");
    }
    if (datos.departamentoId) {
      const departamento = await repositorioMedicoHospital.buscarDepartamento(datos.departamentoId);
      if (!departamento) {
        throw new NotFoundError("Departamento no encontrado");
      }
      if (departamento.hospitalId !== datos.hospitalId) {
        throw new ConflictError("El departamento no pertenece al hospital indicado");
      }
    }
    const existente = await repositorioMedicoHospital.buscarDuplicado(
      datos.medicoId,
      datos.hospitalId,
      datos.departamentoId,
    );
    if (existente) {
      throw new ConflictError("El médico ya está asociado a ese hospital");
    }
    return repositorioMedicoHospital.crear(datos);
  }

  async actualizar(id: string, datos: { activo?: boolean }) {
    const relacion = await repositorioMedicoHospital.buscarPorId(id);
    if (!relacion) {
      throw new NotFoundError("Asignación de hospital no encontrada");
    }
    return repositorioMedicoHospital.actualizar(id, datos);
  }

  async eliminar(id: string) {
    const relacion = await repositorioMedicoHospital.buscarPorId(id);
    if (!relacion) {
      throw new NotFoundError("Asignación de hospital no encontrada");
    }
    return repositorioMedicoHospital.eliminar(id);
  }
}

export const servicioMedicoHospital = new ServicioMedicoHospital();
