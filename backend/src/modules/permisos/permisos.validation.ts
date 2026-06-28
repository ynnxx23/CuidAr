import { ValidationError } from "../../utils/apiError";

interface Errores {
  [campo: string]: string;
}

export class ValidacionPermiso {
  validarCrear(datos: { codigo?: string; recurso?: string; accion?: string; nombre?: string; descripcion?: string }): void {
    const errores: Errores = {};

    if (!datos.codigo || datos.codigo.trim().length === 0) {
      errores.codigo = "Código de permiso es requerido";
    } else if (datos.codigo.length > 120) {
      errores.codigo = "Código no puede exceder 120 caracteres";
    }

    if (!datos.recurso || datos.recurso.trim().length === 0) {
      errores.recurso = "Recurso es requerido";
    } else if (datos.recurso.length > 80) {
      errores.recurso = "Recurso no puede exceder 80 caracteres";
    }

    if (!datos.accion || datos.accion.trim().length === 0) {
      errores.accion = "Acción es requerida";
    } else if (datos.accion.length > 80) {
      errores.accion = "Acción no puede exceder 80 caracteres";
    }

    if (!datos.nombre || datos.nombre.trim().length === 0) {
      errores.nombre = "Nombre es requerido";
    }

    if (Object.keys(errores).length > 0) {
      throw new ValidationError(JSON.stringify(errores));
    }
  }

  validarActualizar(datos: { codigo?: string; recurso?: string; accion?: string; nombre?: string; descripcion?: string }): void {
    const errores: Errores = {};

    if (datos.codigo !== undefined && datos.codigo.trim().length === 0) {
      errores.codigo = "Código no puede estar vacío";
    }
    if (datos.recurso !== undefined && datos.recurso.trim().length === 0) {
      errores.recurso = "Recurso no puede estar vacío";
    }
    if (datos.accion !== undefined && datos.accion.trim().length === 0) {
      errores.accion = "Acción no puede estar vacía";
    }

    if (Object.keys(errores).length > 0) {
      throw new ValidationError(JSON.stringify(errores));
    }
  }
}

export const validacionPermiso = new ValidacionPermiso();
