import { Router } from "express";
import { ControladorMedico } from "./medicos.controller";
import { MiddlewareAuth } from "../../middlewares/auth.middleware";
import { MiddlewarePermiso } from "../../middlewares/permission.middleware";
import { PERMISOS_MEDICO } from "./medicos.constants";

const router = Router();

router.use(MiddlewareAuth.verificarToken);

router.get("/", MiddlewarePermiso.verificarPermiso(PERMISOS_MEDICO.VER), ControladorMedico.listar);
router.get("/:id", MiddlewarePermiso.verificarPermiso(PERMISOS_MEDICO.VER), ControladorMedico.buscarPorId);
router.post("/", MiddlewarePermiso.verificarPermiso(PERMISOS_MEDICO.CREAR), ControladorMedico.crear);
router.patch("/:id", MiddlewarePermiso.verificarPermiso(PERMISOS_MEDICO.EDITAR), ControladorMedico.actualizar);
router.delete("/:id", MiddlewarePermiso.verificarPermiso(PERMISOS_MEDICO.ELIMINAR), ControladorMedico.eliminar);

export default router;
