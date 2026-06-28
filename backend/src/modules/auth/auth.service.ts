import bcrypt from "bcryptjs";
import crypto from "crypto";
import { repositorioAuth } from "./auth.repository";
import { servicioToken } from "../../services/token.service";
import { ConflictError, UnauthorizedError, NotFoundError } from "../../utils/apiError";

export class ServicioAuth {
  private hashContrasena(contrasena: string): string {
    return bcrypt.hashSync(contrasena, 10);
  }

  private compararContrasena(contrasena: string, hash: string): boolean {
    return bcrypt.compareSync(contrasena, hash);
  }

  private hashSha256(valor: string): string {
    return crypto.createHash("sha256").update(valor).digest("hex");
  }

  private extraerInfoDispositivo(agenteUsuario?: string, direccionIp?: string) {
    return {
      nombreDispositivo: agenteUsuario?.substring(0, 100) ?? undefined,
      soDispositivo: undefined as string | undefined,
      modeloDispositivo: undefined as string | undefined,
      nombreNavegador: undefined as string | undefined,
      direccionIp: direccionIp ?? undefined,
    };
  }

  async registrar(datos: {
    dni: string;
    correoElectronico: string;
    contrasena: string;
    nombre: string;
    apellido: string;
    telefono?: string;
    fechaNacimiento?: string;
    genero?: string;
  }) {
    const existeCorreo = await repositorioAuth.buscarPorCorreo(datos.correoElectronico);
    if (existeCorreo) {
      throw new ConflictError("El correo electrónico ya está registrado");
    }

    const existeDni = await repositorioAuth.buscarPorDni(datos.dni);
    if (existeDni) {
      throw new ConflictError("El DNI ya está registrado");
    }

    const hash = this.hashContrasena(datos.contrasena);

    const usuario = await repositorioAuth.crearUsuario({
      dni: datos.dni,
      correoElectronico: datos.correoElectronico,
      hashContrasena: hash,
      nombre: datos.nombre,
      apellido: datos.apellido,
      telefono: datos.telefono ?? undefined,
      fechaNacimiento: datos.fechaNacimiento ? new Date(datos.fechaNacimiento) : undefined,
      genero: datos.genero ?? undefined,
    });

    return {
      id: usuario.id,
      correoElectronico: usuario.correoElectronico,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      dni: usuario.dni,
    };
  }

  async iniciarSesion(
    correoElectronico: string,
    contrasena: string,
    agenteUsuario?: string,
    direccionIp?: string,
  ) {
    const usuario = await repositorioAuth.buscarPorCorreo(correoElectronico);
    if (!usuario) {
      throw new UnauthorizedError("Credenciales inválidas");
    }

    if (usuario.eliminadoEn || usuario.estado === "suspendido") {
      throw new UnauthorizedError("Cuenta desactivada o suspendida");
    }

    if (!this.compararContrasena(contrasena, usuario.hashContrasena)) {
      throw new UnauthorizedError("Credenciales inválidas");
    }

    const payload = { usuarioId: usuario.id, correoElectronico: usuario.correoElectronico };
    const tokenAcceso = servicioToken.generarTokenAcceso(payload);
    const tokenActualizacion = servicioToken.generarTokenActualizacion(payload);

    const hashActualizacion = this.hashSha256(tokenActualizacion);
    const infoDispositivo = this.extraerInfoDispositivo(agenteUsuario, direccionIp);

    await repositorioAuth.crearSesion({
      usuarioId: usuario.id,
      hashTokenActualizacion: hashActualizacion,
      ...infoDispositivo,
    });

    const roles = usuario.usuariosRoles.map((ur) => ({
      codigo: ur.rol.codigo,
      nombre: ur.rol.nombre,
    }));

    return {
      tokenAcceso,
      tokenActualizacion,
      usuario: {
        id: usuario.id,
        correoElectronico: usuario.correoElectronico,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        dni: usuario.dni,
        estado: usuario.estado,
        roles,
      },
    };
  }

