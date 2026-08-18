import { Router } from "express";
import { ControladorHospital } from "./hospitales.controller";
import { MiddlewareAuth } from "../../middlewares/auth.middleware";
import { MiddlewarePermiso } from "../../middlewares/permission.middleware";
import { PERMISOS_HOSPITAL } from "./hospitales.constants";

const router = Router();

router.use(MiddlewareAuth.verificarToken);

router.get("/", MiddlewarePermiso.verificarPermiso(PERMISOS_HOSPITAL.VER), ControladorHospital.listar);
router.get("/:id", MiddlewarePermiso.verificarPermiso(PERMISOS_HOSPITAL.VER), ControladorHospital.buscarPorId);
router.post("/", MiddlewarePermiso.verificarPermiso(PERMISOS_HOSPITAL.CREAR), ControladorHospital.crear);
router.patch("/:id", MiddlewarePermiso.verificarPermiso(PERMISOS_HOSPITAL.EDITAR), ControladorHospital.actualizar);
router.delete("/:id", MiddlewarePermiso.verificarPermiso(PERMISOS_HOSPITAL.GESTIONAR), ControladorHospital.eliminar);

export default router;
