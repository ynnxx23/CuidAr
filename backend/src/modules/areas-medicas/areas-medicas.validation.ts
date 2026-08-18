import { ValidationError } from "../../utils/apiError";

interface Errores {
  [campo: string]: string;
}

export class ValidacionAreaMedica {
  validarCrear(datos: { nombre: string; descripcion?: string }): void {
    const errores: Errores = {};

    if (!datos.nombre || datos.nombre.trim().length === 0) {
      errores.nombre = "Nombre es requerido";
    } else if (datos.nombre.length > 200) {
      errores.nombre = "Nombre debe tener máximo 200 caracteres";
    }

    if (Object.keys(errores).length > 0) {
      throw new ValidationError(JSON.stringify(errores));
    }
  }

  validarActualizar(datos: { nombre?: string; descripcion?: string }): void {
    const errores: Errores = {};

    if (datos.nombre !== undefined && datos.nombre.trim().length === 0) {
      errores.nombre = "Nombre no puede estar vacío";
    }

    if (Object.keys(errores).length > 0) {
      throw new ValidationError(JSON.stringify(errores));
    }
  }
}

export const validacionAreaMedica = new ValidacionAreaMedica();
