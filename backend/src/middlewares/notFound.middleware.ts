import { Request, Response } from "express";
import { sendError } from "../utils/response";

export function notFoundHandler(_req: Request, res: Response): void {
  sendError(res, "Route not found", "NOT_FOUND", 404);
}
