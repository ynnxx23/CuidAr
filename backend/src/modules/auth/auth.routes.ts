import { Router } from 'express';
import { ControladorAuth } from './auth.controller';
import { MiddlewareAuth } from '../../middlewares/auth.middleware';
import {
  limitadorAutenticacion,
  limitadorBruteForce,
} from '../../middlewares/rateLimit.middleware';

const router = Router();

router.post('/register', limitadorAutenticacion, limitadorBruteForce, ControladorAuth.registrar);
router.post('/login', limitadorAutenticacion, limitadorBruteForce, ControladorAuth.iniciarSesion);
router.post('/refresh', limitadorAutenticacion, ControladorAuth.refrescarToken);
router.post('/logout', MiddlewareAuth.verificarToken, ControladorAuth.cerrarSesion);
router.get('/me', MiddlewareAuth.verificarToken, ControladorAuth.obtenerPerfil);
router.get('/sesiones', MiddlewareAuth.verificarToken, ControladorAuth.listarSesiones);
router.delete('/sesiones/:id', MiddlewareAuth.verificarToken, ControladorAuth.cerrarSesionPorId);
router.delete('/sesiones', MiddlewareAuth.verificarToken, ControladorAuth.cerrarTodasSesiones);

export default router;
