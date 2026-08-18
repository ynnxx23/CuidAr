import { Router } from "express";
import { ControladorSucursal } from "./sucursales.controller";
import { MiddlewareAuth } from "../../middlewares/auth.middleware";
import { MiddlewarePermiso } from "../../middlewares/permission.middleware";
import { PERMISOS_SUCURSAL } from "./sucursales.constants";

const router = Router();

router.use(MiddlewareAuth.verificarToken);

router.get("/", MiddlewarePermiso.verificarPermiso(PERMISOS_SUCURSAL.VER), ControladorSucursal.listar);
router.get("/:id", MiddlewarePermiso.verificarPermiso(PERMISOS_SUCURSAL.VER), ControladorSucursal.buscarPorId);
router.post("/", MiddlewarePermiso.verificarPermiso(PERMISOS_SUCURSAL.CREAR), ControladorSucursal.crear);
router.patch("/:id", MiddlewarePermiso.verificarPermiso(PERMISOS_SUCURSAL.EDITAR), ControladorSucursal.actualizar);
router.delete("/:id", MiddlewarePermiso.verificarPermiso(PERMISOS_SUCURSAL.ELIMINAR), ControladorSucursal.eliminar);

export default router;
