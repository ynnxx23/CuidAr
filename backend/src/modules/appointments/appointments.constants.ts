export const AUDIT_ACTION = {
  RESERVAR: 'reservar_turno',
  CONFIRMAR: 'confirmar_turno',
  CHECK_IN: 'check_in_turno',
  FINALIZAR: 'finalizar_turno',
  CANCELAR: 'cancelar_turno',
  REPROGRAMAR: 'reprogramar_turno',
} as const;

export const AUDIT_RESOURCE = {
  TURNO: 'turno',
} as const;
