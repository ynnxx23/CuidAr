import { repositorioPais } from "./paises.repository";
import { ConflictError, NotFoundError } from "../../utils/apiError";

export class ServicioPais {
  listar(incluirProvincias?: boolean) {
    return repositorioPais.listar(incluirProvincias);
  }

  async buscarPorId(id: string) {
    const pais = await repositorioPais.buscarPorId(id);
    if (!pais) {
      throw new NotFoundError("País no encontrado");
    }
    return pais;
  }

  async crear(datos: { nombre: string; codigoIso?: string }) {
    const existenteNombre = await repositorioPais.buscarPorNombre(datos.nombre);
    if (existenteNombre) {
      throw new ConflictError("El nombre del país ya existe");
    }
    if (datos.codigoIso) {
      const existenteIso = await repositorioPais.buscarPorCodigoIso(datos.codigoIso);
      if (existenteIso) {
        throw new ConflictError("El código ISO ya está en uso");
      }
    }
    return repositorioPais.crear(datos);
  }

  async actualizar(id: string, datos: { nombre?: string; codigoIso?: string }) {
    const pais = await repositorioPais.buscarPorId(id);
    if (!pais) {
      throw new NotFoundError("País no encontrado");
    }

    if (datos.nombre && datos.nombre !== pais.nombre) {
      const existente = await repositorioPais.buscarPorNombre(datos.nombre);
      if (existente) {
        throw new ConflictError("El nombre del país ya existe");
      }
    }
    if (datos.codigoIso && datos.codigoIso !== pais.codigoIso) {
      const existenteIso = await repositorioPais.buscarPorCodigoIso(datos.codigoIso);
      if (existenteIso) {
        throw new ConflictError("El código ISO ya está en uso");
      }
    }

    return repositorioPais.actualizar(id, datos);
  }

  async eliminar(id: string) {
    const pais = await repositorioPais.buscarPorId(id);
    if (!pais) {
      throw new NotFoundError("País no encontrado");
    }
    const provincias = await repositorioPais.contarProvincias(id);
    if (provincias > 0) {
      throw new ConflictError("No se puede eliminar un país con provincias asociadas");
    }
    return repositorioPais.eliminar(id);
  }
}

export const servicioPais = new ServicioPais();
