export const AUDIT_ACTION = {
  GENERAR_SLOTS: 'generar_slots',
  REGENERAR_SLOTS: 'regenerar_slots',
  BLOQUEAR_SLOT: 'bloquear_slot',
  DESBLOQUEAR_SLOT: 'desbloquear_slot',
} as const;

export const AUDIT_RESOURCE = {
  SLOT: 'slot',
} as const;

export interface SlotGenerado {
  medicoId: string;
  hospitalId: string;
  departamentoId: string | null;
  especialidadId: string;
  reglaDisponibilidadId: string;
  fechaBloque: Date;
  horaInicio: Date;
  horaFin: Date;
}
