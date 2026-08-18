import { TokenPayload } from "../services/token.service";

declare global {
  namespace Express {
    interface Request {
      usuario?: TokenPayload;
      requestId?: string;
      solicitudInicio?: number;
    }
  }
}

export {};
