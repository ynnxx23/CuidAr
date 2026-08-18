import { ValidationError } from "../../utils/apiError";

interface Errores {
  [campo: string]: string;
}

export class ValidacionConsultorio {
  validarCrear(datos: {
    hospitalId: string;
    nombre: string;
    departamentoId?: string;
    areaMedicaId?: string;
    codigoConsultorio?: string;
  }): void {
    const errores: Errores = {};

    if (!datos.hospitalId) {
      errores.hospitalId = "Hospital es requerido";
    }
    if (!datos.nombre || datos.nombre.trim().length === 0) {
      errores.nombre = "Nombre es requerido";
    } else if (datos.nombre.length > 100) {
      errores.nombre = "Nombre debe tener máximo 100 caracteres";
    }
    if (datos.codigoConsultorio !== undefined && datos.codigoConsultorio.length > 30) {
      errores.codigoConsultorio = "Código de consultorio debe tener máximo 30 caracteres";
    }

    if (Object.keys(errores).length > 0) {
      throw new ValidationError(JSON.stringify(errores));
    }
  }

  validarActualizar(datos: {
    nombre?: string;
    departamentoId?: string;
    areaMedicaId?: string;
    codigoConsultorio?: string;
  }): void {
    const errores: Errores = {};

    if (datos.nombre !== undefined && datos.nombre.trim().length === 0) {
      errores.nombre = "Nombre no puede estar vacío";
    }
    if (datos.codigoConsultorio !== undefined && datos.codigoConsultorio.length > 30) {
      errores.codigoConsultorio = "Código de consultorio debe tener máximo 30 caracteres";
    }

    if (Object.keys(errores).length > 0) {
      throw new ValidationError(JSON.stringify(errores));
    }
  }
}

export const validacionConsultorio = new ValidacionConsultorio();
