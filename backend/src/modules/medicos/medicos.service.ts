import { repositorioMedico } from "./medicos.repository";
import { ConflictError, NotFoundError } from "../../utils/apiError";

export class ServicioMedico {
  listar() {
    return repositorioMedico.listar();
  }

  async buscarPorId(id: string) {
    const medico = await repositorioMedico.buscarPorId(id);
    if (!medico) {
      throw new NotFoundError("Médico no encontrado");
    }
    return medico;
  }

  async crear(datos: { usuarioId: string; numeroMatricula: string; biografia?: string; estadoLaboral?: string; notas?: string }) {
    const usuario = await repositorioMedico.buscarUsuario(datos.usuarioId);
    if (!usuario) {
      throw new NotFoundError("Usuario no encontrado");
    }
    const existente = await repositorioMedico.buscarPorUsuarioId(datos.usuarioId);
    if (existente) {
      throw new ConflictError("El usuario ya tiene un perfil médico");
    }
    const matriculaExistente = await repositorioMedico.buscarPorNumeroMatricula(datos.numeroMatricula);
    if (matriculaExistente) {
      throw new ConflictError("El número de matrícula ya está en uso");
    }
    return repositorioMedico.crear(datos);
  }

  async actualizar(id: string, datos: { numeroMatricula?: string; biografia?: string; estadoLaboral?: string; notas?: string }) {
    const medico = await repositorioMedico.buscarPorId(id);
    if (!medico) {
      throw new NotFoundError("Médico no encontrado");
    }
    if (datos.numeroMatricula && datos.numeroMatricula !== medico.numeroMatricula) {
      const existente = await repositorioMedico.buscarPorNumeroMatricula(datos.numeroMatricula);
      if (existente) {
        throw new ConflictError("El número de matrícula ya está en uso");
      }
    }
    return repositorioMedico.actualizar(id, datos);
  }

  async eliminar(id: string) {
    const medico = await repositorioMedico.buscarPorId(id);
    if (!medico) {
      throw new NotFoundError("Médico no encontrado");
    }
    const matriculas = await repositorioMedico.contarMatriculas(id);
    if (matriculas > 0) {
      throw new ConflictError("No se puede eliminar un médico con matrículas asociadas");
    }
    const especialidades = await repositorioMedico.contarEspecialidades(id);
    if (especialidades > 0) {
      throw new ConflictError("No se puede eliminar un médico con especialidades asociadas");
    }
    const hospitales = await repositorioMedico.contarHospitales(id);
    if (hospitales > 0) {
      throw new ConflictError("No se puede eliminar un médico con hospitales asociados");
    }
    const turnos = await repositorioMedico.contarTurnos(id);
    if (turnos > 0) {
      throw new ConflictError("No se puede eliminar un médico con turnos asociados");
    }
    const bloques = await repositorioMedico.contarBloquesHorarios(id);
    if (bloques > 0) {
      throw new ConflictError("No se puede eliminar un médico con bloques horarios asociados");
    }
    return repositorioMedico.eliminar(id);
  }
}

export const servicioMedico = new ServicioMedico();
