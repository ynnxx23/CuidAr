import { ValidationError } from "../../utils/apiError";

interface Errores {
  [campo: string]: string;
}

export class ValidacionMatricula {
  validarCrear(datos: {
    medicoId: string;
    numeroMatricula: string;
    tipo?: string;
    autoridadEmisora?: string;
    fechaEmision?: string;
    fechaVencimiento?: string;
    archivoUrl?: string;
    especialidadId?: string;
  }): void {
    const errores: Errores = {};

    if (!datos.medicoId) {
      errores.medicoId = "Médico es requerido";
    }
    if (!datos.numeroMatricula) {
      errores.numeroMatricula = "Número de matrícula es requerido";
    } else if (datos.numeroMatricula.length > 100) {
      errores.numeroMatricula = "Número de matrícula debe tener máximo 100 caracteres";
    }
    if (datos.tipo && datos.tipo.length > 50) {
      errores.tipo = "Tipo debe tener máximo 50 caracteres";
    }
    if (datos.autoridadEmisora && datos.autoridadEmisora.length > 200) {
      errores.autoridadEmisora = "Autoridad emisora debe tener máximo 200 caracteres";
    }
    if (datos.archivoUrl && datos.archivoUrl.length > 500) {
      errores.archivoUrl = "URL de archivo debe tener máximo 500 caracteres";
    }
    if (datos.fechaEmision && Number.isNaN(Date.parse(datos.fechaEmision))) {
      errores.fechaEmision = "Fecha de emisión inválida";
    }
    if (datos.fechaVencimiento && Number.isNaN(Date.parse(datos.fechaVencimiento))) {
      errores.fechaVencimiento = "Fecha de vencimiento inválida";
    }

    if (Object.keys(errores).length > 0) {
      throw new ValidationError(JSON.stringify(errores));
    }
  }

  validarActualizar(datos: {
    numeroMatricula?: string;
    tipo?: string;
    autoridadEmisora?: string;
    fechaEmision?: string;
    fechaVencimiento?: string;
    archivoUrl?: string;
    activo?: boolean;
    especialidadId?: string;
  }): void {
    const errores: Errores = {};

    if (datos.numeroMatricula && datos.numeroMatricula.length > 100) {
      errores.numeroMatricula = "Número de matrícula debe tener máximo 100 caracteres";
    }
    if (datos.tipo && datos.tipo.length > 50) {
      errores.tipo = "Tipo debe tener máximo 50 caracteres";
    }
    if (datos.autoridadEmisora && datos.autoridadEmisora.length > 200) {
      errores.autoridadEmisora = "Autoridad emisora debe tener máximo 200 caracteres";
    }
    if (datos.archivoUrl && datos.archivoUrl.length > 500) {
      errores.archivoUrl = "URL de archivo debe tener máximo 500 caracteres";
    }
    if (datos.fechaEmision && Number.isNaN(Date.parse(datos.fechaEmision))) {
      errores.fechaEmision = "Fecha de emisión inválida";
    }
    if (datos.fechaVencimiento && Number.isNaN(Date.parse(datos.fechaVencimiento))) {
      errores.fechaVencimiento = "Fecha de vencimiento inválida";
    }

    if (Object.keys(errores).length > 0) {
      throw new ValidationError(JSON.stringify(errores));
    }
  }
}

export const validacionMatricula = new ValidacionMatricula();
