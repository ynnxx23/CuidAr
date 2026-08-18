import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { API_PREFIX } from './config/constants';
import { env } from './config/env';
import routes from './routes';
import { errorHandler } from './middlewares/error.middleware';
import { notFoundHandler } from './middlewares/notFound.middleware';
import { limitadorGeneral } from './middlewares/rateLimit.middleware';
import { middlewareValidacion } from './middlewares/validation.middleware';
import { middlewareContextoSolicitud } from './middlewares/requestContext.middleware';

const app = express();

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
      },
    },
    crossOriginEmbedderPolicy: env.NODE_ENV === 'production',
    crossOriginOpenerPolicy: env.NODE_ENV === 'production',
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    dnsPrefetchControl: { allow: false },
    frameguard: { action: 'deny' },
    hidePoweredBy: true,
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
    ieNoOpen: true,
    noSniff: true,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    xssFilter: true,
  }),
);

app.use(cors());
app.use(limitadorGeneral);
app.use(middlewareContextoSolicitud);

const parsers = {
  json: { limit: '1mb' },
  urlencoded: { limit: '1mb', extended: true },
};
app.use(express.json(parsers.json));
app.use(express.urlencoded(parsers.urlencoded));
app.use(middlewareValidacion);

app.use(API_PREFIX, routes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
