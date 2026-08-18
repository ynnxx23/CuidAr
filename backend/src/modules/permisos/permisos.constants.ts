export const RECURSOS = {
  USERS: "users",
  ROLES: "roles",
  PATIENTS: "patients",
  APPOINTMENTS: "appointments",
  MEDICAL_RECORDS: "medical_records",
  HOSPITALS: "hospitals",
  STATISTICS: "statistics",
  AUDIT_LOGS: "audit_logs",
} as const;

export const ACCIONES = {
  VIEW: "view",
  CREATE: "create",
  EDIT: "edit",
  DELETE: "delete",
  ASSIGN: "assign",
  CANCEL: "cancel",
  RESCHEDULE: "reschedule",
  MANAGE: "manage",
} as const;

export const RUTA_PERMISOS = "/permisos";
