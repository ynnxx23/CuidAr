import { Router } from "express";
import { ControladorMatricula } from "./matriculas.controller";
import { MiddlewareAuth } from "../../middlewares/auth.middleware";
import { MiddlewarePermiso } from "../../middlewares/permission.middleware";
import { PERMISOS_MATRICULA } from "./matriculas.constants";

const router = Router();

router.use(MiddlewareAuth.verificarToken);

router.get("/", MiddlewarePermiso.verificarPermiso(PERMISOS_MATRICULA.VER), ControladorMatricula.listar);
router.get("/:id", MiddlewarePermiso.verificarPermiso(PERMISOS_MATRICULA.VER), ControladorMatricula.buscarPorId);
router.post("/", MiddlewarePermiso.verificarPermiso(PERMISOS_MATRICULA.CREAR), ControladorMatricula.crear);
router.patch("/:id", MiddlewarePermiso.verificarPermiso(PERMISOS_MATRICULA.EDITAR), ControladorMatricula.actualizar);
router.delete("/:id", MiddlewarePermiso.verificarPermiso(PERMISOS_MATRICULA.ELIMINAR), ControladorMatricula.eliminar);

export default router;
