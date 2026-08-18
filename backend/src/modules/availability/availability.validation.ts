import { ValidationError } from '../../utils/apiError';

const ERRORES = {
  MEDICO_ID_OBLIGATORIO: 'El ID del médico es obligatorio',
  HOSPITAL_ID_OBLIGATORIO: 'El ID del hospital es obligatorio',
  DIA_SEMANA_RANGO: 'El día de la semana debe estar entre 0 (domingo) y 6 (sábado)',
  HORA_INICIO_OBLIGATORIA: 'La hora de inicio es obligatoria',
  HORA_FIN_OBLIGATORIA: 'La hora de fin es obligatoria',
  HORA_FIN_POSTERIOR: 'La hora de fin debe ser posterior a la hora de inicio',
  DURACION_MINIMA: 'La duración del bloque debe ser mayor a 0 minutos',
  FECHA_OBLIGATORIA: 'La fecha es obligatoria',
  TIPO_EXCEPCION_OBLIGATORIO: 'El tipo de excepción es obligatorio',
  TIPO_EXCEPCION_INVALIDO: 'Tipo de excepción no válido',
};

function validarHora(hora: string): boolean {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(hora);
}

export interface CrearReglaDTO {
  medicoId: string;
  hospitalId: string;
  departamentoId?: string;
  diaSemana: number;
  horaInicio: string;
  horaFin: string;
  duracionBloqueMinutos: number;
  minutosDescanso?: number;
}

export interface ActualizarReglaDTO {
  horaInicio?: string;
  horaFin?: string;
  duracionBloqueMinutos?: number;
  minutosDescanso?: number;
  activo?: boolean;
}

export interface CrearExcepcionDTO {
  medicoId: string;
  hospitalId: string;
  fecha: string;
  tipoExcepcion: string;
  horaInicio?: string;
  horaFin?: string;
  mensaje?: string;
}

export function validarCrearRegla(datos: CrearReglaDTO): void {
  if (!datos.medicoId) throw new ValidationError(ERRORES.MEDICO_ID_OBLIGATORIO);
  if (!datos.hospitalId) throw new ValidationError(ERRORES.HOSPITAL_ID_OBLIGATORIO);
  if (datos.diaSemana === undefined || datos.diaSemana < 0 || datos.diaSemana > 6) {
    throw new ValidationError(ERRORES.DIA_SEMANA_RANGO);
  }
  if (!datos.horaInicio || !validarHora(datos.horaInicio)) {
    throw new ValidationError(ERRORES.HORA_INICIO_OBLIGATORIA);
  }
  if (!datos.horaFin || !validarHora(datos.horaFin)) {
    throw new ValidationError(ERRORES.HORA_FIN_OBLIGATORIA);
  }
  if (datos.horaInicio >= datos.horaFin) {
    throw new ValidationError(ERRORES.HORA_FIN_POSTERIOR);
  }
  if (!datos.duracionBloqueMinutos || datos.duracionBloqueMinutos <= 0) {
    throw new ValidationError(ERRORES.DURACION_MINIMA);
  }
}

export function validarActualizarRegla(datos: ActualizarReglaDTO): void {
  if (datos.horaInicio !== undefined && !validarHora(datos.horaInicio)) {
    throw new ValidationError(ERRORES.HORA_INICIO_OBLIGATORIA);
  }
  if (datos.horaFin !== undefined && !validarHora(datos.horaFin)) {
    throw new ValidationError(ERRORES.HORA_FIN_OBLIGATORIA);
  }
  if (datos.horaInicio && datos.horaFin && datos.horaInicio >= datos.horaFin) {
    throw new ValidationError(ERRORES.HORA_FIN_POSTERIOR);
  }
  if (datos.duracionBloqueMinutos !== undefined && datos.duracionBloqueMinutos <= 0) {
    throw new ValidationError(ERRORES.DURACION_MINIMA);
  }
}

export function validarCrearExcepcion(datos: CrearExcepcionDTO): void {
  if (!datos.medicoId) throw new ValidationError(ERRORES.MEDICO_ID_OBLIGATORIO);
  if (!datos.hospitalId) throw new ValidationError(ERRORES.HOSPITAL_ID_OBLIGATORIO);
  if (!datos.fecha) throw new ValidationError(ERRORES.FECHA_OBLIGATORIA);
  if (!datos.tipoExcepcion) throw new ValidationError(ERRORES.TIPO_EXCEPCION_OBLIGATORIO);
}
