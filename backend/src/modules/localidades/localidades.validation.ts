import { ValidationError } from "../../utils/apiError";

interface Errores {
  [campo: string]: string;
}

export class ValidacionLocalidad {
  validarCrear(datos: { provinciaId: string; nombre: string }): void {
    const errores: Errores = {};

    if (!datos.provinciaId || datos.provinciaId.trim().length === 0) {
      errores.provinciaId = "Provincia es requerida";
    }
    if (!datos.nombre || datos.nombre.trim().length === 0) {
      errores.nombre = "Nombre es requerido";
    } else if (datos.nombre.length > 120) {
      errores.nombre = "Nombre debe tener máximo 120 caracteres";
    }

    if (Object.keys(errores).length > 0) {
      throw new ValidationError(JSON.stringify(errores));
    }
  }

  validarActualizar(datos: { provinciaId?: string; nombre?: string }): void {
    const errores: Errores = {};

    if (datos.provinciaId !== undefined && datos.provinciaId.trim().length === 0) {
      errores.provinciaId = "Provincia no puede estar vacía";
    }
    if (datos.nombre !== undefined && datos.nombre.trim().length === 0) {
      errores.nombre = "Nombre no puede estar vacío";
    }

    if (Object.keys(errores).length > 0) {
      throw new ValidationError(JSON.stringify(errores));
    }
  }
}

export const validacionLocalidad = new ValidacionLocalidad();
