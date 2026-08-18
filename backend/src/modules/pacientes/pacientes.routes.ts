import { Router } from "express";
import { ControladorPaciente } from "./pacientes.controller";
import { MiddlewareAuth } from "../../middlewares/auth.middleware";
import { MiddlewarePermiso } from "../../middlewares/permission.middleware";
import { PERMISOS_PACIENTE } from "./pacientes.constants";

const router = Router();

router.use(MiddlewareAuth.verificarToken);

router.get("/", MiddlewarePermiso.verificarPermiso(PERMISOS_PACIENTE.VER), ControladorPaciente.listar);
router.get("/:id", MiddlewarePermiso.verificarPermiso(PERMISOS_PACIENTE.VER), ControladorPaciente.buscarPorId);
router.post("/", MiddlewarePermiso.verificarPermiso(PERMISOS_PACIENTE.CREAR), ControladorPaciente.crear);
router.patch("/:id", MiddlewarePermiso.verificarPermiso(PERMISOS_PACIENTE.EDITAR), ControladorPaciente.actualizar);
router.delete("/:id", MiddlewarePermiso.verificarPermiso(PERMISOS_PACIENTE.ELIMINAR), ControladorPaciente.eliminar);

export default router;
