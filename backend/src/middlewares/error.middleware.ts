import { NextFunction, Request, Response } from "express";
import { logger } from "../config/logger";
import { ERROR_CODES, HTTP_STATUS } from "../config/constants";
import { sendError } from "../utils/response";
import { AppError } from "../utils/apiError";

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof AppError) {
    logger.warn({ errorCode: err.errorCode, message: err.message }, "Operational error");
    sendError(res, err.message, err.errorCode, err.statusCode);
    return;
  }

  logger.error({ err }, "Unhandled error");
  sendError(res, "Internal server error", ERROR_CODES.INTERNAL_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
}
