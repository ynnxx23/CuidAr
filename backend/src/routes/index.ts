import { Router } from "express";
import healthRoutes from "./health.routes";
import authRoutes from "../modules/auth/auth.routes";
import rolesRoutes from "../modules/roles/roles.routes";
import permisosRoutes from "../modules/permisos/permisos.routes";

const router = Router();

router.use("/health", healthRoutes);
router.use("/auth", authRoutes);
router.use("/roles", rolesRoutes);
router.use("/permisos", permisosRoutes);

export default router;
