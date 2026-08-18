import { ValidationError } from "../../utils/apiError";

interface Errores {
  [campo: string]: string;
}

export class ValidacionEspecialidad {
  validarCrear(datos: { nombre: string; descripcion?: string; especialidadPadreId?: string }): void {
    const errores: Errores = {};

    if (!datos.nombre) {
      errores.nombre = "Nombre es requerido";
    } else if (datos.nombre.length > 100) {
      errores.nombre = "Nombre debe tener máximo 100 caracteres";
    }
    if (datos.descripcion && datos.descripcion.length > 500) {
      errores.descripcion = "Descripción debe tener máximo 500 caracteres";
    }

    if (Object.keys(errores).length > 0) {
      throw new ValidationError(JSON.stringify(errores));
    }
  }

  validarActualizar(datos: { nombre?: string; descripcion?: string; especialidadPadreId?: string }): void {
    const errores: Errores = {};

    if (datos.nombre && datos.nombre.length > 100) {
      errores.nombre = "Nombre debe tener máximo 100 caracteres";
    }
    if (datos.descripcion && datos.descripcion.length > 500) {
      errores.descripcion = "Descripción debe tener máximo 500 caracteres";
    }

    if (Object.keys(errores).length > 0) {
      throw new ValidationError(JSON.stringify(errores));
    }
  }
}

export const validacionEspecialidad = new ValidacionEspecialidad();
