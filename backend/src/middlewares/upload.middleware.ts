import multer from 'multer';
import path from 'path';
import { Request } from 'express';
import { ValidationError } from '../utils/apiError';

const MAX_TAMANIO_ARCHIVO = 10 * 1024 * 1024;

const MIME_PERMITIDOS: Record<string, string[]> = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/webp': ['.webp'],
  'application/pdf': ['.pdf'],
  'application/msword': ['.doc'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
};

const EXTENSIONES_PELIGROSAS = [
  '.exe',
  '.bat',
  '.cmd',
  '.sh',
  '.bash',
  '.ps1',
  '.vbs',
  '.js',
  '.msi',
  '.com',
  '.scr',
  '.pif',
  '.hta',
  '.cpl',
  '.inf',
  '.reg',
  '.rgs',
];

const storage = multer.memoryStorage();

function filtroArchivos(
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
): void {
  const extension = path.extname(file.originalname).toLowerCase();

  if (EXTENSIONES_PELIGROSAS.includes(extension)) {
    cb(new ValidationError(`Extensión de archivo no permitida: ${extension}`));
    return;
  }

  const mimePermitidos = Object.keys(MIME_PERMITIDOS);
  if (!mimePermitidos.includes(file.mimetype)) {
    cb(new ValidationError(`Tipo MIME no permitido: ${file.mimetype}`));
    return;
  }

  const extensionesValidas = MIME_PERMITIDOS[file.mimetype];
  if (!extensionesValidas || !extensionesValidas.includes(extension)) {
    cb(new ValidationError(`Extensión ${extension} no coincide con el tipo ${file.mimetype}`));
    return;
  }

  cb(null, true);
}

export const uploadMiddleware = multer({
  storage,
  fileFilter: filtroArchivos,
  limits: {
    fileSize: MAX_TAMANIO_ARCHIVO,
    files: 5,
  },
});

export const subidaUnArchivo = uploadMiddleware.single('archivo');
export const subidaMultiplesArchivos = uploadMiddleware.array('archivos', 5);
