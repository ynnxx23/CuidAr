import app from "./app";
import { env } from "./config/env";
import { logger } from "./config/logger";

// Configurar zona horaria Argentina
process.env.TZ = env.TZ;

function start(): void {
  logger.info({ nodeEnv: env.NODE_ENV, timezone: env.TZ }, "Starting server");

  app.listen(env.PORT, () => {
    logger.info({ port: env.PORT, timezone: env.TZ }, "Server listening");
  });
}

start();
