export const RUTA_PACIENTES_TUTORES = "/pacientes-tutores";

export const ESTADOS_AUTORIZACION = ["pendiente", "verificado", "rechazado", "expirado"] as const;

export const PERMISOS_PACIENTE_TUTOR = {
  VER: "pacientes_tutores:view",
  CREAR: "pacientes_tutores:create",
  EDITAR: "pacientes_tutores:edit",
  ELIMINAR: "pacientes_tutores:delete",
} as const;
