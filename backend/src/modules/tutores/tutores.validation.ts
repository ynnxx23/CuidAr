import { ValidationError } from "../../utils/apiError";

interface Errores {
  [campo: string]: string;
}

export class ValidacionTutor {
  validarCrear(datos: { usuarioId: string; notasRelacion?: string }): void {
    const errores: Errores = {};

    if (!datos.usuarioId) {
      errores.usuarioId = "Usuario es requerido";
    }

    if (Object.keys(errores).length > 0) {
      throw new ValidationError(JSON.stringify(errores));
    }
  }

  validarActualizar(_datos: { notasRelacion?: string }): void {
    const errores: Errores = {};

    if (Object.keys(errores).length > 0) {
      throw new ValidationError(JSON.stringify(errores));
    }
  }
}

export const validacionTutor = new ValidacionTutor();
