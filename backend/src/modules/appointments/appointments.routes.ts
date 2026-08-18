import { Router } from 'express';
import { ControladorTurnos } from './appointments.controller';
import { MiddlewareAuth } from '../../middlewares/auth.middleware';
import { MiddlewarePermiso } from '../../middlewares/permission.middleware';

const router = Router();

router.use(MiddlewareAuth.verificarToken);

router.get(
  '/',
  MiddlewarePermiso.verificarPermiso('appointments:view'),
  ControladorTurnos.listar,
);

router.get(
  '/:id',
  MiddlewarePermiso.verificarPermiso('appointments:view'),
  ControladorTurnos.obtenerPorId,
);

router.post(
  '/',
  MiddlewarePermiso.verificarPermiso('appointments:create'),
  ControladorTurnos.reservar,
);

router.patch(
  '/:id',
  MiddlewarePermiso.verificarPermiso('appointments:update'),
  ControladorTurnos.actualizar,
);

router.patch(
  '/:id/confirm',
  MiddlewarePermiso.verificarPermiso('appointments:create'),
  ControladorTurnos.confirmar,
);

router.patch(
  '/:id/check-in',
  MiddlewarePermiso.verificarPermiso('appointments:create'),
  ControladorTurnos.checkIn,
);

router.patch(
  '/:id/complete',
  MiddlewarePermiso.verificarPermiso('appointments:create'),
  ControladorTurnos.finalizar,
);

router.patch(
  '/:id/cancel',
  MiddlewarePermiso.verificarPermiso('appointments:cancel'),
  ControladorTurnos.cancelar,
);

router.patch(
  '/:id/reschedule',
  MiddlewarePermiso.verificarPermiso('appointments:reschedule'),
  ControladorTurnos.reprogramar,
);

router.delete(
  '/:id',
  MiddlewarePermiso.verificarPermiso('appointments:delete'),
  ControladorTurnos.eliminar,
);

export default router;
