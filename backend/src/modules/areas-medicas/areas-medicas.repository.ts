import { prisma } from "../../config/prisma";

export class RepositorioAreaMedica {
  listar() {
    return prisma.areaMedica.findMany({
      orderBy: { nombre: "asc" },
    });
  }

  buscarPorId(id: string) {
    return prisma.areaMedica.findUnique({ where: { id } });
  }

  buscarPorNombre(nombre: string) {
    return prisma.areaMedica.findUnique({ where: { nombre } });
  }

  crear(datos: { nombre: string; descripcion?: string }) {
    return prisma.areaMedica.create({
      data: {
        nombre: datos.nombre,
        descripcion: datos.descripcion ?? null,
      },
    });
  }

  actualizar(id: string, datos: { nombre?: string; descripcion?: string }) {
    return prisma.areaMedica.update({
      where: { id },
      data: {
        nombre: datos.nombre,
        descripcion: datos.descripcion,
      },
    });
  }

  eliminar(id: string) {
    return prisma.areaMedica.delete({ where: { id } });
  }

  contarHospitales(id: string) {
    return prisma.hospital.count({ where: { areaMedicaId: id } });
  }

  contarConsultorios(id: string) {
    return prisma.consultorio.count({ where: { areaMedicaId: id } });
  }
}

export const repositorioAreaMedica = new RepositorioAreaMedica();
