import { Router } from "express";
import { ControladorDepartamento } from "./departamentos.controller";
import { MiddlewareAuth } from "../../middlewares/auth.middleware";
import { MiddlewarePermiso } from "../../middlewares/permission.middleware";
import { PERMISOS_DEPARTAMENTO } from "./departamentos.constants";

const router = Router();

router.use(MiddlewareAuth.verificarToken);

router.get("/", MiddlewarePermiso.verificarPermiso(PERMISOS_DEPARTAMENTO.VER), ControladorDepartamento.listar);
router.get("/:id", MiddlewarePermiso.verificarPermiso(PERMISOS_DEPARTAMENTO.VER), ControladorDepartamento.buscarPorId);
router.post("/", MiddlewarePermiso.verificarPermiso(PERMISOS_DEPARTAMENTO.CREAR), ControladorDepartamento.crear);
router.patch("/:id", MiddlewarePermiso.verificarPermiso(PERMISOS_DEPARTAMENTO.EDITAR), ControladorDepartamento.actualizar);
router.delete("/:id", MiddlewarePermiso.verificarPermiso(PERMISOS_DEPARTAMENTO.ELIMINAR), ControladorDepartamento.eliminar);

export default router;
