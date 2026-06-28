import { repositorioPermiso } from "./permisos.repository";
import { NotFoundError, ConflictError } from "../../utils/apiError";

export class ServicioPermiso {
  async listar(filtro?: { recurso?: string }) {
    return repositorioPermiso.listar(filtro);
  }

  async buscarPorId(id: string) {
    const permiso = await repositorioPermiso.buscarPorId(id);
    if (!permiso) {
      throw new NotFoundError("Permiso no encontrado");
    }
    return permiso;
  }

  async crear(datos: { codigo: string; nombre: string; recurso: string; accion: string; descripcion?: string }) {
    const existe = await repositorioPermiso.buscarPorCodigo(datos.codigo);
    if (existe) {
      throw new ConflictError("El código de permiso ya existe");
    }
    return repositorioPermiso.crear(datos);
  }

  async actualizar(id: string, datos: { codigo?: string; nombre?: string; recurso?: string; accion?: string; descripcion?: string }) {
    const permiso = await repositorioPermiso.buscarPorId(id);
    if (!permiso) {
      throw new NotFoundError("Permiso no encontrado");
    }
    if (datos.codigo && datos.codigo !== permiso.codigo) {
      const existe = await repositorioPermiso.buscarPorCodigo(datos.codigo);
      if (existe) {
        throw new ConflictError("El código de permiso ya está en uso");
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
