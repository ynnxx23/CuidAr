import { Router } from 'express';
import { ControladorUsuario } from './users.controller';
import { MiddlewareAuth } from '../../middlewares/auth.middleware';
import { MiddlewarePermiso } from '../../middlewares/permission.middleware';

const router = Router();

router.use(MiddlewareAuth.verificarToken);

router.get(
  '/',
  MiddlewarePermiso.verificarPermiso('users:view'),
  ControladorUsuario.listar,
);

router.get(
  '/:id',
  MiddlewarePermiso.verificarPermiso('users:view'),
  ControladorUsuario.obtenerPorId,
);

router.patch(
  '/:id',
  MiddlewarePermiso.verificarPermiso('users:update'),
  ControladorUsuario.actualizar,
);

router.delete(
  '/:id',
  MiddlewarePermiso.verificarPermiso('users:delete'),
  ControladorUsuario.eliminar,
);

export default router;
