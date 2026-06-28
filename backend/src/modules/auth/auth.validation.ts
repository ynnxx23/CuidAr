import { ValidationError } from "../../utils/apiError";

interface Errores {
  [campo: string]: string;
}

export class ValidacionAuth {
  validarRegistro(datos: {
    dni: string;
    correoElectronico: string;
    contrasena: string;
    nombre: string;
    apellido: string;
    telefono?: string;
    fechaNacimiento?: string;
    genero?: string;
  }): void {
    const errores: Errores = {};

    if (!datos.dni || datos.dni.trim().length < 6) {
      errores.dni = "DNI debe tener al menos 6 caracteres";
    }
    if (!datos.correoElectronico || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.correoElectronico)) {
      errores.correoElectronico = "Correo electrónico inválido";
    }
    if (!datos.contrasena || datos.contrasena.length < 8) {
      errores.contrasena = "Contraseña debe tener al menos 8 caracteres";
    }
    if (!datos.nombre || datos.nombre.trim().length === 0) {
      errores.nombre = "Nombre es requerido";
    }
    if (!datos.apellido || datos.apellido.trim().length === 0) {
      errores.apellido = "Apellido es requerido";
    }

    if (Object.keys(errores).length > 0) {
      throw new ValidationError(JSON.stringify(errores));
    }
  }

  validarLogin(datos: {
    correoElectronico: string;
    contrasena: string;
  }): void {
    const errores: Errores = {};

    if (!datos.correoElectronico) {
      errores.correoElectronico = "Correo electrónico es requerido";
    }
    if (!datos.contrasena) {
      errores.contrasena = "Contraseña es requerida";
    }

    if (Object.keys(errores).length > 0) {
      throw new ValidationError(JSON.stringify(errores));
    }
  }

  validarTokenActualizacion(datos: { tokenActualizacion: string }): void {
    if (!datos.tokenActualizacion) {
      throw new ValidationError("Token de actualización es requerido");
    }
  }
}

export const validacionAuth = new ValidacionAuth();
