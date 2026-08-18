export const AUDIT_ACTION = {
  CREAR_REGLA: 'crear_regla_disponibilidad',
  ACTUALIZAR_REGLA: 'actualizar_regla_disponibilidad',
  ELIMINAR_REGLA: 'eliminar_regla_disponibilidad',
  CREAR_EXCEPCION: 'crear_excepcion_disponibilidad',
  ELIMINAR_EXCEPCION: 'eliminar_excepcion_disponibilidad',
} as const;

export const AUDIT_RESOURCE = {
  REGLA_DISPONIBILIDAD: 'regla_disponibilidad',
  EXCEPCION_DISPONIBILIDAD: 'excepcion_disponibilidad',
} as const;

export const TIPOS_EXCEPCION = [
  'feriado',
  'licencia',
  'ausencia',
  'retraso',
  'bloqueo',
  'turno_especial',
] as const;
