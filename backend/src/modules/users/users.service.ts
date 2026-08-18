import { repositorioUsuario } from './users.repository';
import { ActualizarUsuarioDTO } from './users.validation';
import { NotFoundError, ConflictError } from '../../utils/apiError';

export class ServicioUsuario {
  async obtenerPorId(id: string) {
    const usuario = await repositorioUsuario.buscarPorId(id);
    if (!usuario) throw new NotFoundError('Usuario no encontrado');
    return usuario;
  }

  async listar(filtros: {
    nombre?: string;
    email?: string;
    dni?: string;
    estado?: string;
  }) {
    return repositorioUsuario.listar(filtros);
  }

  async actualizar(id: string, datos: ActualizarUsuarioDTO) {
    const usuario = await repositorioUsuario.buscarPorId(id);
    if (!usuario) throw new NotFoundError('Usuario no encontrado');

    if (datos.correoElectronico && datos.correoElectronico !== usuario.correoElectronico) {
      const existente = await repositorioUsuario.buscarPorEmail(datos.correoElectronico);
      if (existente) throw new ConflictError('El correo electrónico ya está en uso');
    }

    const datosActualizar: Record<string, unknown> = {};
    if (datos.nombre !== undefined) datosActualizar.nombre = datos.nombre;
    if (datos.apellido !== undefined) datosActualizar.apellido = datos.apellido;
    if (datos.correoElectronico !== undefined) datosActualizar.correoElectronico = datos.correoElectronico;
    if (datos.telefono !== undefined) datosActualizar.telefono = datos.telefono;
    if (datos.fechaNacimiento !== undefined) datosActualizar.fechaNacimiento = datos.fechaNacimiento;
    if (datos.genero !== undefined) datosActualizar.genero = datos.genero;
    if (datos.estado !== undefined) datosActualizar.estado = datos.estado;

    return repositorioUsuario.actualizar(id, datosActualizar);
  }

  async eliminar(id: string) {
    const usuario = await repositorioUsuario.buscarPorId(id);
    if (!usuario) throw new NotFoundError('Usuario no encontrado');
    return repositorioUsuario.eliminar(id);
  }
}

export const servicioUsuario = new ServicioUsuario();
