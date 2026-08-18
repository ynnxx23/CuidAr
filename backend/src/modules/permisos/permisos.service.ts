import { repositorioPermiso, FiltroPermiso } from "./permisos.repository";
import { ConflictError, NotFoundError } from "../../utils/apiError";

export class ServicioPermiso {
  listar(filtro?: FiltroPermiso) {
    return repositorioPermiso.listar(filtro);
  }

  async buscarPorId(id: string) {
    const permiso = await repositorioPermiso.buscarPorId(id);
    if (!permiso) {
      throw new NotFoundError("Permiso no encontrado");
    }
    return permiso;
  }

  async crear(datos: {
    codigo: string;
    nombre: string;
    recurso: string;
    accion: string;
    descripcion?: string;
  }) {
    const existente = await repositorioPermiso.buscarPorCodigo(datos.codigo);
    if (existente) {
      throw new ConflictError("El código de permiso ya existe");
    }
    return repositorioPermiso.crear(datos);
  }

  async actualizar(
    id: string,
    datos: { codigo?: string; nombre?: string; recurso?: string; accion?: string; descripcion?: string },
  ) {
    const permiso = await repositorioPermiso.buscarPorId(id);
    if (!permiso) {
      throw new NotFoundError("Permiso no encontrado");
    }

    if (datos.codigo && datos.codigo !== permiso.codigo) {
      const existente = await repositorioPermiso.buscarPorCodigo(datos.codigo);
      if (existente) {
        throw new ConflictError("El código de permiso ya existe");
      }
    }

    return repositorioPermiso.actualizar(id, datos);
  }

  async eliminar(id: string) {
    const permiso = await repositorioPermiso.buscarPorId(id);
    if (!permiso) {
      throw new NotFoundError("Permiso no encontrado");
    }
    return repositorioPermiso.eliminar(id);
  }
}

export const servicioPermiso = new ServicioPermiso();
