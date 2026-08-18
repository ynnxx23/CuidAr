export const RUTA_MEDICOS = "/medicos";

export const PERMISOS_MEDICO = {
  VER: "medicos:ver",
  CREAR: "medicos:crear",
  EDITAR: "medicos:editar",
  ELIMINAR: "medicos:eliminar",
} as const;

export const ESTADOS_LABORALES = [
  "disponible",
  "atendiendo",
  "retrasado",
  "ausente",
  "fueraServicio",
  "noDisponible",
] as const;
