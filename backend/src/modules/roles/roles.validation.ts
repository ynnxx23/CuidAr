import { ValidationError } from "../../utils/apiError";

interface Errores {
  [campo: string]: string;
}

export class ValidacionRol {
  validarCrear(datos: { codigo?: string; nombre?: string; descripcion?: string }): void {
    const errores: Errores = {};

    if (!datos.codigo || datos.codigo.trim().length === 0) {
      errores.codigo = "Código de rol es requerido";
    } else if (datos.codigo.length > 60) {
      errores.codigo = "Código no puede exceder 60 caracteres";
    }

    if (!datos.nombre || datos.nombre.trim().length === 0) {
      errores.nombre = "Nombre de rol es requerido";
    } else if (datos.nombre.length > 100) {
      errores.nombre = "Nombre no puede exceder 100 caracteres";
    }

    if (Object.keys(errores).length > 0) {
      throw new ValidationError(JSON.stringify(errores));
    }
  }

  validarActualizar(datos: { codigo?: string; nombre?: string; descripcion?: string }): void {
    const errores: Errores = {};

    if (datos.codigo !== undefined) {
      if (datos.codigo.trim().length === 0) {
        errores.codigo = "Código no puede estar vacío";
      } else if (datos.codigo.length > 60) {
        errores.codigo = "Código no puede exceder 60 caracteres";
      }
    }

    if (datos.nombre !== undefined) {
      if (datos.nombre.trim().length === 0) {
        errores.nombre = "Nombre no puede estar vacío";
      } else if (datos.nombre.length > 100) {
        errores.nombre = "Nombre no puede exceder 100 caracteres";
      }
    }

    if (Object.keys(errores).length > 0) {
      throw new ValidationError(JSON.stringify(errores));
    }
  }
}

export const validacionRol = new ValidacionRol();
