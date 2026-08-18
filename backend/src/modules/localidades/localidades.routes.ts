import { Router } from "express";
import { ControladorLocalidad } from "./localidades.controller";
import { MiddlewareAuth } from "../../middlewares/auth.middleware";
import { MiddlewarePermiso } from "../../middlewares/permission.middleware";
import { PERMISOS_LOCALIDAD } from "./localidades.constants";

const router = Router();

router.use(MiddlewareAuth.verificarToken);

router.get("/", MiddlewarePermiso.verificarPermiso(PERMISOS_LOCALIDAD.VER), ControladorLocalidad.listar);
router.get("/:id", MiddlewarePermiso.verificarPermiso(PERMISOS_LOCALIDAD.VER), ControladorLocalidad.buscarPorId);
router.post("/", MiddlewarePermiso.verificarPermiso(PERMISOS_LOCALIDAD.CREAR), ControladorLocalidad.crear);
router.patch("/:id", MiddlewarePermiso.verificarPermiso(PERMISOS_LOCALIDAD.EDITAR), ControladorLocalidad.actualizar);
router.delete("/:id", MiddlewarePermiso.verificarPermiso(PERMISOS_LOCALIDAD.ELIMINAR), ControladorLocalidad.eliminar);

export default router;
