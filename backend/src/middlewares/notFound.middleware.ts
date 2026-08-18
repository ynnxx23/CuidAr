import { Request, Response } from "express";
import { sendError } from "../utils/response";
import { ERROR_CODES, HTTP_STATUS } from "../config/constants";

export function notFoundHandler(_req: Request, res: Response): void {
  sendError(res, "Route not found", ERROR_CODES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
}
