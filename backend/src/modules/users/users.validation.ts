import { ValidationError } from '../../utils/apiError';

const ERRORES = {
  NOMBRE_OBLIGATORIO: 'El nombre es obligatorio',
  APELLIDO_OBLIGATORIO: 'El apellido es obligatorio',
  EMAIL_FORMATO: 'El formato del correo electrónico no es válido',
  TELEFONO_FORMATO: 'El formato del teléfono no es válido',
  ESTADO_INVALIDO: 'El estado no es válido',
};

export interface ActualizarUsuarioDTO {
  nombre?: string;
  apellido?: string;
  correoElectronico?: string;
  telefono?: string;
  fechaNacimiento?: string;
  genero?: string;
  estado?: string;
}

export function validarActualizarUsuario(datos: ActualizarUsuarioDTO): void {
  if (datos.nombre !== undefined) {
    if (!datos.nombre || datos.nombre.trim().length === 0) {
      throw new ValidationError(ERRORES.NOMBRE_OBLIGATORIO);
    }
  }
  if (datos.apellido !== undefined) {
    if (!datos.apellido || datos.apellido.trim().length === 0) {
      throw new ValidationError(ERRORES.APELLIDO_OBLIGATORIO);
    }
  }
  if (datos.correoElectronico !== undefined) {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.correoElectronico)) {
      throw new ValidationError(ERRORES.EMAIL_FORMATO);
    }
  }
  if (datos.telefono !== undefined && datos.telefono !== null) {
    if (datos.telefono && !/^\+?[\d\s\-()]{7,30}$/.test(datos.telefono)) {
      throw new ValidationError(ERRORES.TELEFONO_FORMATO);
    }
  }
  if (datos.estado !== undefined) {
    const estadosValidos = ['active', 'inactive', 'suspended'];
    if (!estadosValidos.includes(datos.estado)) {
      throw new ValidationError(ERRORES.ESTADO_INVALIDO);
    }
  }
}
