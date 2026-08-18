import { prisma } from "../../config/prisma";

export class RepositorioEspecialidad {
  listar() {
    return prisma.especialidad.findMany({
      orderBy: { nombre: "asc" },
      include: { especialidadPadre: true },
    });
  }

  buscarPorId(id: string) {
    return prisma.especialidad.findUnique({
      where: { id },
      include: { especialidadPadre: true },
    });
  }

  buscarPorNombre(nombre: string) {
    return prisma.especialidad.findUnique({ where: { nombre } });
  }

  crear(datos: { nombre: string; descripcion?: string; especialidadPadreId?: string }) {
    return prisma.especialidad.create({
      data: {
        nombre: datos.nombre,
        descripcion: datos.descripcion ?? null,
        especialidadPadreId: datos.especialidadPadreId ?? null,
      },
      include: { especialidadPadre: true },
    });
  }

  actualizar(id: string, datos: { nombre?: string; descripcion?: string; especialidadPadreId?: string }) {
    return prisma.especialidad.update({
      where: { id },
      data: {
        nombre: datos.nombre,
        descripcion: datos.descripcion,
        especialidadPadreId: datos.especialidadPadreId,
      },
      include: { especialidadPadre: true },
    });
  }

  eliminar(id: string) {
    return prisma.especialidad.delete({ where: { id } });
  }

  contarSubespecialidades(id: string) {
    return prisma.especialidad.count({ where: { especialidadPadreId: id } });
  }

  contarEspecialidadesMedico(id: string) {
    return prisma.especialidadMedico.count({ where: { especialidadId: id } });
  }

  contarEspecialidadesHospital(id: string) {
    return prisma.especialidadHospital.count({ where: { especialidadId: id } });
  }

  contarMatriculas(id: string) {
    return prisma.matricula.count({ where: { especialidadId: id } });
  }
}

export const repositorioEspecialidad = new RepositorioEspecialidad();
