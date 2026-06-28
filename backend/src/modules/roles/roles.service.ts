import { repositorioRol } from "./roles.repository";
import { NotFoundError, ConflictError } from "../../utils/apiError";

export class ServicioRol {
  async listar() {
    return repositorioRol.listar();
  }

  async buscarPorId(id: string) {
    const rol = await repositorioRol.buscarPorId(id);
    if (!rol) {
      throw new NotFoundError("Rol no encontrado");
    }
    return rol;
  }

  async crear(datos: { codigo: string; nombre: string; descripcion?: string }) {
    const existe = await repositorioRol.buscarPorCodigo(datos.codigo);
    if (existe) {
      throw new ConflictError("El código de rol ya existe");
    }
    return repositorioRol.crear(datos);
  }

  async actualizar(id: string, datos: { codigo?: string; nombre?: string; descripcion?: string }) {
    const rol = await repositorioRol.buscarPorId(id);
    if (!rol) {
      throw new NotFoundError("Rol no encontrado");
    }
    if (datos.codigo && datos.codigo !== rol.codigo) {
      const existe = await repositorioRol.buscarPorCodigo(datos.codigo);
      if (existe) {
        throw new ConflictError("El código de rol ya está en uso");
      }
    }
    return repositorioRol.actualizar(id, datos);
  }

  async eliminar(id: string) {
    const rol = await repositorioRol.buscarPorId(id);
    if (!rol) {
      throw new NotFoundError("Rol no encontrado");
    }
    if (rol._count.usuariosRoles > 0) {
      throw new ConflictError("No se puede eliminar un rol con usuarios asignados");
    }
    return repositorioRol.eliminar(id);
  }

  async asignarPermiso(rolId: string, permisoId: string) {
    const rol = await repositorioRol.buscarPorId(rolId);
    if (!rol) {
      throw new NotFoundError("Rol no encontrado");
    }
    return repositorioRol.asignarPermiso(rolId, permisoId);
  }

  async removerPermiso(rolId: string, permisoId: string) {
    const rol = await repositorioRol.buscarPorId(rolId);
    if (!rol) {
      throw new NotFoundError("Rol no encontrado");
    }
    return repositorioRol.removerPermiso(rolId, permisoId);
  }
}

export const servicioRol = new ServicioRol();
