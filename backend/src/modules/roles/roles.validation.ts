import { ValidationError } from "../../utils/apiError";

interface Errores {
  [campo: string]: string;
}

export class ValidacionRol {
  validarCrear(datos: { codigo: string; nombre: string; descripcion?: string }): void {
    const errores: Errores = {};

    if (!datos.codigo || datos.codigo.trim().length === 0) {
      errores.codigo = "Código es requerido";
    } else if (datos.codigo.length > 60) {
      errores.codigo = "Código debe tener máximo 60 caracteres";
    }
    if (!datos.nombre || datos.nombre.trim().length === 0) {
      errores.nombre = "Nombre es requerido";
    } else if (datos.nombre.length > 100) {
      errores.nombre = "Nombre debe tener máximo 100 caracteres";
    }

    if (Object.keys(errores).length > 0) {
      throw new ValidationError(JSON.stringify(errores));
    }
  }

  validarActualizar(datos: { codigo?: string; nombre?: string; descripcion?: string }): void {
    const errores: Errores = {};

    if (datos.codigo !== undefined && datos.codigo.trim().length === 0) {
      errores.codigo = "Código no puede estar vacío";
    }
    if (datos.nombre !== undefined && datos.nombre.trim().length === 0) {
      errores.nombre = "Nombre no puede estar vacío";
    }

    if (Object.keys(errores).length > 0) {
      throw new ValidationError(JSON.stringify(errores));
    }
  }
}

export const validacionRol = new ValidacionRol();
