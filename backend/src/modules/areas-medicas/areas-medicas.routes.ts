import { Router } from "express";
import { ControladorAreaMedica } from "./areas-medicas.controller";
import { MiddlewareAuth } from "../../middlewares/auth.middleware";
import { MiddlewarePermiso } from "../../middlewares/permission.middleware";
import { PERMISOS_AREA_MEDICA } from "./areas-medicas.constants";

const router = Router();

router.use(MiddlewareAuth.verificarToken);

router.get("/", MiddlewarePermiso.verificarPermiso(PERMISOS_AREA_MEDICA.VER), ControladorAreaMedica.listar);
router.get("/:id", MiddlewarePermiso.verificarPermiso(PERMISOS_AREA_MEDICA.VER), ControladorAreaMedica.buscarPorId);
router.post("/", MiddlewarePermiso.verificarPermiso(PERMISOS_AREA_MEDICA.CREAR), ControladorAreaMedica.crear);
router.patch("/:id", MiddlewarePermiso.verificarPermiso(PERMISOS_AREA_MEDICA.EDITAR), ControladorAreaMedica.actualizar);
router.delete("/:id", MiddlewarePermiso.verificarPermiso(PERMISOS_AREA_MEDICA.ELIMINAR), ControladorAreaMedica.eliminar);

export default router;
