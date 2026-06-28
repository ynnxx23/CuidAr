import jwt from "jsonwebtoken";
import { env } from "../config/env";

interface TokenPayload {
  usuarioId: string;
  correoElectronico: string;
}

export class ServicioToken {
  generarTokenAcceso(payload: TokenPayload): string {
    return jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"],
    });
  }

  generarTokenActualizacion(payload: TokenPayload): string {
    return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
      expiresIn: env.JWT_REFRESH_EXPIRES_IN as jwt.SignOptions["expiresIn"],
    });
  }

  verificarTokenAcceso(token: string): TokenPayload {
    return jwt.verify(token, env.JWT_SECRET) as TokenPayload;
  }

  verificarTokenActualizacion(token: string): TokenPayload {
    return jwt.verify(token, env.JWT_REFRESH_SECRET) as TokenPayload;
  }
}

export const servicioToken = new ServicioToken();
