import { Router } from "express";
import { ControladorMedicoEspecialidad } from "./medicos-especialidades.controller";
import { MiddlewareAuth } from "../../middlewares/auth.middleware";
import { MiddlewarePermiso } from "../../middlewares/permission.middleware";
import { PERMISOS_MEDICO_ESPECIALIDAD } from "./medicos-especialidades.constants";

const router = Router();

router.use(MiddlewareAuth.verificarToken);

router.get(
  "/",
  MiddlewarePermiso.verificarPermiso(PERMISOS_MEDICO_ESPECIALIDAD.ASIGNAR),
  ControladorMedicoEspecialidad.listar,
);
router.get(
  "/:id",
  MiddlewarePermiso.verificarPermiso(PERMISOS_MEDICO_ESPECIALIDAD.ASIGNAR),
  ControladorMedicoEspecialidad.buscarPorId,
);
router.post(
  "/",
  MiddlewarePermiso.verificarPermiso(PERMISOS_MEDICO_ESPECIALIDAD.ASIGNAR),
  ControladorMedicoEspecialidad.crear,
);
router.patch(
  "/:id",
  MiddlewarePermiso.verificarPermiso(PERMISOS_MEDICO_ESPECIALIDAD.ASIGNAR),
  ControladorMedicoEspecialidad.actualizar,
);
router.delete(
  "/:id",
  MiddlewarePermiso.verificarPermiso(PERMISOS_MEDICO_ESPECIALIDAD.ASIGNAR),
  ControladorMedicoEspecialidad.eliminar,
);

export default router;
