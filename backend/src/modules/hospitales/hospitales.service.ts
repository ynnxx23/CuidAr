import { repositorioHospital } from "./hospitales.repository";
import { ConflictError, NotFoundError } from "../../utils/apiError";

export class ServicioHospital {
  listar(provinciaId?: string, estado?: string) {
    return repositorioHospital.listar(provinciaId, estado);
  }

  async buscarPorId(id: string) {
    const hospital = await repositorioHospital.buscarPorId(id);
    if (!hospital) {
      throw new NotFoundError("Hospital no encontrado");
    }
    return hospital;
  }

  async crear(datos: {
    nombre: string;
    tipoHospital: string;
    provinciaId: string;
    localidadId: string;
    codigoInterno?: string;
    correoElectronico?: string;
    telefono?: string;
    direccion?: string;
    barrioId?: string;
    areaMedicaId?: string;
  }) {
    await this.validarUbicacion(datos.provinciaId, datos.localidadId, datos.barrioId);
    if (datos.areaMedicaId) {
      const areaMedica = await repositorioHospital.buscarAreaMedica(datos.areaMedicaId);
      if (!areaMedica) {
        throw new NotFoundError("Área médica no encontrada");
      }
    }
    if (datos.codigoInterno) {
      const existente = await repositorioHospital.buscarPorCodigoInterno(datos.codigoInterno);
      if (existente) {
        throw new ConflictError("El código interno ya está en uso");
      }
    }
    return repositorioHospital.crear(datos);
  }

  async actualizar(id: string, datos: {
    nombre?: string;
    tipoHospital?: string;
    provinciaId?: string;
    localidadId?: string;
    codigoInterno?: string;
    correoElectronico?: string;
    telefono?: string;
    direccion?: string;
    barrioId?: string;
    areaMedicaId?: string;
  }) {
    const hospital = await repositorioHospital.buscarPorId(id);
    if (!hospital) {
      throw new NotFoundError("Hospital no encontrado");
    }

    const provinciaId = datos.provinciaId ?? hospital.provinciaId;
    const localidadId = datos.localidadId ?? hospital.localidadId;
    const barrioId = datos.barrioId !== undefined ? datos.barrioId : hospital.barrioId;
    await this.validarUbicacion(provinciaId, localidadId, barrioId ?? undefined);

    if (datos.areaMedicaId) {
      const areaMedica = await repositorioHospital.buscarAreaMedica(datos.areaMedicaId);
      if (!areaMedica) {
        throw new NotFoundError("Área médica no encontrada");
      }
    }

    if (datos.codigoInterno && datos.codigoInterno !== hospital.codigoInterno) {
      const existente = await repositorioHospital.buscarPorCodigoInterno(datos.codigoInterno);
      if (existente) {
        throw new ConflictError("El código interno ya está en uso");
      }
    }

    return repositorioHospital.actualizar(id, datos);
  }

  async eliminar(id: string) {
    const hospital = await repositorioHospital.buscarPorId(id);
    if (!hospital) {
      throw new NotFoundError("Hospital no encontrado");
    }
    return repositorioHospital.eliminar(id);
  }

  private async validarUbicacion(provinciaId: string, localidadId: string, barrioId?: string) {
    const provincia = await repositorioHospital.buscarProvincia(provinciaId);
    if (!provincia) {
      throw new NotFoundError("Provincia no encontrada");
    }
    const localidad = await repositorioHospital.buscarLocalidad(localidadId);
    if (!localidad) {
      throw new NotFoundError("Localidad no encontrada");
    }
    if (localidad.provinciaId !== provincia.id) {
      throw new ConflictError("La localidad no pertenece a la provincia indicada");
    }
    if (barrioId) {
      const barrio = await repositorioHospital.buscarBarrio(barrioId);
      if (!barrio) {
        throw new NotFoundError("Barrio no encontrado");
      }
      if (barrio.localidadId !== localidad.id) {
        throw new ConflictError("El barrio no pertenece a la localidad indicada");
      }
    }
  }
}

export const servicioHospital = new ServicioHospital();
