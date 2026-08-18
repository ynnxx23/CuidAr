import { repositorioBarrio } from "./barrios.repository";
import { ConflictError, NotFoundError } from "../../utils/apiError";

export class ServicioBarrio {
  listar(localidadId?: string) {
    return repositorioBarrio.listar(localidadId);
  }

  async buscarPorId(id: string) {
    const barrio = await repositorioBarrio.buscarPorId(id);
    if (!barrio) {
      throw new NotFoundError("Barrio no encontrado");
    }
    return barrio;
  }

  async crear(datos: { localidadId: string; nombre: string }) {
    const localidad = await repositorioBarrio.buscarLocalidad(datos.localidadId);
    if (!localidad) {
      throw new NotFoundError("Localidad no encontrada");
    }

    const existente = await repositorioBarrio.buscarPorLocalidadYNombre(datos.localidadId, datos.nombre);
    if (existente) {
      throw new ConflictError("El barrio ya existe en esta localidad");
    }
    return repositorioBarrio.crear(datos);
  }

  async actualizar(id: string, datos: { localidadId?: string; nombre?: string }) {
    const barrio = await repositorioBarrio.buscarPorId(id);
    if (!barrio) {
      throw new NotFoundError("Barrio no encontrado");
    }

    if (datos.localidadId) {
      const localidad = await repositorioBarrio.buscarLocalidad(datos.localidadId);
      if (!localidad) {
        throw new NotFoundError("Localidad no encontrada");
      }
    }

    const localidadIdNueva = datos.localidadId ?? barrio.localidadId;
    const nombreNuevo = datos.nombre ?? barrio.nombre;
    if (nombreNuevo !== barrio.nombre || localidadIdNueva !== barrio.localidadId) {
      const existente = await repositorioBarrio.buscarPorLocalidadYNombre(localidadIdNueva, nombreNuevo);
      if (existente && existente.id !== id) {
        throw new ConflictError("El barrio ya existe en esta localidad");
      }
    }

    return repositorioBarrio.actualizar(id, datos);
  }

  async eliminar(id: string) {
    const barrio = await repositorioBarrio.buscarPorId(id);
    if (!barrio) {
      throw new NotFoundError("Barrio no encontrado");
    }
    const hospitales = await repositorioBarrio.contarHospitales(id);
    if (hospitales > 0) {
      throw new ConflictError("No se puede eliminar un barrio con hospitales asociados");
    }
    return repositorioBarrio.eliminar(id);
  }
}

export const servicioBarrio = new ServicioBarrio();
