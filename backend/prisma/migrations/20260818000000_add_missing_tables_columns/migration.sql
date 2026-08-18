-- CreateTable
CREATE TABLE "areas_medicas" (
    "id" UUID NOT NULL,
    "nombre" VARCHAR(200) NOT NULL,
    "descripcion" TEXT,
    "creado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "areas_medicas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "matriculas" (
    "id" UUID NOT NULL,
    "numero_matricula" VARCHAR(100) NOT NULL,
    "tipo" VARCHAR(50) NOT NULL DEFAULT 'nacional',
    "autoridad_emisora" VARCHAR(200),
    "fecha_emision" DATE,
    "fecha_vencimiento" DATE,
    "archivo_url" VARCHAR(500),
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "doctor_id" UUID NOT NULL,
    "especialidad_id" UUID,
    "creado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "matriculas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "areas_medicas_nombre_key" ON "areas_medicas"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "matriculas_doctor_id_numero_matricula_key" ON "matriculas"("doctor_id", "numero_matricula");

-- AddForeignKey
ALTER TABLE "matriculas" ADD CONSTRAINT "matriculas_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "medicos"("id") ON UPDATE CASCADE ON DELETE RESTRICT;

-- AddForeignKey
ALTER TABLE "matriculas" ADD CONSTRAINT "matriculas_especialidad_id_fkey" FOREIGN KEY ("especialidad_id") REFERENCES "especialidades"("id") ON UPDATE CASCADE ON DELETE SET NULL;

-- AlterTable: Add area_medica_id to hospitales
ALTER TABLE "hospitales" ADD COLUMN "area_medica_id" UUID;

-- AddForeignKey
ALTER TABLE "hospitales" ADD CONSTRAINT "hospitales_area_medica_id_fkey" FOREIGN KEY ("area_medica_id") REFERENCES "areas_medicas"("id") ON UPDATE CASCADE ON DELETE SET NULL;

-- AlterTable: Add area_medica_id to consultorios
ALTER TABLE "consultorios" ADD COLUMN "area_medica_id" UUID;

-- AddForeignKey
ALTER TABLE "consultorios" ADD CONSTRAINT "consultorios_area_medica_id_fkey" FOREIGN KEY ("area_medica_id") REFERENCES "areas_medicas"("id") ON UPDATE CASCADE ON DELETE SET NULL;

-- AlterTable: Add especialidad_padre_id to especialidades
ALTER TABLE "especialidades" ADD COLUMN "especialidad_padre_id" UUID;

-- AddForeignKey
ALTER TABLE "especialidades" ADD CONSTRAINT "especialidades_especialidad_padre_id_fkey" FOREIGN KEY ("especialidad_padre_id") REFERENCES "especialidades"("id") ON UPDATE CASCADE ON DELETE SET NULL;

-- AlterTable: Add eliminado_en to turnos
ALTER TABLE "turnos" ADD COLUMN "eliminado_en" TIMESTAMPTZ(6);

-- AlterTable: Make slot_id nullable (was NOT NULL in original migration)
ALTER TABLE "turnos" ALTER COLUMN "slot_id" DROP NOT NULL;
