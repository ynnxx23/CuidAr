import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendSuccess } from "../../utils/response";
import { HTTP_STATUS } from "../../config/constants";
import { servicioAuth } from "./auth.service";
import { servicioAuditoria } from "../../services/auditoria.service";
import { validacionAuth } from "./auth.validation";
import { ACCIONES_AUDITORIA, RECURSO_AUDITORIA } from "./auth.constants";

export class ControladorAuth {
  static registrar = asyncHandler(async (req: Request, res: Response) => {
    validacionAuth.validarRegistro(req.body);
    const usuario = await servicioAuth.registrar(req.body);
    servicioAuditoria.registrar({
      recursoId: usuario.id,
      accion: ACCIONES_AUDITORIA.REGISTRO,
      tipoRecurso: RECURSO_AUDITORIA.USUARIO,
      direccionIp: req.ip?.toString() || null,
      agenteUsuario: req.headers["user-agent"] || null,
    });
    sendSuccess(res, usuario, "Usuario registrado exitosamente", HTTP_STATUS.CREATED);
  });

  static iniciarSesion = asyncHandler(async (req: Request, res: Response) => {
    validacionAuth.validarLogin(req.body);
    const resultado = await servicioAuth.iniciarSesion(
      req.body.correoElectronico,
      req.body.contrasena,
      req.headers["user-agent"],
      req.ip?.toString(),
    );
    servicioAuditoria.registrar({
      actorUsuarioId: resultado.usuario.id,
      accion: ACCIONES_AUDITORIA.INICIO_SESION,
      tipoRecurso: RECURSO_AUDITORIA.AUTH,
      recursoId: resultado.usuario.id,
      direccionIp: req.ip?.toString() || null,
      agenteUsuario: req.headers["user-agent"] || null,
    });
    sendSuccess(res, resultado, "Inicio de sesión exitoso");
  });

  static refrescarToken = asyncHandler(async (req: Request, res: Response) => {
    validacionAuth.validarTokenActualizacion(req.body);
    const resultado = await servicioAuth.refrescarToken(req.body.tokenActualizacion);
    servicioAuditoria.registrar({
      actorUsuarioId: resultado.usuario.id,
      accion: ACCIONES_AUDITORIA.TOKEN_ACTUALIZADO,
      tipoRecurso: RECURSO_AUDITORIA.AUTH,
      recursoId: resultado.usuario.id,
      direccionIp: req.ip?.toString() || null,
      agenteUsuario: req.headers["user-agent"] || null,
    });
    sendSuccess(res, resultado, "Token actualizado exitosamente");
  });

  static cerrarSesion = asyncHandler(async (req: Request, res: Response) => {
    const tokenActualizacion = req.body.tokenActualizacion || "";
    const usuarioId = (req as any).usuario?.usuarioId;
    await servicioAuth.cerrarSesion(tokenActualizacion);
    if (usuarioId) {
      servicioAuditoria.registrar({
        actorUsuarioId: usuarioId,
        accion: ACCIONES_AUDITORIA.CIERRE_SESION,
        tipoRecurso: RECURSO_AUDITORIA.SESION,
        direccionIp: req.ip?.toString() || null,
        agenteUsuario: req.headers["user-agent"] || null,
      });
    }
    sendSuccess(res, null, "Sesión cerrada exitosamente");
  });

  static obtenerPerfil = asyncHandler(async (req: Request, res: Response) => {
    const usuarioId = (req as any).usuario.usuarioId;
    const perfil = await servicioAuth.obtenerPerfil(usuarioId);
    sendSuccess(res, perfil, "Perfil obtenido exitosamente");
  });

  static listarSesiones = asyncHandler(async (req: Request, res: Response) => {
    const usuarioId = (req as any).usuario.usuarioId;
    const sesiones = await servicioAuth.listarSesiones(usuarioId);
    sendSuccess(res, sesiones, "Sesiones obtenidas exitosamente");
  });

  static cerrarSesionPorId = asyncHandler(async (req: Request, res: Response) => {
    const usuarioId = (req as any).usuario.usuarioId;
    await servicioAuth.cerrarSesionPorId(req.params.id as string, usuarioId);
    sendSuccess(res, null, "Sesión cerrada exitosamente");
  });

  static cerrarTodasSesiones = asyncHandler(async (req: Request, res: Response) => {
    const usuarioId = (req as any).usuario.usuarioId;
    await servicioAuth.cerrarTodasSesiones(usuarioId);
    servicioAuditoria.registrar({
      actorUsuarioId: usuarioId,
      accion: ACCIONES_AUDITORIA.CIERRE_TODAS_SESIONES,
      tipoRecurso: RECURSO_AUDITORIA.SESION,
      direccionIp: req.ip?.toString() || null,
      agenteUsuario: req.headers["user-agent"] || null,
    });
    sendSuccess(res, null, "Todas las sesiones cerradas exitosamente");
  });
}
