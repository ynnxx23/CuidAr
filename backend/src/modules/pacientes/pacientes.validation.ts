import { ValidationError } from "../../utils/apiError";

interface Errores {
  [campo: string]: string;
}

export class ValidacionPaciente {
  validarCrear(datos: {
    usuarioId: string;
    tipoSangre?: string;
    alergias?: string;
    condicionesCronicas?: string;
    medicacionActual?: string;
    contactoEmergenciaNombre?: string;
    contactoEmergenciaTelefono?: string;
    notasMedicas?: string;
  }): void {
    const errores: Errores = {};

    if (!datos.usuarioId) {
      errores.usuarioId = "Usuario es requerido";
    }
    if (datos.tipoSangre && datos.tipoSangre.length > 10) {
      errores.tipoSangre = "Tipo de sangre debe tener máximo 10 caracteres";
    }
    if (datos.contactoEmergenciaNombre && datos.contactoEmergenciaNombre.length > 100) {
      errores.contactoEmergenciaNombre = "Nombre de contacto de emergencia debe tener máximo 100 caracteres";
    }
    if (datos.contactoEmergenciaTelefono && datos.contactoEmergenciaTelefono.length > 30) {
      errores.contactoEmergenciaTelefono = "Teléfono de contacto debe tener máximo 30 caracteres";
    }

    if (Object.keys(errores).length > 0) {
      throw new ValidationError(JSON.stringify(errores));
    }
  }

  validarActualizar(datos: {
    tipoSangre?: string;
    alergias?: string;
    condicionesCronicas?: string;
    medicacionActual?: string;
    contactoEmergenciaNombre?: string;
    contactoEmergenciaTelefono?: string;
    notasMedicas?: string;
  }): void {
    const errores: Errores = {};

    if (datos.tipoSangre && datos.tipoSangre.length > 10) {
      errores.tipoSangre = "Tipo de sangre debe tener máximo 10 caracteres";
    }
    if (datos.contactoEmergenciaNombre && datos.contactoEmergenciaNombre.length > 100) {
      errores.contactoEmergenciaNombre = "Nombre de contacto de emergencia debe tener máximo 100 caracteres";
    }
    if (datos.contactoEmergenciaTelefono && datos.contactoEmergenciaTelefono.length > 30) {
      errores.contactoEmergenciaTelefono = "Teléfono de contacto debe tener máximo 30 caracteres";
    }

    if (Object.keys(errores).length > 0) {
      throw new ValidationError(JSON.stringify(errores));
    }
  }
}

export const validacionPaciente = new ValidacionPaciente();
