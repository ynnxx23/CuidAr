import { Router } from "express";
import { ControladorRol } from "./roles.controller";
import { MiddlewareAuth } from "../../middlewares/auth.middleware";
import { MiddlewarePermiso } from "../../middlewares/permission.middleware";

const router = Router();

router.use(MiddlewareAuth.verificarToken);

router.get("/", MiddlewarePermiso.verificarPermiso("roles:ver"), ControladorRol.listar);
router.get("/:id", MiddlewarePermiso.verificarPermiso("roles:ver"), ControladorRol.buscarPorId);
router.post("/", MiddlewarePermiso.verificarPermiso("roles:crear"), ControladorRol.crear);
router.patch("/:id", MiddlewarePermiso.verificarPermiso("roles:editar"), ControladorRol.actualizar);
router.delete("/:id", MiddlewarePermiso.verificarPermiso("roles:eliminar"), ControladorRol.eliminar);
router.post("/:id/permisos", MiddlewarePermiso.verificarPermiso("roles:asignar"), ControladorRol.asignarPermiso);
router.delete("/:id/permisos/:permisoId", MiddlewarePermiso.verificarPermiso("roles:asignar"), ControladorRol.removerPermiso);

export default router;
