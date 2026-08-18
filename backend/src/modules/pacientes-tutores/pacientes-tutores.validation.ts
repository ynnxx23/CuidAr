import { ValidationError } from "../../utils/apiError";
import { ESTADOS_AUTORIZACION } from "./pacientes-tutores.constants";

interface Errores {
  [campo: string]: string;
}

export class ValidacionPacienteTutor {
  validarCrear(datos: {
    pacienteId: string;
    tutorUsuarioId: string;
    tipoRelacion: string;
    estadoAutorizacion?: string;
  }): void {
    const errores: Errores = {};

    if (!datos.pacienteId) {
      errores.pacienteId = "Paciente es requerido";
    }
    if (!datos.tutorUsuarioId) {
      errores.tutorUsuarioId = "Tutor es requerido";
    }
    if (!datos.tipoRelacion || datos.tipoRelacion.trim().length === 0) {
      errores.tipoRelacion = "Tipo de relación es requerido";
    } else if (datos.tipoRelacion.length > 80) {
      errores.tipoRelacion = "Tipo de relación debe tener máximo 80 caracteres";
    }
    if (datos.estadoAutorizacion !== undefined && !ESTADOS_AUTORIZACION.includes(datos.estadoAutorizacion as (typeof ESTADOS_AUTORIZACION)[number])) {
      errores.estadoAutorizacion = `Estado de autorización inválido. Valores permitidos: ${ESTADOS_AUTORIZACION.join(", ")}`;
    }

    if (Object.keys(errores).length > 0) {
      throw new ValidationError(JSON.stringify(errores));
    }
  }

  validarActualizar(datos: { tipoRelacion?: string; estadoAutorizacion?: string }): void {
    const errores: Errores = {};

    if (datos.tipoRelacion !== undefined && datos.tipoRelacion.trim().length === 0) {
      errores.tipoRelacion = "Tipo de relación no puede estar vacío";
    }
    if (datos.estadoAutorizacion !== undefined && !ESTADOS_AUTORIZACION.includes(datos.estadoAutorizacion as (typeof ESTADOS_AUTORIZACION)[number])) {
      errores.estadoAutorizacion = `Estado de autorización inválido. Valores permitidos: ${ESTADOS_AUTORIZACION.join(", ")}`;
    }

    if (Object.keys(errores).length > 0) {
      throw new ValidationError(JSON.stringify(errores));
    }
  }
}

export const validacionPacienteTutor = new ValidacionPacienteTutor();
