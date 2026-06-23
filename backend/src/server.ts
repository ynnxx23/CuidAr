import app from "./app";
import { env } from "./config/env";
import { logger } from "./config/logger";

function start(): void {
  logger.info({ nodeEnv: env.NODE_ENV }, "Starting server");

  app.listen(env.PORT, () => {
    logger.info({ port: env.PORT }, "Server listening");
  });
}

start();
