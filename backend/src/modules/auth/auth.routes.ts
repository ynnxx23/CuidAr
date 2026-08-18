import { Router } from "express";
import { ControladorAuth } from "./auth.controller";
import { MiddlewareAuth } from "../../middlewares/auth.middleware";

const router = Router();

router.post("/register", ControladorAuth.registrar);
router.post("/login", ControladorAuth.iniciarSesion);
router.post("/refresh", ControladorAuth.refrescarToken);
router.post("/logout", ControladorAuth.cerrarSesion);
router.get("/me", MiddlewareAuth.verificarToken, ControladorAuth.obtenerPerfil);
router.get("/sesiones", MiddlewareAuth.verificarToken, ControladorAuth.listarSesiones);
router.delete("/sesiones/:id", MiddlewareAuth.verificarToken, ControladorAuth.cerrarSesionPorId);
router.delete("/sesiones", MiddlewareAuth.verificarToken, ControladorAuth.cerrarTodasSesiones);

export default router;
