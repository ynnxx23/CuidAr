import { Response } from "express";

interface ApiResponse<T = unknown> {
  success: true;
  message: string;
  data: T;
}

interface ApiErrorResponse {
  success: false;
  message: string;
  error: {
    code: string;
  };
}

export function sendSuccess<T>(
  res: Response,
  data: T,
  message = "Success",
  statusCode = 200,
): void {
  const body: ApiResponse<T> = { success: true, message, data };
  res.status(statusCode).json(body);
}

export function sendError(
  res: Response,
  message: string,
  errorCode: string,
  statusCode = 500,
): void {
  const body: ApiErrorResponse = {
    success: false,
    message,
    error: { code: errorCode },
  };
  res.status(statusCode).json(body);
}
