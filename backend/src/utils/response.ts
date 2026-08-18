import { Response } from "express";
import { HTTP_STATUS } from "../config/constants";

export interface ApiResponse<T> {
  success: true;
  message: string;
  data: T;
}

export interface ApiErrorResponse {
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
  statusCode: number = HTTP_STATUS.OK,
): void {
  const body: ApiResponse<T> = { success: true, message, data };
  res.status(statusCode).json(body);
}

export function sendError(
  res: Response,
  message: string,
  errorCode: string,
  statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR,
): void {
  const body: ApiErrorResponse = { success: false, message, error: { code: errorCode } };
  res.status(statusCode).json(body);
}
