import { ValidationError } from '../../utils/apiError';

const ERRORES = {
  SLOT_ID_OBLIGATORIO: 'El ID del slot es obligatorio',
  ESPECIALIDAD_ID_OBLIGATORIA: 'El ID de la especialidad es obligatorio',
  MODO_OBLIGATORIO: 'El modo del turno es obligatorio',
  MODO_INVALIDO: 'Modo de turno no válido',
  MOTIVO_CANCELACION_OBLIGATORIO: 'El motivo de cancelación es obligatorio',
};

export interface ReservarTurnoDTO {
  slotId: string;
  pacienteId?: string;
  especialidadId: string;
  consultorioId?: string;
  modo: string;
  motivo?: string;
  notas?: string;
}

export interface ReprogramarTurnoDTO {
  nuevoSlotId: string;
  motivo?: string;
}

export interface CancelarTurnoDTO {
  motivo: string;
}

export function validarReservarTurno(datos: ReservarTurnoDTO): void {
  if (!datos.slotId) throw new ValidationError(ERRORES.SLOT_ID_OBLIGATORIO);
  if (!datos.especialidadId) throw new ValidationError(ERRORES.ESPECIALIDAD_ID_OBLIGATORIA);
  if (!datos.modo) throw new ValidationError(ERRORES.MODO_OBLIGATORIO);
  const modosValidos = ['presencial', 'virtual', 'seguimiento', 'emergencia'];
  if (!modosValidos.includes(datos.modo)) throw new ValidationError(ERRORES.MODO_INVALIDO);
}

export function validarReprogramarTurno(datos: ReprogramarTurnoDTO): void {
  if (!datos.nuevoSlotId) throw new ValidationError('El ID del nuevo slot es obligatorio');
}

export function validarCancelarTurno(datos: CancelarTurnoDTO): void {
  if (!datos.motivo) throw new ValidationError(ERRORES.MOTIVO_CANCELACION_OBLIGATORIO);
}
