import { ValidationError } from "../../utils/apiError";
import { TIPOS_HOSPITAL } from "./hospitales.constants";

interface Errores {
  [campo: string]: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class ValidacionHospital {
  private validarCampos(datos: {
    nombre?: string;
    tipoHospital?: string;
    codigoInterno?: string;
    correoElectronico?: string;
    telefono?: string;
  }): Errores {
    const errores: Errores = {};

    if (datos.nombre !== undefined && datos.nombre.trim().length === 0) {
      errores.nombre = "Nombre no puede estar vacío";
    } else if (datos.nombre && datos.nombre.length > 200) {
      errores.nombre = "Nombre debe tener máximo 200 caracteres";
    }

    if (datos.tipoHospital !== undefined && !TIPOS_HOSPITAL.includes(datos.tipoHospital as (typeof TIPOS_HOSPITAL)[number])) {
      errores.tipoHospital = `Tipo de hospital inválido. Valores permitidos: ${TIPOS_HOSPITAL.join(", ")}`;
    }

    if (datos.codigoInterno !== undefined && datos.codigoInterno.length > 50) {
      errores.codigoInterno = "Código interno debe tener máximo 50 caracteres";
    }

    if (datos.correoElectronico && !EMAIL_REGEX.test(datos.correoElectronico)) {
      errores.correoElectronico = "Correo electrónico no válido";
    }

    if (datos.telefono !== undefined && datos.telefono.length > 30) {
      errores.telefono = "Teléfono debe tener máximo 30 caracteres";
    }

    return errores;
  }

  validarCrear(datos: {
    nombre: string;
    tipoHospital: string;
    provinciaId: string;
    localidadId: string;
    codigoInterno?: string;
    correoElectronico?: string;
    telefono?: string;
    direccion?: string;
    barrioId?: string;
    areaMedicaId?: string;
  }): void {
    const errores = this.validarCampos(datos);

    if (!datos.nombre || datos.nombre.trim().length === 0) {
      errores.nombre = "Nombre es requerido";
    }
    if (!datos.tipoHospital) {
      errores.tipoHospital = "Tipo de hospital es requerido";
    }
    if (!datos.provinciaId) {
      errores.provinciaId = "Provincia es requerida";
    }
    if (!datos.localidadId) {
      errores.localidadId = "Localidad es requerida";
    }

    if (Object.keys(errores).length > 0) {
      throw new ValidationError(JSON.stringify(errores));
    }
  }

  validarActualizar(datos: {
    nombre?: string;
    tipoHospital?: string;
    provinciaId?: string;
    localidadId?: string;
    codigoInterno?: string;
    correoElectronico?: string;
    telefono?: string;
    direccion?: string;
    barrioId?: string;
    areaMedicaId?: string;
  }): void {
    const errores = this.validarCampos(datos);

    if (Object.keys(errores).length > 0) {
      throw new ValidationError(JSON.stringify(errores));
    }
  }
}

export const validacionHospital = new ValidacionHospital();
