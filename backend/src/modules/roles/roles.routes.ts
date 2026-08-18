import { Router } from "express";
import { ControladorRol } from "./roles.controller";
import { MiddlewareAuth } from "../../middlewares/auth.middleware";
import { MiddlewarePermiso } from "../../middlewares/permission.middleware";

const router = Router();

router.use(MiddlewareAuth.verificarToken);

router.get("/", MiddlewarePermiso.verificarPermiso("roles:view"), ControladorRol.listar);
router.get("/:id", MiddlewarePermiso.verificarPermiso("roles:view"), ControladorRol.buscarPorId);
router.post("/", MiddlewarePermiso.verificarPermiso("roles:create"), ControladorRol.crear);
router.patch("/:id", MiddlewarePermiso.verificarPermiso("roles:edit"), ControladorRol.actualizar);
router.delete("/:id", MiddlewarePermiso.verificarPermiso("roles:delete"), ControladorRol.eliminar);
router.post("/:id/permisos", MiddlewarePermiso.verificarPermiso("roles:assign"), ControladorRol.asignarPermiso);
router.delete(
  "/:id/permisos/:permisoId",
  MiddlewarePermiso.verificarPermiso("roles:assign"),
  ControladorRol.removerPermiso,
);

export default router;
