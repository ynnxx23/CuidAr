/*
  Warnings:

  - You are about to drop the column `description` on the `archivos_medicos` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `archivos_medicos` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `barrios` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `bloques_horarios` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `consultorios` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `consultorios` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `departamentos` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `departamentos` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `departamentos` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `diagnosticos` table. All the data in the column will be lost.
  - You are about to drop the column `content` on the `documentos_legales` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `documentos_legales` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `especialidades` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `especialidades` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `etiquetas_archivos` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `eventos_medicos` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `excepciones_disponibilidad_medico` table. All the data in the column will be lost.
  - You are about to drop the column `message` on the `excepciones_disponibilidad_medico` table. All the data in the column will be lost.
  - You are about to drop the column `reason` on the `historial_estados_turno` table. All the data in the column will be lost.
  - You are about to drop the column `summary` on the `historias_clinicas` table. All the data in the column will be lost.
  - You are about to drop the column `address` on the `hospitales` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `hospitales` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `hospitales` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `hospitales` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `hospitales` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `informes_medicos` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `informes_medicos` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `inscripciones_hospital_paciente` table. All the data in the column will be lost.
  - You are about to drop the column `data` on the `instantaneas_estadisticas` table. All the data in the column will be lost.
  - You are about to drop the column `dose` on the `items_receta` table. All the data in the column will be lost.
  - You are about to drop the column `duration` on the `items_receta` table. All the data in the column will be lost.
  - You are about to drop the column `frequency` on the `items_receta` table. All the data in the column will be lost.
  - You are about to drop the column `instructions` on the `items_receta` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `lista_espera_turnos` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `localidades` table. All the data in the column will be lost.
  - You are about to drop the column `bio` on the `medicos` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `medicos` table. All the data in the column will be lost.
  - You are about to drop the column `body` on the `notificaciones` table. All the data in the column will be lost.
  - You are about to drop the column `channel` on the `notificaciones` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `notificaciones` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `notificaciones` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `observaciones_clinicas` table. All the data in the column will be lost.
  - You are about to drop the column `allergies` on the `pacientes` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `paises` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `perfiles_personal` table. All the data in the column will be lost.
  - You are about to drop the column `action` on the `permisos` table. All the data in the column will be lost.
  - You are about to drop the column `code` on the `permisos` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `permisos` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `permisos` table. All the data in the column will be lost.
  - You are about to drop the column `resource` on the `permisos` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `provincias` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `recetas` table. All the data in the column will be lost.
  - You are about to drop the column `summary` on the `recetas` table. All the data in the column will be lost.
  - You are about to drop the column `action` on the `registros_auditoria` table. All the data in the column will be lost.
  - You are about to drop the column `metadata` on the `registros_auditoria` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `reportes` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `reportes` table. All the data in the column will be lost.
  - You are about to drop the column `code` on the `roles` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `roles` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `roles` table. All the data in the column will be lost.
  - You are about to drop the column `height` on the `signos_vitales` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `signos_vitales` table. All the data in the column will be lost.
  - You are about to drop the column `temperature` on the `signos_vitales` table. All the data in the column will be lost.
  - You are about to drop the column `weight` on the `signos_vitales` table. All the data in the column will be lost.
  - You are about to drop the column `address` on the `sucursales_hospital` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `sucursales_hospital` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `sucursales_hospital` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `sucursales_hospital` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `sucursales_hospital` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `tratamientos` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `tratamientos` table. All the data in the column will be lost.
  - You are about to drop the column `mode` on the `turnos` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `turnos` table. All the data in the column will be lost.
  - You are about to drop the column `reason` on the `turnos` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `turnos` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `usuarios` table. All the data in the column will be lost.
  - You are about to drop the column `gender` on the `usuarios` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `usuarios` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `usuarios` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `verificaciones_identidad` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `verificaciones_identidad` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[locality_id,nombre]` on the table `barrios` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[hospital_id,nombre]` on the table `departamentos` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nombre]` on the table `especialidades` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nombre]` on the table `etiquetas_archivos` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[province_id,nombre]` on the table `localidades` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nombre]` on the table `paises` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[codigo]` on the table `permisos` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[country_id,nombre]` on the table `provincias` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[codigo]` on the table `roles` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[correoElectronico]` on the table `usuarios` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `nombre` to the `barrios` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nombre` to the `consultorios` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nombre` to the `departamentos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contenido` to the `documentos_legales` table without a default value. This is not possible if the table is not empty.
  - Added the required column `titulo` to the `documentos_legales` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nombre` to the `especialidades` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nombre` to the `etiquetas_archivos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fecha` to the `excepciones_disponibilidad_medico` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nombre` to the `hospitales` table without a default value. This is not possible if the table is not empty.
  - Added the required column `titulo` to the `informes_medicos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nombre` to the `localidades` table without a default value. This is not possible if the table is not empty.
  - Added the required column `canal` to the `notificaciones` table without a default value. This is not possible if the table is not empty.
  - Added the required column `titulo` to the `notificaciones` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nombre` to the `paises` table without a default value. This is not possible if the table is not empty.
  - Added the required column `accion` to the `permisos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `codigo` to the `permisos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nombre` to the `permisos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recurso` to the `permisos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nombre` to the `provincias` table without a default value. This is not possible if the table is not empty.
  - Added the required column `accion` to the `registros_auditoria` table without a default value. This is not possible if the table is not empty.
  - Added the required column `titulo` to the `reportes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `codigo` to the `roles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nombre` to the `roles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nombre` to the `sucursales_hospital` table without a default value. This is not possible if the table is not empty.
  - Added the required column `modo` to the `turnos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `correoElectronico` to the `usuarios` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "barrios_locality_id_name_key";

-- DropIndex
DROP INDEX "departamentos_hospital_id_name_key";

-- DropIndex
DROP INDEX "especialidades_name_key";

-- DropIndex
DROP INDEX "etiquetas_archivos_name_key";

-- DropIndex
DROP INDEX "localidades_province_id_name_key";

-- DropIndex
DROP INDEX "paises_name_key";

-- DropIndex
DROP INDEX "permisos_code_key";

-- DropIndex
DROP INDEX "provincias_country_id_name_key";

-- DropIndex
DROP INDEX "roles_code_key";

-- DropIndex
DROP INDEX "usuarios_email_idx";

-- DropIndex
DROP INDEX "usuarios_email_key";

-- DropIndex
DROP INDEX "usuarios_status_idx";

-- AlterTable
ALTER TABLE "archivos_medicos" DROP COLUMN "description",
DROP COLUMN "title",
ADD COLUMN     "descripcion" TEXT,
ADD COLUMN     "titulo" VARCHAR(200);

-- AlterTable
ALTER TABLE "barrios" DROP COLUMN "name",
ADD COLUMN     "nombre" VARCHAR(120) NOT NULL;

-- AlterTable
ALTER TABLE "bloques_horarios" DROP COLUMN "status",
ADD COLUMN     "estado" "appointment_status" NOT NULL DEFAULT 'disponible';

-- AlterTable
ALTER TABLE "consultorios" DROP COLUMN "name",
DROP COLUMN "status",
ADD COLUMN     "estado" VARCHAR(30) NOT NULL DEFAULT 'active',
ADD COLUMN     "nombre" VARCHAR(100) NOT NULL;

-- AlterTable
ALTER TABLE "departamentos" DROP COLUMN "description",
DROP COLUMN "name",
DROP COLUMN "status",
ADD COLUMN     "descripcion" TEXT,
ADD COLUMN     "estado" VARCHAR(30) NOT NULL DEFAULT 'active',
ADD COLUMN     "nombre" VARCHAR(100) NOT NULL;

-- AlterTable
ALTER TABLE "diagnosticos" DROP COLUMN "description",
ADD COLUMN     "descripcion" TEXT;

-- AlterTable
ALTER TABLE "documentos_legales" DROP COLUMN "content",
DROP COLUMN "title",
ADD COLUMN     "contenido" TEXT NOT NULL,
ADD COLUMN     "titulo" VARCHAR(200) NOT NULL;

-- AlterTable
ALTER TABLE "especialidades" DROP COLUMN "description",
DROP COLUMN "name",
ADD COLUMN     "descripcion" TEXT,
ADD COLUMN     "nombre" VARCHAR(100) NOT NULL;

-- AlterTable
ALTER TABLE "etiquetas_archivos" DROP COLUMN "name",
ADD COLUMN     "nombre" VARCHAR(60) NOT NULL;

-- AlterTable
ALTER TABLE "eventos_medicos" DROP COLUMN "description",
ADD COLUMN     "descripcion" TEXT;

-- AlterTable
ALTER TABLE "excepciones_disponibilidad_medico" DROP COLUMN "date",
DROP COLUMN "message",
ADD COLUMN     "fecha" DATE NOT NULL,
ADD COLUMN     "mensaje" TEXT;

-- AlterTable
ALTER TABLE "historial_estados_turno" DROP COLUMN "reason",
ADD COLUMN     "motivo" TEXT;

-- AlterTable
ALTER TABLE "historias_clinicas" DROP COLUMN "summary",
ADD COLUMN     "resumen" TEXT;

-- AlterTable
ALTER TABLE "hospitales" DROP COLUMN "address",
DROP COLUMN "email",
DROP COLUMN "name",
DROP COLUMN "phone",
DROP COLUMN "status",
ADD COLUMN     "correoElectronico" VARCHAR(255),
ADD COLUMN     "direccion" TEXT,
ADD COLUMN     "estado" VARCHAR(30) NOT NULL DEFAULT 'active',
ADD COLUMN     "nombre" VARCHAR(200) NOT NULL,
ADD COLUMN     "telefono" VARCHAR(30);

-- AlterTable
ALTER TABLE "informes_medicos" DROP COLUMN "description",
DROP COLUMN "title",
ADD COLUMN     "descripcion" TEXT,
ADD COLUMN     "titulo" VARCHAR(200) NOT NULL;

-- AlterTable
ALTER TABLE "inscripciones_hospital_paciente" DROP COLUMN "status",
ADD COLUMN     "estado" VARCHAR(30) NOT NULL DEFAULT 'active';

-- AlterTable
ALTER TABLE "instantaneas_estadisticas" DROP COLUMN "data",
ADD COLUMN     "datos" JSONB;

-- AlterTable
ALTER TABLE "items_receta" DROP COLUMN "dose",
DROP COLUMN "duration",
DROP COLUMN "frequency",
DROP COLUMN "instructions",
ADD COLUMN     "dosis" VARCHAR(100),
ADD COLUMN     "duracion" VARCHAR(100),
ADD COLUMN     "frecuencia" VARCHAR(100),
ADD COLUMN     "instrucciones" TEXT;

-- AlterTable
ALTER TABLE "lista_espera_turnos" DROP COLUMN "status",
ADD COLUMN     "estado" VARCHAR(30) NOT NULL DEFAULT 'waiting';

-- AlterTable
ALTER TABLE "localidades" DROP COLUMN "name",
ADD COLUMN     "nombre" VARCHAR(120) NOT NULL;

-- AlterTable
ALTER TABLE "medicos" DROP COLUMN "bio",
DROP COLUMN "notes",
ADD COLUMN     "biografia" TEXT,
ADD COLUMN     "notas" TEXT;

-- AlterTable
ALTER TABLE "notificaciones" DROP COLUMN "body",
DROP COLUMN "channel",
DROP COLUMN "status",
DROP COLUMN "title",
ADD COLUMN     "canal" "notification_channel" NOT NULL,
ADD COLUMN     "cuerpo" TEXT,
ADD COLUMN     "estado" "notification_status" NOT NULL DEFAULT 'pendiente',
ADD COLUMN     "titulo" VARCHAR(200) NOT NULL;

-- AlterTable
ALTER TABLE "observaciones_clinicas" DROP COLUMN "description",
ADD COLUMN     "descripcion" TEXT;

-- AlterTable
ALTER TABLE "pacientes" DROP COLUMN "allergies",
ADD COLUMN     "alergias" TEXT;

-- AlterTable
ALTER TABLE "paises" DROP COLUMN "name",
ADD COLUMN     "nombre" VARCHAR(100) NOT NULL;

-- AlterTable
ALTER TABLE "perfiles_personal" DROP COLUMN "notes",
ADD COLUMN     "notas" TEXT;

-- AlterTable
ALTER TABLE "permisos" DROP COLUMN "action",
DROP COLUMN "code",
DROP COLUMN "description",
DROP COLUMN "name",
DROP COLUMN "resource",
ADD COLUMN     "accion" VARCHAR(80) NOT NULL,
ADD COLUMN     "codigo" VARCHAR(120) NOT NULL,
ADD COLUMN     "descripcion" TEXT,
ADD COLUMN     "nombre" VARCHAR(100) NOT NULL,
ADD COLUMN     "recurso" VARCHAR(80) NOT NULL;

-- AlterTable
ALTER TABLE "provincias" DROP COLUMN "name",
ADD COLUMN     "nombre" VARCHAR(100) NOT NULL;

-- AlterTable
ALTER TABLE "recetas" DROP COLUMN "status",
DROP COLUMN "summary",
ADD COLUMN     "estado" VARCHAR(30) NOT NULL DEFAULT 'active',
ADD COLUMN     "resumen" TEXT;

-- AlterTable
ALTER TABLE "registros_auditoria" DROP COLUMN "action",
DROP COLUMN "metadata",
ADD COLUMN     "accion" VARCHAR(120) NOT NULL,
ADD COLUMN     "metadatos" JSONB;

-- AlterTable
ALTER TABLE "reportes" DROP COLUMN "description",
DROP COLUMN "title",
ADD COLUMN     "descripcion" TEXT,
ADD COLUMN     "titulo" VARCHAR(200) NOT NULL;

-- AlterTable
ALTER TABLE "roles" DROP COLUMN "code",
DROP COLUMN "description",
DROP COLUMN "name",
ADD COLUMN     "codigo" VARCHAR(60) NOT NULL,
ADD COLUMN     "descripcion" TEXT,
ADD COLUMN     "nombre" VARCHAR(100) NOT NULL;

-- AlterTable
ALTER TABLE "signos_vitales" DROP COLUMN "height",
DROP COLUMN "notes",
DROP COLUMN "temperature",
DROP COLUMN "weight",
ADD COLUMN     "altura" DECIMAL(6,2),
ADD COLUMN     "notas" TEXT,
ADD COLUMN     "peso" DECIMAL(6,2),
ADD COLUMN     "temperatura" DECIMAL(4,1);

-- AlterTable
ALTER TABLE "sucursales_hospital" DROP COLUMN "address",
DROP COLUMN "email",
DROP COLUMN "name",
DROP COLUMN "phone",
DROP COLUMN "status",
ADD COLUMN     "correoElectronico" VARCHAR(255),
ADD COLUMN     "direccion" TEXT,
ADD COLUMN     "estado" VARCHAR(30) NOT NULL DEFAULT 'active',
ADD COLUMN     "nombre" VARCHAR(200) NOT NULL,
ADD COLUMN     "telefono" VARCHAR(30);

-- AlterTable
ALTER TABLE "tratamientos" DROP COLUMN "description",
DROP COLUMN "status",
ADD COLUMN     "descripcion" TEXT,
ADD COLUMN     "estado" VARCHAR(30) NOT NULL DEFAULT 'active';

-- AlterTable
ALTER TABLE "turnos" DROP COLUMN "mode",
DROP COLUMN "notes",
DROP COLUMN "reason",
DROP COLUMN "status",
ADD COLUMN     "estado" "appointment_status" NOT NULL DEFAULT 'reservado',
ADD COLUMN     "modo" "appointment_mode" NOT NULL,
ADD COLUMN     "motivo" TEXT,
ADD COLUMN     "notas" TEXT;

-- AlterTable
ALTER TABLE "usuarios" DROP COLUMN "email",
DROP COLUMN "gender",
DROP COLUMN "phone",
DROP COLUMN "status",
ADD COLUMN     "correoElectronico" VARCHAR(255) NOT NULL,
ADD COLUMN     "estado" "user_status" NOT NULL DEFAULT 'verificacion_pendiente',
ADD COLUMN     "genero" VARCHAR(30),
ADD COLUMN     "telefono" VARCHAR(30);

-- AlterTable
ALTER TABLE "verificaciones_identidad" DROP COLUMN "notes",
DROP COLUMN "status",
ADD COLUMN     "estado" "verification_status" NOT NULL DEFAULT 'pendiente',
ADD COLUMN     "notas" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "barrios_locality_id_nombre_key" ON "barrios"("locality_id", "nombre");

-- CreateIndex
CREATE UNIQUE INDEX "departamentos_hospital_id_nombre_key" ON "departamentos"("hospital_id", "nombre");

-- CreateIndex
CREATE UNIQUE INDEX "especialidades_nombre_key" ON "especialidades"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "etiquetas_archivos_nombre_key" ON "etiquetas_archivos"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "localidades_province_id_nombre_key" ON "localidades"("province_id", "nombre");

-- CreateIndex
CREATE UNIQUE INDEX "paises_nombre_key" ON "paises"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "permisos_codigo_key" ON "permisos"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "provincias_country_id_nombre_key" ON "provincias"("country_id", "nombre");

-- CreateIndex
CREATE UNIQUE INDEX "roles_codigo_key" ON "roles"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_correoElectronico_key" ON "usuarios"("correoElectronico");

-- CreateIndex
CREATE INDEX "usuarios_correoElectronico_idx" ON "usuarios"("correoElectronico");

-- CreateIndex
CREATE INDEX "usuarios_estado_idx" ON "usuarios"("estado");
