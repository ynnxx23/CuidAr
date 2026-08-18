import { repositorioAreaMedica } from "./areas-medicas.repository";
import { ConflictError, NotFoundError } from "../../utils/apiError";

export class ServicioAreaMedica {
  listar() {
    return repositorioAreaMedica.listar();
  }

  async buscarPorId(id: string) {
    const areaMedica = await repositorioAreaMedica.buscarPorId(id);
    if (!areaMedica) {
      throw new NotFoundError("Área médica no encontrada");
    }
    return areaMedica;
  }

  async crear(datos: { nombre: string; descripcion?: string }) {
    const existente = await repositorioAreaMedica.buscarPorNombre(datos.nombre);
    if (existente) {
      throw new ConflictError("El nombre del área médica ya existe");
    }
    return repositorioAreaMedica.crear(datos);
  }

  async actualizar(id: string, datos: { nombre?: string; descripcion?: string }) {
    const areaMedica = await repositorioAreaMedica.buscarPorId(id);
    if (!areaMedica) {
      throw new NotFoundError("Área médica no encontrada");
    }

    if (datos.nombre && datos.nombre !== areaMedica.nombre) {
      const existente = await repositorioAreaMedica.buscarPorNombre(datos.nombre);
      if (existente) {
        throw new ConflictError("El nombre del área médica ya existe");
      }
    }

    return repositorioAreaMedica.actualizar(id, datos);
  }

  async eliminar(id: string) {
    const areaMedica = await repositorioAreaMedica.buscarPorId(id);
    if (!areaMedica) {
      throw new NotFoundError("Área médica no encontrada");
    }
    const hospitales = await repositorioAreaMedica.contarHospitales(id);
    if (hospitales > 0) {
      throw new ConflictError("No se puede eliminar un área médica con hospitales asociados");
    }
    const consultorios = await repositorioAreaMedica.contarConsultorios(id);
    if (consultorios > 0) {
      throw new ConflictError("No se puede eliminar un área médica con consultorios asociados");
    }
    return repositorioAreaMedica.eliminar(id);
  }
}

export const servicioAreaMedica = new ServicioAreaMedica();
