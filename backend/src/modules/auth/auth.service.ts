import bcrypt from "bcryptjs";
import crypto from "crypto";
import { repositorioAuth } from "./auth.repository";
import { servicioToken } from "../../services/token.service";
import { ConflictError, NotFoundError, UnauthorizedError } from "../../utils/apiError";

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

    if (usuario.estado === "eliminado" || usuario.estado === "suspendido") {
      throw new UnauthorizedError("Usuario no autorizado para iniciar sesión");
    }

    const contrasenaValida = this.compararContrasena(contrasena, usuario.hashContrasena);
    if (!contrasenaValida) {
      throw new UnauthorizedError("Credenciales inválidas");
    }

    const payload = {
      usuarioId: usuario.id,
      correoElectronico: usuario.correoElectronico,
    };

    const tokenAcceso = servicioToken.generarTokenAcceso(payload);
    const tokenActualizacion = servicioToken.generarTokenActualizacion(payload);
    const hashTokenActualizacion = this.hashSha256(tokenActualizacion);

    await repositorioAuth.crearSesion({
      usuarioId: usuario.id,
      hashTokenActualizacion,
      ...this.extraerInfoDispositivo(agenteUsuario, direccionIp),
    });

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
        roles: usuario.usuariosRoles.map((ur) => ur.rol.codigo),
      },
    };
  }

  async refrescarToken(tokenActualizacion: string) {
    let payload: { usuarioId: string; correoElectronico: string };
    try {
      payload = servicioToken.verificarTokenActualizacion(tokenActualizacion);
    } catch {
      throw new UnauthorizedError("Token de actualización inválido o expirado");
    }

    const hash = this.hashSha256(tokenActualizacion);
    const sesion = await repositorioAuth.buscarSesionPorHash(hash);
    if (!sesion || sesion.usuarioId !== payload.usuarioId) {
      throw new UnauthorizedError("Sesión no válida");
    }

    const usuario = await repositorioAuth.buscarPorId(payload.usuarioId);
    if (!usuario) {
      throw new UnauthorizedError("Usuario no encontrado");
    }

    const nuevoPayload = {
      usuarioId: usuario.id,
      correoElectronico: usuario.correoElectronico,
    };

    const nuevoTokenAcceso = servicioToken.generarTokenAcceso(nuevoPayload);
    const nuevoTokenActualizacion = servicioToken.generarTokenActualizacion(nuevoPayload);
    const nuevoHash = this.hashSha256(nuevoTokenActualizacion);

    await repositorioAuth.desactivarSesion(sesion.id);
    await repositorioAuth.crearSesion({
      usuarioId: usuario.id,
      hashTokenActualizacion: nuevoHash,
      nombreDispositivo: sesion.nombreDispositivo ?? undefined,
      direccionIp: sesion.direccionIp ?? undefined,
    });

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
        roles: usuario.usuariosRoles.map((ur) => ur.rol.codigo),
      },
    };
  }

  async cerrarSesion(tokenActualizacion: string): Promise<void> {
    if (!tokenActualizacion) return;

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

    const { hashContrasena: _hashContrasena, ...resto } = usuario;
    return {
      ...resto,
      roles: usuario.usuariosRoles.map((ur) => ur.rol.codigo),
    };
  }

  async listarSesiones(usuarioId: string) {
    return repositorioAuth.listarSesionesActivas(usuarioId);
  }

  async cerrarSesionPorId(sesionId: string, usuarioId: string): Promise<void> {
    const sesion = await repositorioAuth.buscarSesionPorId(sesionId);
    if (!sesion || sesion.usuarioId !== usuarioId) {
      throw new NotFoundError("Sesión no encontrada");
    }
    await repositorioAuth.desactivarSesion(sesionId);
  }

  async cerrarTodasSesiones(usuarioId: string): Promise<void> {
    await repositorioAuth.desactivarSesionesPorUsuario(usuarioId);
  }
}

export const servicioAuth = new ServicioAuth();
