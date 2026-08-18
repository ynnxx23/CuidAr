import { repositorioDepartamento } from "./departamentos.repository";
import { ConflictError, NotFoundError } from "../../utils/apiError";

export class ServicioDepartamento {
  listar(hospitalId?: string) {
    return repositorioDepartamento.listar(hospitalId);
  }

  async buscarPorId(id: string) {
    const departamento = await repositorioDepartamento.buscarPorId(id);
    if (!departamento) {
      throw new NotFoundError("Departamento no encontrado");
    }
    return departamento;
  }

  async crear(datos: { hospitalId: string; nombre: string; descripcion?: string }) {
    const hospital = await repositorioDepartamento.buscarHospital(datos.hospitalId);
    if (!hospital) {
      throw new NotFoundError("Hospital no encontrado");
    }
    const existente = await repositorioDepartamento.buscarPorHospitalYNombre(datos.hospitalId, datos.nombre);
    if (existente) {
      throw new ConflictError("Ya existe un departamento con ese nombre en el hospital");
    }
    return repositorioDepartamento.crear(datos);
  }

  async actualizar(id: string, datos: { nombre?: string; descripcion?: string }) {
    const departamento = await repositorioDepartamento.buscarPorId(id);
    if (!departamento) {
      throw new NotFoundError("Departamento no encontrado");
    }
    if (datos.nombre && datos.nombre !== departamento.nombre) {
      const existente = await repositorioDepartamento.buscarPorHospitalYNombre(departamento.hospitalId, datos.nombre);
      if (existente) {
        throw new ConflictError("Ya existe un departamento con ese nombre en el hospital");
      }
    }
    return repositorioDepartamento.actualizar(id, datos);
  }

  async eliminar(id: string) {
    const departamento = await repositorioDepartamento.buscarPorId(id);
    if (!departamento) {
      throw new NotFoundError("Departamento no encontrado");
    }
    const consultorios = await repositorioDepartamento.contarConsultorios(id);
    if (consultorios > 0) {
      throw new ConflictError("No se puede eliminar un departamento con consultorios asociados");
    }
    return repositorioDepartamento.eliminar(id);
  }
}

export const servicioDepartamento = new ServicioDepartamento();
