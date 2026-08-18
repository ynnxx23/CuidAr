import { prisma } from "../config/prisma";
import { Prisma } from "../generated/prisma/client";

export interface DatosAuditoria {
  actorUsuarioId?: string | null;
  accion: string;
  tipoRecurso: string;
  recursoId?: string | null;
  metadatos?: Record<string, unknown> | null;
  direccionIp?: string | null;
  agenteUsuario?: string | null;
}

export class ServicioAuditoria {
  async registrar(datos: DatosAuditoria): Promise<void> {
    await prisma.registroAuditoria.create({
      data: {
        actorUsuarioId: datos.actorUsuarioId ?? null,
        accion: datos.accion,
        tipoRecurso: datos.tipoRecurso,
        recursoId: datos.recursoId ?? null,
        metadatos: datos.metadatos as Prisma.InputJsonValue | undefined,
        direccionIp: datos.direccionIp ?? null,
        agenteUsuario: datos.agenteUsuario ?? null,
      },
    });
  }
}

export const servicioAuditoria = new ServicioAuditoria();
