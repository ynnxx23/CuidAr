import { ValidationError } from "../../utils/apiError";

interface Errores {
  [campo: string]: string;
}

export class ValidacionMedicoHospital {
  validarCrear(datos: { medicoId: string; hospitalId: string; departamentoId?: string; activo?: boolean }): void {
    const errores: Errores = {};

    if (!datos.medicoId) {
      errores.medicoId = "Médico es requerido";
    }
    if (!datos.hospitalId) {
      errores.hospitalId = "Hospital es requerido";
    }
    if (datos.activo !== undefined && typeof datos.activo !== "boolean") {
      errores.activo = "Activo debe ser un booleano";
    }

    if (Object.keys(errores).length > 0) {
      throw new ValidationError(JSON.stringify(errores));
    }
  }

  validarActualizar(datos: { activo?: boolean }): void {
    const errores: Errores = {};

    if (datos.activo !== undefined && typeof datos.activo !== "boolean") {
      errores.activo = "Activo debe ser un booleano";
    }

    if (Object.keys(errores).length > 0) {
      throw new ValidationError(JSON.stringify(errores));
    }
  }
}

export const validacionMedicoHospital = new ValidacionMedicoHospital();
