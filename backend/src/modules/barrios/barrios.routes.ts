import { Router } from "express";
import { ControladorBarrio } from "./barrios.controller";
import { MiddlewareAuth } from "../../middlewares/auth.middleware";
import { MiddlewarePermiso } from "../../middlewares/permission.middleware";
import { PERMISOS_BARRIO } from "./barrios.constants";

const router = Router();

router.use(MiddlewareAuth.verificarToken);

router.get("/", MiddlewarePermiso.verificarPermiso(PERMISOS_BARRIO.VER), ControladorBarrio.listar);
router.get("/:id", MiddlewarePermiso.verificarPermiso(PERMISOS_BARRIO.VER), ControladorBarrio.buscarPorId);
router.post("/", MiddlewarePermiso.verificarPermiso(PERMISOS_BARRIO.CREAR), ControladorBarrio.crear);
router.patch("/:id", MiddlewarePermiso.verificarPermiso(PERMISOS_BARRIO.EDITAR), ControladorBarrio.actualizar);
router.delete("/:id", MiddlewarePermiso.verificarPermiso(PERMISOS_BARRIO.ELIMINAR), ControladorBarrio.eliminar);

export default router;
