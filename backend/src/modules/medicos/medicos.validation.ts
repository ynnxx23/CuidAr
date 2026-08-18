import { ValidationError } from "../../utils/apiError";
import { ESTADOS_LABORALES } from "./medicos.constants";

interface Errores {
  [campo: string]: string;
}

export class ValidacionMedico {
  validarCrear(datos: { usuarioId: string; numeroMatricula: string; biografia?: string; estadoLaboral?: string; notas?: string }): void {
    const errores: Errores = {};

    if (!datos.usuarioId) {
      errores.usuarioId = "Usuario es requerido";
    }
    if (!datos.numeroMatricula) {
      errores.numeroMatricula = "Número de matrícula es requerido";
    } else if (datos.numeroMatricula.length > 100) {
      errores.numeroMatricula = "Número de matrícula debe tener máximo 100 caracteres";
    }
    if (datos.biografia && datos.biografia.length > 2000) {
      errores.biografia = "Biografía debe tener máximo 2000 caracteres";
    }
    if (datos.estadoLaboral && !ESTADOS_LABORALES.includes(datos.estadoLaboral as (typeof ESTADOS_LABORALES)[number])) {
      errores.estadoLaboral = `Estado laboral inválido. Valores permitidos: ${ESTADOS_LABORALES.join(", ")}`;
    }

    if (Object.keys(errores).length > 0) {
      throw new ValidationError(JSON.stringify(errores));
    }
  }

  validarActualizar(datos: { numeroMatricula?: string; biografia?: string; estadoLaboral?: string; notas?: string }): void {
    const errores: Errores = {};

    if (datos.numeroMatricula && datos.numeroMatricula.length > 100) {
      errores.numeroMatricula = "Número de matrícula debe tener máximo 100 caracteres";
    }
    if (datos.biografia && datos.biografia.length > 2000) {
      errores.biografia = "Biografía debe tener máximo 2000 caracteres";
    }
    if (datos.estadoLaboral && !ESTADOS_LABORALES.includes(datos.estadoLaboral as (typeof ESTADOS_LABORALES)[number])) {
      errores.estadoLaboral = `Estado laboral inválido. Valores permitidos: ${ESTADOS_LABORALES.join(", ")}`;
    }

    if (Object.keys(errores).length > 0) {
      throw new ValidationError(JSON.stringify(errores));
    }
  }
}

export const validacionMedico = new ValidacionMedico();
