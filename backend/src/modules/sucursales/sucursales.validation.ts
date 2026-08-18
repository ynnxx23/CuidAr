import { ValidationError } from "../../utils/apiError";

interface Errores {
  [campo: string]: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class ValidacionSucursal {
  validarCrear(datos: {
    hospitalId: string;
    nombre: string;
    direccion?: string;
    telefono?: string;
    correoElectronico?: string;
  }): void {
    const errores: Errores = {};

    if (!datos.hospitalId) {
      errores.hospitalId = "Hospital es requerido";
    }
    if (!datos.nombre || datos.nombre.trim().length === 0) {
      errores.nombre = "Nombre es requerido";
    } else if (datos.nombre.length > 200) {
      errores.nombre = "Nombre debe tener máximo 200 caracteres";
    }
    if (datos.telefono && datos.telefono.length > 30) {
      errores.telefono = "Teléfono debe tener máximo 30 caracteres";
    }
    if (datos.correoElectronico && !EMAIL_REGEX.test(datos.correoElectronico)) {
      errores.correoElectronico = "Correo electrónico no válido";
    }

    if (Object.keys(errores).length > 0) {
      throw new ValidationError(JSON.stringify(errores));
    }
  }

  validarActualizar(datos: {
    nombre?: string;
    direccion?: string;
    telefono?: string;
    correoElectronico?: string;
  }): void {
    const errores: Errores = {};

    if (datos.nombre !== undefined && datos.nombre.trim().length === 0) {
      errores.nombre = "Nombre no puede estar vacío";
    }
    if (datos.telefono && datos.telefono.length > 30) {
      errores.telefono = "Teléfono debe tener máximo 30 caracteres";
    }
    if (datos.correoElectronico && !EMAIL_REGEX.test(datos.correoElectronico)) {
      errores.correoElectronico = "Correo electrónico no válido";
    }

    if (Object.keys(errores).length > 0) {
      throw new ValidationError(JSON.stringify(errores));
    }
  }
}

export const validacionSucursal = new ValidacionSucursal();
