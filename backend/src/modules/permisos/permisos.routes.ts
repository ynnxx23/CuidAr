import { Router } from "express";
import { ControladorPermiso } from "./permisos.controller";
import { MiddlewareAuth } from "../../middlewares/auth.middleware";
import { MiddlewarePermiso } from "../../middlewares/permission.middleware";

const router = Router();

router.use(MiddlewareAuth.verificarToken);

router.get("/", MiddlewarePermiso.verificarPermiso("roles:ver"), ControladorPermiso.listar);
router.get("/:id", MiddlewarePermiso.verificarPermiso("roles:ver"), ControladorPermiso.buscarPorId);
router.post("/", MiddlewarePermiso.verificarPermiso("roles:crear"), ControladorPermiso.crear);
router.patch("/:id", MiddlewarePermiso.verificarPermiso("roles:editar"), ControladorPermiso.actualizar);
router.delete("/:id", MiddlewarePermiso.verificarPermiso("roles:eliminar"), ControladorPermiso.eliminar);

export default router;
