import { ValidationError } from "../../utils/apiError";

interface Errores {
  [campo: string]: string;
}

export class ValidacionMedicoEspecialidad {
  validarCrear(datos: { medicoId: string; especialidadId: string; principal?: boolean }): void {
    const errores: Errores = {};

    if (!datos.medicoId) {
      errores.medicoId = "Médico es requerido";
    }
    if (!datos.especialidadId) {
      errores.especialidadId = "Especialidad es requerida";
    }
    if (datos.principal !== undefined && typeof datos.principal !== "boolean") {
      errores.principal = "Principal debe ser un booleano";
    }

    if (Object.keys(errores).length > 0) {
      throw new ValidationError(JSON.stringify(errores));
    }
  }

  validarActualizar(datos: { principal?: boolean }): void {
    const errores: Errores = {};

    if (datos.principal !== undefined && typeof datos.principal !== "boolean") {
      errores.principal = "Principal debe ser un booleano";
    }

    if (Object.keys(errores).length > 0) {
      throw new ValidationError(JSON.stringify(errores));
    }
  }
}

export const validacionMedicoEspecialidad = new ValidacionMedicoEspecialidad();
