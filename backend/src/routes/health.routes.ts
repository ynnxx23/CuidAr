import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess } from "../utils/response";

const router = Router();

router.get(
  "/",
  asyncHandler(async (_req, res) => {
    sendSuccess(res, {
      status: "ok",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  }),
);

export default router;
