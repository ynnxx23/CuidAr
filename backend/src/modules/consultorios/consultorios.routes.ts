import { Router } from "express";
import { ControladorConsultorio } from "./consultorios.controller";
import { MiddlewareAuth } from "../../middlewares/auth.middleware";
import { MiddlewarePermiso } from "../../middlewares/permission.middleware";
import { PERMISOS_CONSULTORIO } from "./consultorios.constants";

const router = Router();

router.use(MiddlewareAuth.verificarToken);

router.get("/", MiddlewarePermiso.verificarPermiso(PERMISOS_CONSULTORIO.VER), ControladorConsultorio.listar);
router.get("/:id", MiddlewarePermiso.verificarPermiso(PERMISOS_CONSULTORIO.VER), ControladorConsultorio.buscarPorId);
router.post("/", MiddlewarePermiso.verificarPermiso(PERMISOS_CONSULTORIO.CREAR), ControladorConsultorio.crear);
router.patch("/:id", MiddlewarePermiso.verificarPermiso(PERMISOS_CONSULTORIO.EDITAR), ControladorConsultorio.actualizar);
router.delete("/:id", MiddlewarePermiso.verificarPermiso(PERMISOS_CONSULTORIO.ELIMINAR), ControladorConsultorio.eliminar);

export default router;
