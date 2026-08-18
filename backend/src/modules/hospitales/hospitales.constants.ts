export const RUTA_HOSPITALES = "/hospitales";

export const TIPOS_HOSPITAL = ["publico", "privado", "clinica", "centroSalud", "laboratorio", "otro"] as const;

export const PERMISOS_HOSPITAL = {
  VER: "hospitals:view",
  CREAR: "hospitals:create",
  EDITAR: "hospitals:edit",
  GESTIONAR: "hospitals:manage",
} as const;
