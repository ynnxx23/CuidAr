import { Router } from "express";
import { ControladorTutor } from "./tutores.controller";
import { MiddlewareAuth } from "../../middlewares/auth.middleware";
import { MiddlewarePermiso } from "../../middlewares/permission.middleware";
import { PERMISOS_TUTOR } from "./tutores.constants";

const router = Router();

router.use(MiddlewareAuth.verificarToken);

router.get("/", MiddlewarePermiso.verificarPermiso(PERMISOS_TUTOR.VER), ControladorTutor.listar);
router.get("/:id", MiddlewarePermiso.verificarPermiso(PERMISOS_TUTOR.VER), ControladorTutor.buscarPorId);
router.post("/", MiddlewarePermiso.verificarPermiso(PERMISOS_TUTOR.CREAR), ControladorTutor.crear);
router.patch("/:id", MiddlewarePermiso.verificarPermiso(PERMISOS_TUTOR.EDITAR), ControladorTutor.actualizar);
router.delete("/:id", MiddlewarePermiso.verificarPermiso(PERMISOS_TUTOR.ELIMINAR), ControladorTutor.eliminar);

export default router;
