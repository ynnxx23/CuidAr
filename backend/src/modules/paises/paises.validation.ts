import { ValidationError } from "../../utils/apiError";

interface Errores {
  [campo: string]: string;
}

export class ValidacionPais {
  validarCrear(datos: { nombre: string; codigoIso?: string }): void {
    const errores: Errores = {};

    if (!datos.nombre || datos.nombre.trim().length === 0) {
      errores.nombre = "Nombre es requerido";
    } else if (datos.nombre.length > 100) {
      errores.nombre = "Nombre debe tener máximo 100 caracteres";
    }
    if (datos.codigoIso !== undefined && datos.codigoIso.trim().length === 0) {
      errores.codigoIso = "Código ISO no puede estar vacío";
    } else if (datos.codigoIso !== undefined && datos.codigoIso.length > 10) {
      errores.codigoIso = "Código ISO debe tener máximo 10 caracteres";
    }

    if (Object.keys(errores).length > 0) {
      throw new ValidationError(JSON.stringify(errores));
    }
  }

  validarActualizar(datos: { nombre?: string; codigoIso?: string }): void {
    const errores: Errores = {};

    if (datos.nombre !== undefined && datos.nombre.trim().length === 0) {
      errores.nombre = "Nombre no puede estar vacío";
    }
    if (datos.codigoIso !== undefined && datos.codigoIso.trim().length === 0) {
      errores.codigoIso = "Código ISO no puede estar vacío";
    }

    if (Object.keys(errores).length > 0) {
      throw new ValidationError(JSON.stringify(errores));
    }
  }
}

export const validacionPais = new ValidacionPais();
