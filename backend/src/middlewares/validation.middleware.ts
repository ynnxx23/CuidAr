import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response';
import { ERROR_CODES, HTTP_STATUS } from '../config/constants';

const LIMITE_BODY_JSON = '1mb';
const LIMITE_BODY_URLENCODED = '1mb';
const MAX_LONGITUD_STRING = 5000;
const MAX_PROFUNDIDAD_OBJETO = 10;
const MAX_ARRAY_ITEMS = 100;

const PATRONES_PELIGROSOS = [
  /<script[\s>]/i,
  /javascript:/i,
  /on\w+\s*=/i,
  /data:text\/html/i,
  /vbscript:/i,
  /expression\s*\(/i,
  /\$\{.*\}/,
  /\{\{.*\}\}/,
];

export function sanitizarString(valor: string): string {
  let resultado = valor.trim();
  resultado = resultado
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
  return resultado;
}

export function contienePayloadPeligroso(valor: unknown): boolean {
  if (typeof valor !== 'string') return false;
  return PATRONES_PELIGROSOS.some((patron) => patron.test(valor));
}

function validarProfundidad(objeto: Record<string, unknown>, profundidad: number): boolean {
  if (profundidad > MAX_PROFUNDIDAD_OBJETO) return true;
  for (const clave of Object.keys(objeto)) {
    const valor = objeto[clave];
    if (typeof valor === 'string' && valor.length > MAX_LONGITUD_STRING) return true;
    if (Array.isArray(valor) && valor.length > MAX_ARRAY_ITEMS) return true;
    if (typeof valor === 'object' && valor !== null && !Array.isArray(valor)) {
      if (validarProfundidad(valor as Record<string, unknown>, profundidad + 1)) return true;
    }
  }
  return false;
}

export function sanitizarObjeto(objeto: Record<string, unknown>): Record<string, unknown> {
  const resultado: Record<string, unknown> = {};
  for (const [clave, valor] of Object.entries(objeto)) {
    if (typeof valor === 'string') {
      resultado[clave] = sanitizarString(valor);
    } else if (Array.isArray(valor)) {
      resultado[clave] = valor.map((item) =>
        typeof item === 'object' && item !== null
          ? sanitizarObjeto(item as Record<string, unknown>)
          : typeof item === 'string'
            ? sanitizarString(item)
            : item,
      );
    } else if (typeof valor === 'object' && valor !== null) {
      resultado[clave] = sanitizarObjeto(valor as Record<string, unknown>);
    } else {
      resultado[clave] = valor;
    }
  }
  return resultado;
}

export function middlewareValidacion(req: Request, res: Response, next: NextFunction): void {
  if (req.body && typeof req.body === 'object') {
    if (validarProfundidad(req.body, 0)) {
      sendError(
        res,
        'Estructura de datos excede límites permitidos',
        ERROR_CODES.VALIDATION_ERROR,
        HTTP_STATUS.BAD_REQUEST,
      );
      return;
    }

    const bodyString = JSON.stringify(req.body);
    if (contienePayloadPeligroso(bodyString)) {
      sendError(
        res,
        'Contenido no permitido en la solicitud',
        ERROR_CODES.VALIDATION_ERROR,
        HTTP_STATUS.BAD_REQUEST,
      );
      return;
    }

    req.body = sanitizarObjeto(req.body);
  }

  next();
}

export function configurarBodyParser() {
  return {
    json: { limit: LIMITE_BODY_JSON },
    urlencoded: { limit: LIMITE_BODY_URLENCODED, extended: true },
  };
}
