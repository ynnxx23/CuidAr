import { repositorioLocalidad } from "./localidades.repository";
import { ConflictError, NotFoundError } from "../../utils/apiError";

export class ServicioLocalidad {
  listar(provinciaId?: string) {
    return repositorioLocalidad.listar(provinciaId);
  }

  async buscarPorId(id: string) {
    const localidad = await repositorioLocalidad.buscarPorId(id);
    if (!localidad) {
      throw new NotFoundError("Localidad no encontrada");
    }
    return localidad;
  }

  async crear(datos: { provinciaId: string; nombre: string }) {
    const provincia = await repositorioLocalidad.buscarProvincia(datos.provinciaId);
    if (!provincia) {
      throw new NotFoundError("Provincia no encontrada");
    }

    const existente = await repositorioLocalidad.buscarPorProvinciaYNombre(
      datos.provinciaId,
      datos.nombre,
    );
    if (existente) {
      throw new ConflictError("La localidad ya existe en esta provincia");
    }
    return repositorioLocalidad.crear(datos);
  }

  async actualizar(id: string, datos: { provinciaId?: string; nombre?: string }) {
    const localidad = await repositorioLocalidad.buscarPorId(id);
    if (!localidad) {
      throw new NotFoundError("Localidad no encontrada");
    }

    if (datos.provinciaId) {
      const provincia = await repositorioLocalidad.buscarProvincia(datos.provinciaId);
      if (!provincia) {
        throw new NotFoundError("Provincia no encontrada");
      }
    }

    const provinciaIdNuevo = datos.provinciaId ?? localidad.provinciaId;
    const nombreNuevo = datos.nombre ?? localidad.nombre;
    if (nombreNuevo !== localidad.nombre || provinciaIdNuevo !== localidad.provinciaId) {
      const existente = await repositorioLocalidad.buscarPorProvinciaYNombre(
        provinciaIdNuevo,
        nombreNuevo,
      );
      if (existente && existente.id !== id) {
        throw new ConflictError("La localidad ya existe en esta provincia");
      }
    }

    return repositorioLocalidad.actualizar(id, datos);
  }

  async eliminar(id: string) {
    const localidad = await repositorioLocalidad.buscarPorId(id);
    if (!localidad) {
      throw new NotFoundError("Localidad no encontrada");
    }
    const barrios = await repositorioLocalidad.contarBarrios(id);
    if (barrios > 0) {
      throw new ConflictError("No se puede eliminar una localidad con barrios asociados");
    }
    return repositorioLocalidad.eliminar(id);
  }
}

export const servicioLocalidad = new ServicioLocalidad();
