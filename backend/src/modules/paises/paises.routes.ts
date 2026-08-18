import { Router } from "express";
import { ControladorPais } from "./paises.controller";
import { MiddlewareAuth } from "../../middlewares/auth.middleware";
import { MiddlewarePermiso } from "../../middlewares/permission.middleware";
import { PERMISOS_PAIS } from "./paises.constants";

const router = Router();

router.use(MiddlewareAuth.verificarToken);

router.get("/", MiddlewarePermiso.verificarPermiso(PERMISOS_PAIS.VER), ControladorPais.listar);
router.get("/:id", MiddlewarePermiso.verificarPermiso(PERMISOS_PAIS.VER), ControladorPais.buscarPorId);
router.post("/", MiddlewarePermiso.verificarPermiso(PERMISOS_PAIS.CREAR), ControladorPais.crear);
router.patch("/:id", MiddlewarePermiso.verificarPermiso(PERMISOS_PAIS.EDITAR), ControladorPais.actualizar);
router.delete("/:id", MiddlewarePermiso.verificarPermiso(PERMISOS_PAIS.ELIMINAR), ControladorPais.eliminar);

export default router;