  async refrescarToken(tokenActualizacion: string) {
    let payload;
    try {
      payload = servicioToken.verificarTokenActualizacion(tokenActualizacion);
    } catch {
      throw new UnauthorizedError("Token de actualización inválido o expirado");
    }

    const hash = this.hashSha256(tokenActualizacion);
    const sesion = await repositorioAuth.buscarSesionPorHash(hash);

    if (!sesion || sesion.usuarioId !== payload.usuarioId) {
      throw new UnauthorizedError("Sesión no encontrada o cerrada");
    }

    const usuario = await repositorioAuth.buscarPorId(payload.usuarioId);
    if (!usuario || usuario.eliminadoEn) {
      throw new UnauthorizedError("Usuario no encontrado");
    }

    const nuevoPayload = { usuarioId: usuario.id, correoElectronico: usuario.correoElectronico };
    const nuevoTokenAcceso = servicioToken.generarTokenAcceso(nuevoPayload);
    const nuevoTokenActualizacion = servicioToken.generarTokenActualizacion(nuevoPayload);

    const nuevoHash = this.hashSha256(nuevoTokenActualizacion);
    await repositorioAuth.desactivarSesion(sesion.id);
    await repositorioAuth.crearSesion({
      usuarioId: usuario.id,
      hashTokenActualizacion: nuevoHash,
      nombreDispositivo: sesion.nombreDispositivo ?? undefined,
      soDispositivo: sesion.soDispositivo ?? undefined,
      modeloDispositivo: sesion.modeloDispositivo ?? undefined,
      nombreNavegador: sesion.nombreNavegador ?? undefined,
      direccionIp: sesion.direccionIp ?? undefined,
    });

    const roles = usuario.usuariosRoles.map((ur) => ({
      codigo: ur.rol.codigo,
      nombre: ur.rol.nombre,
    }));

    return {
      tokenAcceso: nuevoTokenAcceso,
      tokenActualizacion: nuevoTokenActualizacion,
      usuario: {
        id: usuario.id,
        correoElectronico: usuario.correoElectronico,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        dni: usuario.dni,
        estado: usuario.estado,
        roles,
      },
    };
  }

  async cerrarSesion(tokenActualizacion: string) {
    const hash = this.hashSha256(tokenActualizacion);
    const sesion = await repositorioAuth.buscarSesionPorHash(hash);
    if (sesion) {
      await repositorioAuth.desactivarSesion(sesion.id);
    }
  }

  async obtenerPerfil(usuarioId: string) {
    const usuario = await repositorioAuth.buscarPorId(usuarioId);
    if (!usuario) {
      throw new NotFoundError("Usuario no encontrado");
    }

    return {
      id: usuario.id,
      correoElectronico: usuario.correoElectronico,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      dni: usuario.dni,
      telefono: usuario.telefono,
      fechaNacimiento: usuario.fechaNacimiento,
      genero: usuario.genero,
      estado: usuario.estado,
      verificadoCorreoEn: usuario.verificadoCorreoEn,
      roles: usuario.usuariosRoles.map((ur) => ({
        codigo: ur.rol.codigo,
        nombre: ur.rol.nombre,
      })),
    };
  }

  async listarSesiones(usuarioId: string) {
    return repositorioAuth.listarSesionesActivas(usuarioId);
  }

  async cerrarSesionPorId(sesionId: string, usuarioId: string) {
    const sesion = await repositorioAuth.buscarSesionPorId(sesionId);
    if (!sesion || sesion.usuarioId !== usuarioId) {
      throw new NotFoundError("Sesión no encontrada");
    }
    await repositorioAuth.desactivarSesion(sesionId);
  }

  async cerrarTodasSesiones(usuarioId: string) {
    await repositorioAuth.desactivarSesionesPorUsuario(usuarioId);
  }
}

export const servicioAuth = new ServicioAuth();
