import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess } from "../utils/response";
import { env } from "../config/env";

const router = Router();

router.get(
  "/",
  asyncHandler(async (_req, res) => {
    const ahora = new Date();
    const timestampArg = ahora.toLocaleString("es-AR", {
      timeZone: env.TZ,
      dateStyle: "full",
      timeStyle: "long",
    });
    sendSuccess(res, {
      status: "ok",
      timestamp: timestampArg,
      timezone: env.TZ,
      iso: ahora.toISOString(),
      uptime: process.uptime(),
    });
  }),
);

export default router;
