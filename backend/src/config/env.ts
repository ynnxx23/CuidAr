import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

interface Env {
  TZ: string;
  NODE_ENV: string;
  PORT: number;
  DB_HOST: string;
  DB_PORT: number;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_NAME: string;
  DATABASE_URL: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  JWT_REFRESH_SECRET: string;
  JWT_REFRESH_EXPIRES_IN: string;
  CORS_ORIGINS: string;
  LOG_LEVEL: string;
}

function loadEnv(): Env {
  const dbHost = process.env.DB_HOST || "localhost";
  const dbPort = process.env.DB_PORT || "5433";
  const dbUser = process.env.DB_USER || "cuidar";
  const dbPassword = process.env.DB_PASSWORD || "cuidar_secret";
  const dbName = process.env.DB_NAME || "cuidar";

  return {
    TZ: process.env.TZ || "America/Argentina/Buenos_Aires",
    NODE_ENV: process.env.NODE_ENV || "development",
    PORT: parseInt(process.env.PORT || "3000", 10),
    DB_HOST: dbHost,
    DB_PORT: parseInt(dbPort, 10),
    DB_USER: dbUser,
    DB_PASSWORD: dbPassword,
    DB_NAME: dbName,
    DATABASE_URL:
      process.env.DATABASE_URL ||
      `postgresql://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`,
    JWT_SECRET: process.env.JWT_SECRET || "dev-jwt-secret",
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "15m",
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || "dev-refresh-secret",
    JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
    CORS_ORIGINS: process.env.CORS_ORIGINS || "http://localhost:3000",
    LOG_LEVEL: process.env.LOG_LEVEL || "debug",
  };
}

export const env = loadEnv();
