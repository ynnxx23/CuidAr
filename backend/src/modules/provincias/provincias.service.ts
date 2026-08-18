import { repositorioProvincia } from "./provincias.repository";
import { ConflictError, NotFoundError } from "../../utils/apiError";

export class ServicioProvincia {
  listar(paisId?: string) {
    return repositorioProvincia.listar(paisId);
  }

  async buscarPorId(id: string) {
    const provincia = await repositorioProvincia.buscarPorId(id);
    if (!provincia) {
      throw new NotFoundError("Provincia no encontrada");
    }
    return provincia;
  }

  async crear(datos: { paisId: string; nombre: string; codigoIso?: string }) {
    const pais = await repositorioProvincia.buscarPais(datos.paisId);
    if (!pais) {
      throw new NotFoundError("País no encontrado");
    }

    const existente = await repositorioProvincia.buscarPorPaisYNombre(datos.paisId, datos.nombre);
    if (existente) {
      throw new ConflictError("La provincia ya existe en este país");
    }
    if (datos.codigoIso) {
      const existenteIso = await repositorioProvincia.buscarPorCodigoIso(datos.codigoIso);
      if (existenteIso) {
        throw new ConflictError("El código ISO ya está en uso");
      }
    }
    return repositorioProvincia.crear(datos);
  }

  async actualizar(id: string, datos: { paisId?: string; nombre?: string; codigoIso?: string }) {
    const provincia = await repositorioProvincia.buscarPorId(id);
    if (!provincia) {
      throw new NotFoundError("Provincia no encontrada");
    }

    if (datos.paisId) {
      const pais = await repositorioProvincia.buscarPais(datos.paisId);
      if (!pais) {
        throw new NotFoundError("País no encontrado");
      }
    }

    const paisIdNuevo = datos.paisId ?? provincia.paisId;
    const nombreNuevo = datos.nombre ?? provincia.nombre;
    if (nombreNuevo !== provincia.nombre || paisIdNuevo !== provincia.paisId) {
      const existente = await repositorioProvincia.buscarPorPaisYNombre(paisIdNuevo, nombreNuevo);
      if (existente && existente.id !== id) {
        throw new ConflictError("La provincia ya existe en este país");
      }
    }
    if (datos.codigoIso && datos.codigoIso !== provincia.codigoIso) {
      const existenteIso = await repositorioProvincia.buscarPorCodigoIso(datos.codigoIso);
      if (existenteIso) {
        throw new ConflictError("El código ISO ya está en uso");
      }
    }

    return repositorioProvincia.actualizar(id, datos);
  }

  async eliminar(id: string) {
    const provincia = await repositorioProvincia.buscarPorId(id);
    if (!provincia) {
      throw new NotFoundError("Provincia no encontrada");
    }
    const localidades = await repositorioProvincia.contarLocalidades(id);
    if (localidades > 0) {
      throw new ConflictError("No se puede eliminar una provincia con localidades asociadas");
    }
    return repositorioProvincia.eliminar(id);
  }
}

export const servicioProvincia = new ServicioProvincia();
