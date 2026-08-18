import { Router } from 'express';
import { ControladorSlots } from './slots.controller';
import { MiddlewareAuth } from '../../middlewares/auth.middleware';
import { MiddlewarePermiso } from '../../middlewares/permission.middleware';

const router = Router();

router.use(MiddlewareAuth.verificarToken);

router.get(
  '/available',
  MiddlewarePermiso.verificarPermiso('appointments:view'),
  ControladorSlots.listarDisponibles,
);

router.get(
  '/by-doctor/:doctorId',
  MiddlewarePermiso.verificarPermiso('appointments:view'),
  ControladorSlots.listarPorMedico,
);

router.post(
  '/generate',
  MiddlewarePermiso.verificarPermiso('disponibilidad:crear'),
  ControladorSlots.generar,
);

router.post(
  '/regenerate',
  MiddlewarePermiso.verificarPermiso('disponibilidad:editar'),
  ControladorSlots.regenerar,
);

router.patch(
  '/:id/block',
  MiddlewarePermiso.verificarPermiso('disponibilidad:editar'),
  ControladorSlots.bloquear,
);

router.patch(
  '/:id/unblock',
  MiddlewarePermiso.verificarPermiso('disponibilidad:editar'),
  ControladorSlots.desbloquear,
);

export default router;
