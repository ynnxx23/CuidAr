import { Router } from "express";
import { ControladorPacienteTutor } from "./pacientes-tutores.controller";
import { MiddlewareAuth } from "../../middlewares/auth.middleware";
import { MiddlewarePermiso } from "../../middlewares/permission.middleware";
import { PERMISOS_PACIENTE_TUTOR } from "./pacientes-tutores.constants";

const router = Router();

router.use(MiddlewareAuth.verificarToken);

router.get("/", MiddlewarePermiso.verificarPermiso(PERMISOS_PACIENTE_TUTOR.VER), ControladorPacienteTutor.listar);
router.get("/:id", MiddlewarePermiso.verificarPermiso(PERMISOS_PACIENTE_TUTOR.VER), ControladorPacienteTutor.buscarPorId);
router.post("/", MiddlewarePermiso.verificarPermiso(PERMISOS_PACIENTE_TUTOR.CREAR), ControladorPacienteTutor.crear);
router.patch("/:id", MiddlewarePermiso.verificarPermiso(PERMISOS_PACIENTE_TUTOR.EDITAR), ControladorPacienteTutor.actualizar);
router.delete("/:id", MiddlewarePermiso.verificarPermiso(PERMISOS_PACIENTE_TUTOR.ELIMINAR), ControladorPacienteTutor.eliminar);

export default router;
