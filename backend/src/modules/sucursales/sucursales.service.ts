import { repositorioSucursal } from "./sucursales.repository";
import { ConflictError, NotFoundError } from "../../utils/apiError";

export class ServicioSucursal {
  listar(hospitalId?: string) {
    return repositorioSucursal.listar(hospitalId);
  }

  async buscarPorId(id: string) {
    const sucursal = await repositorioSucursal.buscarPorId(id);
    if (!sucursal) {
      throw new NotFoundError("Sucursal no encontrada");
    }
    return sucursal;
  }

  async crear(datos: {
    hospitalId: string;
    nombre: string;
    direccion?: string;
    telefono?: string;
    correoElectronico?: string;
  }) {
    const hospital = await repositorioSucursal.buscarHospital(datos.hospitalId);
    if (!hospital) {
      throw new NotFoundError("Hospital no encontrado");
    }
    const existente = await repositorioSucursal.buscarPorHospitalYNombre(datos.hospitalId, datos.nombre);
    if (existente) {
      throw new ConflictError("Ya existe una sucursal con ese nombre en el hospital");
    }
    return repositorioSucursal.crear(datos);
  }

  async actualizar(id: string, datos: {
    nombre?: string;
    direccion?: string;
    telefono?: string;
    correoElectronico?: string;
  }) {
    const sucursal = await repositorioSucursal.buscarPorId(id);
    if (!sucursal) {
      throw new NotFoundError("Sucursal no encontrada");
    }
    if (datos.nombre && datos.nombre !== sucursal.nombre) {
      const existente = await repositorioSucursal.buscarPorHospitalYNombre(sucursal.hospitalId, datos.nombre);
      if (existente) {
        throw new ConflictError("Ya existe una sucursal con ese nombre en el hospital");
      }
    }
    return repositorioSucursal.actualizar(id, datos);
  }

  async eliminar(id: string) {
    const sucursal = await repositorioSucursal.buscarPorId(id);
    if (!sucursal) {
      throw new NotFoundError("Sucursal no encontrada");
    }
    return repositorioSucursal.eliminar(id);
  }
}

export const servicioSucursal = new ServicioSucursal();
