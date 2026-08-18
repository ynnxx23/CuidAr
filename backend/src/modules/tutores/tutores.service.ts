import { repositorioTutor } from "./tutores.repository";
import { ConflictError, NotFoundError } from "../../utils/apiError";

export class ServicioTutor {
  listar() {
    return repositorioTutor.listar();
  }

  async buscarPorId(id: string) {
    const tutor = await repositorioTutor.buscarPorId(id);
    if (!tutor) {
      throw new NotFoundError("Tutor no encontrado");
    }
    return tutor;
  }

  async crear(datos: { usuarioId: string; notasRelacion?: string }) {
    const usuario = await repositorioTutor.buscarUsuario(datos.usuarioId);
    if (!usuario) {
      throw new NotFoundError("Usuario no encontrado");
    }
    const existente = await repositorioTutor.buscarPorUsuarioId(datos.usuarioId);
    if (existente) {
      throw new ConflictError("El usuario ya tiene un perfil de tutor");
    }
    return repositorioTutor.crear(datos);
  }

  async actualizar(id: string, datos: { notasRelacion?: string }) {
    const tutor = await repositorioTutor.buscarPorId(id);
    if (!tutor) {
      throw new NotFoundError("Tutor no encontrado");
    }
    return repositorioTutor.actualizar(id, datos);
  }

  async eliminar(id: string) {
    const tutor = await repositorioTutor.buscarPorId(id);
    if (!tutor) {
      throw new NotFoundError("Tutor no encontrado");
    }
    const relaciones = await repositorioTutor.contarRelacionesPacientes(tutor.usuarioId);
    if (relaciones > 0) {
      throw new ConflictError("No se puede eliminar un tutor con pacientes asociados");
    }
    return repositorioTutor.eliminar(id);
  }
}

export const servicioTutor = new ServicioTutor();
