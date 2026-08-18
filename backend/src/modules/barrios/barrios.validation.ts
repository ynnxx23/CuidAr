import { ValidationError } from "../../utils/apiError";

interface Errores {
  [campo: string]: string;
}

export class ValidacionBarrio {
  validarCrear(datos: { localidadId: string; nombre: string }): void {
    const errores: Errores = {};

    if (!datos.localidadId || datos.localidadId.trim().length === 0) {
      errores.localidadId = "Localidad es requerida";
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

  validarActualizar(datos: { localidadId?: string; nombre?: string }): void {
    const errores: Errores = {};

    if (datos.localidadId !== undefined && datos.localidadId.trim().length === 0) {
      errores.localidadId = "Localidad no puede estar vacía";
    }
    if (datos.nombre !== undefined && datos.nombre.trim().length === 0) {
      errores.nombre = "Nombre no puede estar vacío";
    }

    if (Object.keys(errores).length > 0) {
      throw new ValidationError(JSON.stringify(errores));
    }
  }
}

export const validacionBarrio = new ValidacionBarrio();
