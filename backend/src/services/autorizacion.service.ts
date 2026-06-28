import { prisma } from "../config/prisma";

export class ServicioAutorizacion {
  async obtenerRoles(usuarioId: string): Promise<string[]> {
    const registros = await prisma.usuarioRol.findMany({
      where: { usuarioId },
      include: { rol: true },
    });
    return registros.map((r) => r.rol.codigo);
  }

  async obtenerPermisos(usuarioId: string): Promise<string[]> {
    const registros = await prisma.usuarioRol.findMany({
      where: { usuarioId },
      include: {
        rol: {
          include: {
            rolesPermisos: {
              include: { permiso: true },
            },
          },
        },
      },
    });

    const codigosPermiso = new Set<string>();
    for (const ur of registros) {
      for (const rp of ur.rol.rolesPermisos) {
        codigosPermiso.add(rp.permiso.codigo);
      }
    }
    return Array.from(codigosPermiso);
  }

  async tieneRol(usuarioId: string, rolesPermitidos: string[]): Promise<boolean> {
    const roles = await this.obtenerRoles(usuarioId);
    return roles.some((r) => rolesPermitidos.includes(r));
  }

  async tienePermiso(usuarioId: string, permisoCodigo: string): Promise<boolean> {
    const permisos = await this.obtenerPermisos(usuarioId);
    return permisos.includes(permisoCodigo);
  }
}

export const servicioAutorizacion = new ServicioAutorizacion();
