import { Router } from 'express';
import { ControladorDisponibilidad } from './availability.controller';
import { MiddlewareAuth } from '../../middlewares/auth.middleware';
import { MiddlewarePermiso } from '../../middlewares/permission.middleware';

const router = Router();

router.use(MiddlewareAuth.verificarToken);

router.get(
  '/rules',
  MiddlewarePermiso.verificarPermiso('disponibilidad:ver'),
  ControladorDisponibilidad.listarReglas,
);

router.get(
  '/rules/:id',
  MiddlewarePermiso.verificarPermiso('disponibilidad:ver'),
  ControladorDisponibilidad.obtenerRegla,
);

router.post(
  '/rules',
  MiddlewarePermiso.verificarPermiso('disponibilidad:crear'),
  ControladorDisponibilidad.crearRegla,
);

router.patch(
  '/rules/:id',
  MiddlewarePermiso.verificarPermiso('disponibilidad:editar'),
  ControladorDisponibilidad.actualizarRegla,
);

router.delete(
  '/rules/:id',
  MiddlewarePermiso.verificarPermiso('disponibilidad:eliminar'),
  ControladorDisponibilidad.eliminarRegla,
);

router.get(
  '/exceptions',
  MiddlewarePermiso.verificarPermiso('disponibilidad:ver'),
  ControladorDisponibilidad.listarExcepciones,
);

router.post(
  '/exceptions',
  MiddlewarePermiso.verificarPermiso('disponibilidad:crear'),
  ControladorDisponibilidad.crearExcepcion,
);

router.delete(
  '/exceptions/:id',
  MiddlewarePermiso.verificarPermiso('disponibilidad:eliminar'),
  ControladorDisponibilidad.eliminarExcepcion,
);

export default router;
