import { Router } from "express";
import { ControladorEspecialidad } from "./especialidades.controller";
import { MiddlewareAuth } from "../../middlewares/auth.middleware";
import { MiddlewarePermiso } from "../../middlewares/permission.middleware";
import { PERMISOS_ESPECIALIDAD } from "./especialidades.constants";

const router = Router();

router.use(MiddlewareAuth.verificarToken);

router.get("/", MiddlewarePermiso.verificarPermiso(PERMISOS_ESPECIALIDAD.VER), ControladorEspecialidad.listar);
router.get("/:id", MiddlewarePermiso.verificarPermiso(PERMISOS_ESPECIALIDAD.VER), ControladorEspecialidad.buscarPorId);
router.post("/", MiddlewarePermiso.verificarPermiso(PERMISOS_ESPECIALIDAD.CREAR), ControladorEspecialidad.crear);
router.patch("/:id", MiddlewarePermiso.verificarPermiso(PERMISOS_ESPECIALIDAD.EDITAR), ControladorEspecialidad.actualizar);
router.delete("/:id", MiddlewarePermiso.verificarPermiso(PERMISOS_ESPECIALIDAD.ELIMINAR), ControladorEspecialidad.eliminar);

export default router;
