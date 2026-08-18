import { TokenPayload } from "../services/token.service";

declare global {
  namespace Express {
    interface Request {
      usuario?: TokenPayload;
    }
  }
}

export {};
