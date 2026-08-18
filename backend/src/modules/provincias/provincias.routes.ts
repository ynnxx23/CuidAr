import { Router } from "express";
import { ControladorProvincia } from "./provincias.controller";
import { MiddlewareAuth } from "../../middlewares/auth.middleware";
import { MiddlewarePermiso } from "../../middlewares/permission.middleware";
import { PERMISOS_PROVINCIA } from "./provincias.constants";

const router = Router();

router.use(MiddlewareAuth.verificarToken);

router.get("/", MiddlewarePermiso.verificarPermiso(PERMISOS_PROVINCIA.VER), ControladorProvincia.listar);
router.get("/:id", MiddlewarePermiso.verificarPermiso(PERMISOS_PROVINCIA.VER), ControladorProvincia.buscarPorId);
router.post("/", MiddlewarePermiso.verificarPermiso(PERMISOS_PROVINCIA.CREAR), ControladorProvincia.crear);
router.patch("/:id", MiddlewarePermiso.verificarPermiso(PERMISOS_PROVINCIA.EDITAR), ControladorProvincia.actualizar);
router.delete("/:id", MiddlewarePermiso.verificarPermiso(PERMISOS_PROVINCIA.ELIMINAR), ControladorProvincia.eliminar);

export default router;
