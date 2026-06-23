import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/apiError";
import { sendError } from "../utils/response";
import { HTTP_STATUS, ERROR_CODES } from "../config/constants";
import { logger } from "../config/logger";

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof AppError) {
    logger.warn({ errorCode: err.errorCode, message: err.message }, "AppError");
    sendError(res, err.message, err.errorCode, err.statusCode);
    return;
  }

  logger.error({ err }, "Unhandled error");
  sendError(
    res,
    "Internal server error",
    ERROR_CODES.INTERNAL_ERROR,
    HTTP_STATUS.INTERNAL_SERVER_ERROR,
  );
}
