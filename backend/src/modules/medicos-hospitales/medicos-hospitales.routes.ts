import { Router } from "express";
import { ControladorMedicoHospital } from "./medicos-hospitales.controller";
import { MiddlewareAuth } from "../../middlewares/auth.middleware";
import { MiddlewarePermiso } from "../../middlewares/permission.middleware";
import { PERMISOS_MEDICO_HOSPITAL } from "./medicos-hospitales.constants";

const router = Router();

router.use(MiddlewareAuth.verificarToken);

router.get(
  "/",
  MiddlewarePermiso.verificarPermiso(PERMISOS_MEDICO_HOSPITAL.ASIGNAR),
  ControladorMedicoHospital.listar,
);
router.get(
  "/:id",
  MiddlewarePermiso.verificarPermiso(PERMISOS_MEDICO_HOSPITAL.ASIGNAR),
  ControladorMedicoHospital.buscarPorId,
);
router.post(
  "/",
  MiddlewarePermiso.verificarPermiso(PERMISOS_MEDICO_HOSPITAL.ASIGNAR),
  ControladorMedicoHospital.crear,
);
router.patch(
  "/:id",
  MiddlewarePermiso.verificarPermiso(PERMISOS_MEDICO_HOSPITAL.ASIGNAR),
  ControladorMedicoHospital.actualizar,
);
router.delete(
  "/:id",
  MiddlewarePermiso.verificarPermiso(PERMISOS_MEDICO_HOSPITAL.ASIGNAR),
  ControladorMedicoHospital.eliminar,
);

export default router;
