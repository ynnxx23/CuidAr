import { Router } from "express";
import { ControladorPermiso } from "./permisos.controller";
import { MiddlewareAuth } from "../../middlewares/auth.middleware";
import { MiddlewarePermiso } from "../../middlewares/permission.middleware";

const router = Router();

router.use(MiddlewareAuth.verificarToken);

router.get("/", MiddlewarePermiso.verificarPermiso("permisos:view"), ControladorPermiso.listar);
router.get("/:id", MiddlewarePermiso.verificarPermiso("permisos:view"), ControladorPermiso.buscarPorId);
router.post("/", MiddlewarePermiso.verificarPermiso("permisos:create"), ControladorPermiso.crear);
router.patch("/:id", MiddlewarePermiso.verificarPermiso("permisos:edit"), ControladorPermiso.actualizar);
router.delete("/:id", MiddlewarePermiso.verificarPermiso("permisos:delete"), ControladorPermiso.eliminar);

export default router;
