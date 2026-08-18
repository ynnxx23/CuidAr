-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "user_status" AS ENUM ('activo', 'inactivo', 'suspendido', 'verificacion_pendiente', 'eliminado');

-- CreateEnum
CREATE TYPE "hospital_type" AS ENUM ('publico', 'privado', 'clinica', 'centro_salud', 'laboratorio', 'otro');

-- CreateEnum
CREATE TYPE "appointment_status" AS ENUM ('disponible', 'reservado', 'confirmado', 'en_curso', 'atendido', 'cancelado', 'ausente', 'reprogramado', 'bloqueado');

-- CreateEnum
CREATE TYPE "appointment_mode" AS ENUM ('presencial', 'virtual', 'seguimiento', 'emergencia');

-- CreateEnum
CREATE TYPE "doctor_work_state" AS ENUM ('disponible', 'atendiendo', 'retrasado', 'ausente', 'fuera_servicio', 'no_disponible');

-- CreateEnum
CREATE TYPE "verification_status" AS ENUM ('pendiente', 'verificado', 'rechazado', 'expirado');

-- CreateEnum
CREATE TYPE "file_type" AS ENUM ('receta', 'analisis', 'radiografia', 'tomografia', 'resonancia', 'certificado', 'informe', 'imagen', 'pdf', 'otro');

-- CreateEnum
CREATE TYPE "notification_channel" AS ENUM ('correo', 'push');

-- CreateEnum
CREATE TYPE "notification_status" AS ENUM ('pendiente', 'enviado', 'entregado', 'leido', 'fallido');

-- CreateEnum
CREATE TYPE "consent_type" AS ENUM ('terminos', 'privacidad', 'autorizacion_medica', 'compartir_datos', 'aviso_legal');

-- CreateEnum
CREATE TYPE "source_type" AS ENUM ('paciente', 'medico', 'personal', 'sistema');

-- CreateTable
CREATE TABLE "usuarios" (
    "id" UUID NOT NULL,
    "dni" VARCHAR(20) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "hash_contrasena" VARCHAR(255) NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "apellido" VARCHAR(100) NOT NULL,
    "phone" VARCHAR(30),
    "fecha_nacimiento" DATE,
    "gender" VARCHAR(30),
    "status" "user_status" NOT NULL DEFAULT 'verificacion_pendiente',
    "verificado_correo_en" TIMESTAMPTZ,
    "verificado_identidad_en" TIMESTAMPTZ,
    "creado_en" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMPTZ NOT NULL,
    "eliminado_en" TIMESTAMPTZ,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" UUID NOT NULL,
    "code" VARCHAR(60) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "creado_en" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permisos" (
    "id" UUID NOT NULL,
    "code" VARCHAR(120) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "resource" VARCHAR(80) NOT NULL,
    "action" VARCHAR(80) NOT NULL,
    "creado_en" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "permisos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuarios_roles" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "role_id" UUID NOT NULL,
    "hospital_id" UUID,
    "department_id" UUID,
    "creado_en" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuarios_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles_permisos" (
    "id" UUID NOT NULL,
    "role_id" UUID NOT NULL,
    "permission_id" UUID NOT NULL,
    "creado_en" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "roles_permisos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sesiones" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "nombre_dispositivo" VARCHAR(100),
    "so_dispositivo" VARCHAR(50),
    "modelo_dispositivo" VARCHAR(100),
    "nombre_navegador" VARCHAR(100),
    "direccion_ip" VARCHAR(45),
    "hash_token_actualizacion" VARCHAR(255) NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "ultima_actividad_en" TIMESTAMPTZ,
    "creado_en" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revocado_en" TIMESTAMPTZ,

    CONSTRAINT "sesiones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verificaciones_identidad" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "tipo_verificacion" VARCHAR(80) NOT NULL,
    "status" "verification_status" NOT NULL DEFAULT 'pendiente',
    "datos_enviados" JSONB,
    "verificado_por" UUID,
    "verificado_en" TIMESTAMPTZ,
    "notes" TEXT,
    "creado_en" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "verificaciones_identidad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "registros_auditoria" (
    "id" UUID NOT NULL,
    "actor_user_id" UUID,
    "action" VARCHAR(120) NOT NULL,
    "resource_type" VARCHAR(120) NOT NULL,
    "resource_id" UUID,
    "metadata" JSONB,
    "direccion_ip" VARCHAR(45),
    "agente_usuario" TEXT,
    "creado_en" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "registros_auditoria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "paises" (
    "id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "codigo_iso" VARCHAR(10),
    "creado_en" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "paises_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "provincias" (
    "id" UUID NOT NULL,
    "country_id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "codigo_iso" VARCHAR(10),
    "creado_en" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "provincias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "localidades" (
    "id" UUID NOT NULL,
    "province_id" UUID NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "creado_en" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "localidades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "barrios" (
    "id" UUID NOT NULL,
    "locality_id" UUID NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "creado_en" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "barrios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hospitales" (
    "id" UUID NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "tipo_hospital" "hospital_type" NOT NULL,
    "codigo_interno" VARCHAR(50),
    "email" VARCHAR(255),
    "phone" VARCHAR(30),
    "address" TEXT,
    "province_id" UUID NOT NULL,
    "locality_id" UUID NOT NULL,
    "neighborhood_id" UUID,
    "status" VARCHAR(30) NOT NULL DEFAULT 'active',
    "creado_en" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMPTZ NOT NULL,
    "eliminado_en" TIMESTAMPTZ,

    CONSTRAINT "hospitales_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sucursales_hospital" (
    "id" UUID NOT NULL,
    "hospital_id" UUID NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "address" TEXT,
    "phone" VARCHAR(30),
    "email" VARCHAR(255),
    "status" VARCHAR(30) NOT NULL DEFAULT 'active',
    "creado_en" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "sucursales_hospital_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "departamentos" (
    "id" UUID NOT NULL,
    "hospital_id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "status" VARCHAR(30) NOT NULL DEFAULT 'active',
    "creado_en" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "departamentos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "consultorios" (
    "id" UUID NOT NULL,
    "hospital_id" UUID NOT NULL,
    "department_id" UUID,
    "name" VARCHAR(100) NOT NULL,
    "codigo_consultorio" VARCHAR(30),
    "status" VARCHAR(30) NOT NULL DEFAULT 'active',
    "creado_en" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "consultorios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "especialidades" (
    "id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "creado_en" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "especialidades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "especialidades_hospital" (
    "id" UUID NOT NULL,
    "hospital_id" UUID NOT NULL,
    "specialty_id" UUID NOT NULL,
    "department_id" UUID,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "creado_en" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "especialidades_hospital_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pacientes" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "tipo_sangre" VARCHAR(10),
    "allergies" TEXT,
    "condiciones_cronicas" TEXT,
    "medicacion_actual" TEXT,
    "contacto_emergencia_nombre" VARCHAR(100),
    "contacto_emergencia_telefono" VARCHAR(30),
    "notas_medicas" TEXT,
    "creado_en" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "pacientes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tutores" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "notas_relacion" TEXT,
    "creado_en" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "tutores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pacientes_tutores" (
    "id" UUID NOT NULL,
    "patient_id" UUID NOT NULL,
    "guardian_user_id" UUID NOT NULL,
    "tipo_relacion" VARCHAR(80) NOT NULL,
    "estado_autorizacion" "verification_status" NOT NULL DEFAULT 'pendiente',
    "creado_en" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "pacientes_tutores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inscripciones_hospital_paciente" (
    "id" UUID NOT NULL,
    "patient_id" UUID NOT NULL,
    "hospital_id" UUID NOT NULL,
    "status" VARCHAR(30) NOT NULL DEFAULT 'active',
    "creado_en" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "inscripciones_hospital_paciente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "relaciones_atencion_paciente" (
    "id" UUID NOT NULL,
    "patient_id" UUID NOT NULL,
    "doctor_id" UUID NOT NULL,
    "hospital_id" UUID NOT NULL,
    "tipo_relacion" VARCHAR(80) NOT NULL,
    "principal" BOOLEAN NOT NULL DEFAULT false,
    "creado_en" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "relaciones_atencion_paciente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "perfiles_personal" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "tipo_personal" VARCHAR(80) NOT NULL,
    "notes" TEXT,
    "creado_en" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "perfiles_personal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "asignaciones_personal" (
    "id" UUID NOT NULL,
    "staff_profile_id" UUID NOT NULL,
    "hospital_id" UUID NOT NULL,
    "department_id" UUID,
    "etiqueta_rol" VARCHAR(100) NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "creado_en" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "asignaciones_personal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medicos" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "numero_matricula" VARCHAR(100) NOT NULL,
    "bio" TEXT,
    "estado_laboral" "doctor_work_state" NOT NULL DEFAULT 'disponible',
    "notes" TEXT,
    "creado_en" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "medicos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "especialidades_medico" (
    "id" UUID NOT NULL,
    "doctor_id" UUID NOT NULL,
    "specialty_id" UUID NOT NULL,
    "principal" BOOLEAN NOT NULL DEFAULT false,
    "creado_en" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "especialidades_medico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hospitales_medico" (
    "id" UUID NOT NULL,
    "doctor_id" UUID NOT NULL,
    "hospital_id" UUID NOT NULL,
    "department_id" UUID,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "creado_en" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "hospitales_medico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reglas_disponibilidad_medico" (
    "id" UUID NOT NULL,
    "doctor_id" UUID NOT NULL,
    "hospital_id" UUID NOT NULL,
    "department_id" UUID,
    "dia_semana" INTEGER NOT NULL,
    "hora_inicio" TIME NOT NULL,
    "hora_fin" TIME NOT NULL,
    "duracion_bloque_minutos" INTEGER NOT NULL,
    "minutos_descanso" INTEGER NOT NULL DEFAULT 0,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "creado_en" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "reglas_disponibilidad_medico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "excepciones_disponibilidad_medico" (
    "id" UUID NOT NULL,
    "doctor_id" UUID NOT NULL,
    "hospital_id" UUID NOT NULL,
    "date" DATE NOT NULL,
    "tipo_excepcion" VARCHAR(80) NOT NULL,
    "hora_inicio" TIME,
    "hora_fin" TIME,
    "message" TEXT,
    "creado_en" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "excepciones_disponibilidad_medico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bloques_horarios" (
    "id" UUID NOT NULL,
    "doctor_id" UUID NOT NULL,
    "hospital_id" UUID NOT NULL,
    "department_id" UUID,
    "specialty_id" UUID NOT NULL,
    "consultorio_id" UUID,
    "regla_disponibilidad_id" UUID,
    "fecha_bloque" DATE NOT NULL,
    "hora_inicio" TIME NOT NULL,
    "hora_fin" TIME NOT NULL,
    "status" "appointment_status" NOT NULL DEFAULT 'disponible',
    "creado_en" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "bloques_horarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "turnos" (
    "id" UUID NOT NULL,
    "slot_id" UUID NOT NULL,
    "hospital_id" UUID NOT NULL,
    "doctor_id" UUID NOT NULL,
    "patient_id" UUID,
    "specialty_id" UUID NOT NULL,
    "consultorio_id" UUID,
    "creado_por_usuario_id" UUID NOT NULL,
    "fecha_turno" DATE NOT NULL,
    "hora_inicio" TIME NOT NULL,
    "hora_fin" TIME NOT NULL,
    "mode" "appointment_mode" NOT NULL,
    "status" "appointment_status" NOT NULL DEFAULT 'reservado',
    "reason" TEXT,
    "notes" TEXT,
    "confirmacion_enviada_en" TIMESTAMPTZ,
    "confirmado_en" TIMESTAMPTZ,
    "cancelado_en" TIMESTAMPTZ,
    "creado_en" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "turnos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "historial_estados_turno" (
    "id" UUID NOT NULL,
    "appointment_id" UUID NOT NULL,
    "estado_anterior" VARCHAR(30),
    "estado_nuevo" VARCHAR(30) NOT NULL,
    "cambiado_por_usuario_id" UUID,
    "reason" TEXT,
    "creado_en" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "historial_estados_turno_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documentos_turno" (
    "id" UUID NOT NULL,
    "appointment_id" UUID NOT NULL,
    "archivo_id" UUID NOT NULL,
    "tipo_documento" VARCHAR(80) NOT NULL,
    "creado_en" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "documentos_turno_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lista_espera_turnos" (
    "id" UUID NOT NULL,
    "hospital_id" UUID NOT NULL,
    "doctor_id" UUID NOT NULL,
    "patient_id" UUID NOT NULL,
    "specialty_id" UUID NOT NULL,
    "fecha_preferida" DATE,
    "status" VARCHAR(30) NOT NULL DEFAULT 'waiting',
    "creado_en" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lista_espera_turnos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "historias_clinicas" (
    "id" UUID NOT NULL,
    "patient_id" UUID NOT NULL,
    "medico_principal_id" UUID,
    "hospital_id" UUID,
    "summary" TEXT,
    "creado_en" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "historias_clinicas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eventos_medicos" (
    "id" UUID NOT NULL,
    "medical_record_id" UUID NOT NULL,
    "patient_id" UUID NOT NULL,
    "doctor_id" UUID,
    "hospital_id" UUID,
    "appointment_id" UUID,
    "tipo_evento" VARCHAR(80) NOT NULL,
    "titulo" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "fecha_evento" TIMESTAMPTZ NOT NULL,
    "creado_por_usuario_id" UUID NOT NULL,
    "creado_en" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "eventos_medicos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "diagnosticos" (
    "id" UUID NOT NULL,
    "medical_event_id" UUID,
    "medical_record_id" UUID NOT NULL,
    "patient_id" UUID NOT NULL,
    "doctor_id" UUID NOT NULL,
    "hospital_id" UUID NOT NULL,
    "codigo_diagnostico" VARCHAR(50),
    "description" TEXT,
    "tipo_diagnostico" VARCHAR(50) NOT NULL DEFAULT 'presumptive',
    "creado_en" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "diagnosticos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tratamientos" (
    "id" UUID NOT NULL,
    "medical_event_id" UUID,
    "medical_record_id" UUID NOT NULL,
    "patient_id" UUID NOT NULL,
    "doctor_id" UUID NOT NULL,
    "hospital_id" UUID NOT NULL,
    "description" TEXT,
    "fecha_inicio" DATE,
    "fecha_fin" DATE,
    "status" VARCHAR(30) NOT NULL DEFAULT 'active',
    "creado_en" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "tratamientos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "observaciones_clinicas" (
    "id" UUID NOT NULL,
    "medical_event_id" UUID,
    "medical_record_id" UUID NOT NULL,
    "patient_id" UUID NOT NULL,
    "doctor_id" UUID,
    "staff_profile_id" UUID,
    "hospital_id" UUID NOT NULL,
    "description" TEXT,
    "creado_en" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "observaciones_clinicas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "signos_vitales" (
    "id" UUID NOT NULL,
    "medical_event_id" UUID,
    "medical_record_id" UUID NOT NULL,
    "patient_id" UUID NOT NULL,
    "staff_profile_id" UUID,
    "doctor_id" UUID,
    "hospital_id" UUID NOT NULL,
    "presion_arterial" VARCHAR(20),
    "frecuencia_cardiaca" INTEGER,
    "temperature" DECIMAL(4,1),
    "saturacion_oxigeno" DECIMAL(5,2),
    "weight" DECIMAL(6,2),
    "height" DECIMAL(6,2),
    "notes" TEXT,
    "creado_en" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "signos_vitales_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "archivos_medicos" (
    "id" UUID NOT NULL,
    "patient_id" UUID NOT NULL,
    "medical_record_id" UUID,
    "hospital_id" UUID,
    "medical_event_id" UUID,
    "subido_por_usuario_id" UUID NOT NULL,
    "file_type" "file_type" NOT NULL,
    "title" VARCHAR(200),
    "description" TEXT,
    "url_archivo" TEXT NOT NULL,
    "proveedor_almacenamiento" VARCHAR(50) NOT NULL DEFAULT 'firebase',
    "source_type" "source_type" NOT NULL,
    "validado" BOOLEAN NOT NULL DEFAULT false,
    "validado_por_usuario_id" UUID,
    "validado_en" TIMESTAMPTZ,
    "creado_en" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "archivos_medicos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "etiquetas_archivos" (
    "id" UUID NOT NULL,
    "name" VARCHAR(60) NOT NULL,
    "creado_en" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "etiquetas_archivos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "etiquetas_archivo_medico" (
    "id" UUID NOT NULL,
    "medical_file_id" UUID NOT NULL,
    "file_tag_id" UUID NOT NULL,

    CONSTRAINT "etiquetas_archivo_medico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recetas" (
    "id" UUID NOT NULL,
    "medical_event_id" UUID,
    "medical_record_id" UUID NOT NULL,
    "patient_id" UUID NOT NULL,
    "doctor_id" UUID NOT NULL,
    "hospital_id" UUID NOT NULL,
    "issued_by_user_id" UUID NOT NULL,
    "summary" TEXT,
    "status" VARCHAR(30) NOT NULL DEFAULT 'active',
    "creado_en" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "recetas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "items_receta" (
    "id" UUID NOT NULL,
    "prescription_id" UUID NOT NULL,
    "nombre_medicamento" VARCHAR(200) NOT NULL,
    "dose" VARCHAR(100),
    "frequency" VARCHAR(100),
    "duration" VARCHAR(100),
    "instructions" TEXT,
    "creado_en" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "items_receta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "informes_medicos" (
    "id" UUID NOT NULL,
    "medical_event_id" UUID,
    "medical_record_id" UUID NOT NULL,
    "patient_id" UUID NOT NULL,
    "doctor_id" UUID,
    "hospital_id" UUID NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "archivo_id" UUID,
    "creado_en" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "informes_medicos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notificaciones" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "appointment_id" UUID,
    "doctor_id" UUID,
    "hospital_id" UUID,
    "channel" "notification_channel" NOT NULL,
    "status" "notification_status" NOT NULL DEFAULT 'pendiente',
    "title" VARCHAR(200) NOT NULL,
    "body" TEXT,
    "enviado_en" TIMESTAMPTZ,
    "leido_en" TIMESTAMPTZ,
    "creado_en" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notificaciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "preferencias_notificacion" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "correo_habilitado" BOOLEAN NOT NULL DEFAULT true,
    "push_habilitado" BOOLEAN NOT NULL DEFAULT true,
    "recordatorios_turno_habilitados" BOOLEAN NOT NULL DEFAULT true,
    "alertas_retraso_habilitadas" BOOLEAN NOT NULL DEFAULT true,
    "alertas_cancelacion_habilitadas" BOOLEAN NOT NULL DEFAULT true,
    "creado_en" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "preferencias_notificacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documentos_legales" (
    "id" UUID NOT NULL,
    "tipo_documento" VARCHAR(80) NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "content" TEXT NOT NULL,
    "version" VARCHAR(20) NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "creado_en" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "documentos_legales_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "registros_consentimiento" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "legal_document_id" UUID NOT NULL,
    "consent_type" "consent_type" NOT NULL,
    "aceptado_en" TIMESTAMPTZ NOT NULL,
    "direccion_ip" VARCHAR(45),
    "creado_en" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "registros_consentimiento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "instantaneas_estadisticas" (
    "id" UUID NOT NULL,
    "hospital_id" UUID,
    "province_id" UUID,
    "locality_id" UUID,
    "fecha_instantanea" DATE NOT NULL,
    "data" JSONB,
    "creado_en" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "instantaneas_estadisticas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reportes" (
    "id" UUID NOT NULL,
    "creado_por_usuario_id" UUID NOT NULL,
    "hospital_id" UUID,
    "tipo_reporte" VARCHAR(80) NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "url_archivo" TEXT,
    "creado_en" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reportes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_dni_key" ON "usuarios"("dni");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE INDEX "usuarios_email_idx" ON "usuarios"("email");

-- CreateIndex
CREATE INDEX "usuarios_dni_idx" ON "usuarios"("dni");

-- CreateIndex
CREATE INDEX "usuarios_status_idx" ON "usuarios"("status");

-- CreateIndex
CREATE UNIQUE INDEX "roles_code_key" ON "roles"("code");

-- CreateIndex
CREATE UNIQUE INDEX "permisos_code_key" ON "permisos"("code");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_roles_user_id_role_id_hospital_id_department_id_key" ON "usuarios_roles"("user_id", "role_id", "hospital_id", "department_id");

-- CreateIndex
CREATE UNIQUE INDEX "roles_permisos_role_id_permission_id_key" ON "roles_permisos"("role_id", "permission_id");

-- CreateIndex
CREATE INDEX "sesiones_user_id_idx" ON "sesiones"("user_id");

-- CreateIndex
CREATE INDEX "sesiones_activo_idx" ON "sesiones"("activo");

-- CreateIndex
CREATE INDEX "registros_auditoria_actor_user_id_idx" ON "registros_auditoria"("actor_user_id");

-- CreateIndex
CREATE INDEX "registros_auditoria_resource_type_idx" ON "registros_auditoria"("resource_type");

-- CreateIndex
CREATE INDEX "registros_auditoria_creado_en_idx" ON "registros_auditoria"("creado_en");

-- CreateIndex
CREATE UNIQUE INDEX "paises_name_key" ON "paises"("name");

-- CreateIndex
CREATE UNIQUE INDEX "paises_codigo_iso_key" ON "paises"("codigo_iso");

-- CreateIndex
CREATE UNIQUE INDEX "provincias_country_id_name_key" ON "provincias"("country_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "localidades_province_id_name_key" ON "localidades"("province_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "barrios_locality_id_name_key" ON "barrios"("locality_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "hospitales_codigo_interno_key" ON "hospitales"("codigo_interno");

-- CreateIndex
CREATE INDEX "hospitales_province_id_idx" ON "hospitales"("province_id");

-- CreateIndex
CREATE INDEX "hospitales_locality_id_idx" ON "hospitales"("locality_id");

-- CreateIndex
CREATE UNIQUE INDEX "departamentos_hospital_id_name_key" ON "departamentos"("hospital_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "especialidades_name_key" ON "especialidades"("name");

-- CreateIndex
CREATE UNIQUE INDEX "especialidades_hospital_hospital_id_specialty_id_key" ON "especialidades_hospital"("hospital_id", "specialty_id");

-- CreateIndex
CREATE UNIQUE INDEX "pacientes_user_id_key" ON "pacientes"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "tutores_user_id_key" ON "tutores"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "pacientes_tutores_patient_id_guardian_user_id_key" ON "pacientes_tutores"("patient_id", "guardian_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "inscripciones_hospital_paciente_patient_id_hospital_id_key" ON "inscripciones_hospital_paciente"("patient_id", "hospital_id");

-- CreateIndex
CREATE UNIQUE INDEX "relaciones_atencion_paciente_patient_id_doctor_id_hospital__key" ON "relaciones_atencion_paciente"("patient_id", "doctor_id", "hospital_id");

-- CreateIndex
CREATE UNIQUE INDEX "perfiles_personal_user_id_key" ON "perfiles_personal"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "medicos_user_id_key" ON "medicos"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "medicos_numero_matricula_key" ON "medicos"("numero_matricula");

-- CreateIndex
CREATE UNIQUE INDEX "especialidades_medico_doctor_id_specialty_id_key" ON "especialidades_medico"("doctor_id", "specialty_id");

-- CreateIndex
CREATE UNIQUE INDEX "hospitales_medico_doctor_id_hospital_id_department_id_key" ON "hospitales_medico"("doctor_id", "hospital_id", "department_id");

-- CreateIndex
CREATE UNIQUE INDEX "bloques_horarios_doctor_id_fecha_bloque_hora_inicio_hospita_key" ON "bloques_horarios"("doctor_id", "fecha_bloque", "hora_inicio", "hospital_id");

-- CreateIndex
CREATE UNIQUE INDEX "turnos_slot_id_key" ON "turnos"("slot_id");

-- CreateIndex
CREATE INDEX "lista_espera_turnos_hospital_id_idx" ON "lista_espera_turnos"("hospital_id");

-- CreateIndex
CREATE INDEX "lista_espera_turnos_doctor_id_idx" ON "lista_espera_turnos"("doctor_id");

-- CreateIndex
CREATE INDEX "lista_espera_turnos_patient_id_idx" ON "lista_espera_turnos"("patient_id");

-- CreateIndex
CREATE UNIQUE INDEX "historias_clinicas_patient_id_key" ON "historias_clinicas"("patient_id");

-- CreateIndex
CREATE INDEX "archivos_medicos_patient_id_idx" ON "archivos_medicos"("patient_id");

-- CreateIndex
CREATE INDEX "archivos_medicos_file_type_idx" ON "archivos_medicos"("file_type");

-- CreateIndex
CREATE INDEX "archivos_medicos_hospital_id_idx" ON "archivos_medicos"("hospital_id");

-- CreateIndex
CREATE UNIQUE INDEX "etiquetas_archivos_name_key" ON "etiquetas_archivos"("name");

-- CreateIndex
CREATE UNIQUE INDEX "etiquetas_archivo_medico_medical_file_id_file_tag_id_key" ON "etiquetas_archivo_medico"("medical_file_id", "file_tag_id");

-- CreateIndex
CREATE UNIQUE INDEX "preferencias_notificacion_user_id_key" ON "preferencias_notificacion"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "registros_consentimiento_user_id_legal_document_id_key" ON "registros_consentimiento"("user_id", "legal_document_id");

-- AddForeignKey
ALTER TABLE "usuarios_roles" ADD CONSTRAINT "usuarios_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuarios_roles" ADD CONSTRAINT "usuarios_roles_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuarios_roles" ADD CONSTRAINT "usuarios_roles_hospital_id_fkey" FOREIGN KEY ("hospital_id") REFERENCES "hospitales"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuarios_roles" ADD CONSTRAINT "usuarios_roles_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "departamentos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roles_permisos" ADD CONSTRAINT "roles_permisos_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roles_permisos" ADD CONSTRAINT "roles_permisos_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "permisos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sesiones" ADD CONSTRAINT "sesiones_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "verificaciones_identidad" ADD CONSTRAINT "verificaciones_identidad_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "verificaciones_identidad" ADD CONSTRAINT "verificaciones_identidad_verificado_por_fkey" FOREIGN KEY ("verificado_por") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registros_auditoria" ADD CONSTRAINT "registros_auditoria_actor_user_id_fkey" FOREIGN KEY ("actor_user_id") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "provincias" ADD CONSTRAINT "provincias_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "paises"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "localidades" ADD CONSTRAINT "localidades_province_id_fkey" FOREIGN KEY ("province_id") REFERENCES "provincias"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "barrios" ADD CONSTRAINT "barrios_locality_id_fkey" FOREIGN KEY ("locality_id") REFERENCES "localidades"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hospitales" ADD CONSTRAINT "hospitales_province_id_fkey" FOREIGN KEY ("province_id") REFERENCES "provincias"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hospitales" ADD CONSTRAINT "hospitales_locality_id_fkey" FOREIGN KEY ("locality_id") REFERENCES "localidades"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hospitales" ADD CONSTRAINT "hospitales_neighborhood_id_fkey" FOREIGN KEY ("neighborhood_id") REFERENCES "barrios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sucursales_hospital" ADD CONSTRAINT "sucursales_hospital_hospital_id_fkey" FOREIGN KEY ("hospital_id") REFERENCES "hospitales"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "departamentos" ADD CONSTRAINT "departamentos_hospital_id_fkey" FOREIGN KEY ("hospital_id") REFERENCES "hospitales"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consultorios" ADD CONSTRAINT "consultorios_hospital_id_fkey" FOREIGN KEY ("hospital_id") REFERENCES "hospitales"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consultorios" ADD CONSTRAINT "consultorios_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "departamentos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "especialidades_hospital" ADD CONSTRAINT "especialidades_hospital_hospital_id_fkey" FOREIGN KEY ("hospital_id") REFERENCES "hospitales"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "especialidades_hospital" ADD CONSTRAINT "especialidades_hospital_specialty_id_fkey" FOREIGN KEY ("specialty_id") REFERENCES "especialidades"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pacientes" ADD CONSTRAINT "pacientes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tutores" ADD CONSTRAINT "tutores_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pacientes_tutores" ADD CONSTRAINT "pacientes_tutores_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "pacientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pacientes_tutores" ADD CONSTRAINT "pacientes_tutores_guardian_user_id_fkey" FOREIGN KEY ("guardian_user_id") REFERENCES "tutores"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inscripciones_hospital_paciente" ADD CONSTRAINT "inscripciones_hospital_paciente_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "pacientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inscripciones_hospital_paciente" ADD CONSTRAINT "inscripciones_hospital_paciente_hospital_id_fkey" FOREIGN KEY ("hospital_id") REFERENCES "hospitales"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "relaciones_atencion_paciente" ADD CONSTRAINT "relaciones_atencion_paciente_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "pacientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "relaciones_atencion_paciente" ADD CONSTRAINT "relaciones_atencion_paciente_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "medicos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "relaciones_atencion_paciente" ADD CONSTRAINT "relaciones_atencion_paciente_hospital_id_fkey" FOREIGN KEY ("hospital_id") REFERENCES "hospitales"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "perfiles_personal" ADD CONSTRAINT "perfiles_personal_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asignaciones_personal" ADD CONSTRAINT "asignaciones_personal_staff_profile_id_fkey" FOREIGN KEY ("staff_profile_id") REFERENCES "perfiles_personal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asignaciones_personal" ADD CONSTRAINT "asignaciones_personal_hospital_id_fkey" FOREIGN KEY ("hospital_id") REFERENCES "hospitales"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asignaciones_personal" ADD CONSTRAINT "asignaciones_personal_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "departamentos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medicos" ADD CONSTRAINT "medicos_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "especialidades_medico" ADD CONSTRAINT "especialidades_medico_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "medicos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "especialidades_medico" ADD CONSTRAINT "especialidades_medico_specialty_id_fkey" FOREIGN KEY ("specialty_id") REFERENCES "especialidades"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hospitales_medico" ADD CONSTRAINT "hospitales_medico_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "medicos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hospitales_medico" ADD CONSTRAINT "hospitales_medico_hospital_id_fkey" FOREIGN KEY ("hospital_id") REFERENCES "hospitales"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hospitales_medico" ADD CONSTRAINT "hospitales_medico_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "departamentos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reglas_disponibilidad_medico" ADD CONSTRAINT "reglas_disponibilidad_medico_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "medicos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reglas_disponibilidad_medico" ADD CONSTRAINT "reglas_disponibilidad_medico_hospital_id_fkey" FOREIGN KEY ("hospital_id") REFERENCES "hospitales"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reglas_disponibilidad_medico" ADD CONSTRAINT "reglas_disponibilidad_medico_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "departamentos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "excepciones_disponibilidad_medico" ADD CONSTRAINT "excepciones_disponibilidad_medico_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "medicos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "excepciones_disponibilidad_medico" ADD CONSTRAINT "excepciones_disponibilidad_medico_hospital_id_fkey" FOREIGN KEY ("hospital_id") REFERENCES "hospitales"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bloques_horarios" ADD CONSTRAINT "bloques_horarios_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "medicos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bloques_horarios" ADD CONSTRAINT "bloques_horarios_hospital_id_fkey" FOREIGN KEY ("hospital_id") REFERENCES "hospitales"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bloques_horarios" ADD CONSTRAINT "bloques_horarios_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "departamentos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bloques_horarios" ADD CONSTRAINT "bloques_horarios_specialty_id_fkey" FOREIGN KEY ("specialty_id") REFERENCES "especialidades"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bloques_horarios" ADD CONSTRAINT "bloques_horarios_consultorio_id_fkey" FOREIGN KEY ("consultorio_id") REFERENCES "consultorios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bloques_horarios" ADD CONSTRAINT "bloques_horarios_regla_disponibilidad_id_fkey" FOREIGN KEY ("regla_disponibilidad_id") REFERENCES "reglas_disponibilidad_medico"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "turnos" ADD CONSTRAINT "turnos_slot_id_fkey" FOREIGN KEY ("slot_id") REFERENCES "bloques_horarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "turnos" ADD CONSTRAINT "turnos_hospital_id_fkey" FOREIGN KEY ("hospital_id") REFERENCES "hospitales"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "turnos" ADD CONSTRAINT "turnos_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "medicos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "turnos" ADD CONSTRAINT "turnos_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "pacientes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "turnos" ADD CONSTRAINT "turnos_specialty_id_fkey" FOREIGN KEY ("specialty_id") REFERENCES "especialidades"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "turnos" ADD CONSTRAINT "turnos_consultorio_id_fkey" FOREIGN KEY ("consultorio_id") REFERENCES "consultorios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "turnos" ADD CONSTRAINT "turnos_creado_por_usuario_id_fkey" FOREIGN KEY ("creado_por_usuario_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "historial_estados_turno" ADD CONSTRAINT "historial_estados_turno_appointment_id_fkey" FOREIGN KEY ("appointment_id") REFERENCES "turnos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documentos_turno" ADD CONSTRAINT "documentos_turno_appointment_id_fkey" FOREIGN KEY ("appointment_id") REFERENCES "turnos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documentos_turno" ADD CONSTRAINT "documentos_turno_archivo_id_fkey" FOREIGN KEY ("archivo_id") REFERENCES "archivos_medicos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "historias_clinicas" ADD CONSTRAINT "historias_clinicas_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "pacientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "historias_clinicas" ADD CONSTRAINT "historias_clinicas_medico_principal_id_fkey" FOREIGN KEY ("medico_principal_id") REFERENCES "medicos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "historias_clinicas" ADD CONSTRAINT "historias_clinicas_hospital_id_fkey" FOREIGN KEY ("hospital_id") REFERENCES "hospitales"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eventos_medicos" ADD CONSTRAINT "eventos_medicos_medical_record_id_fkey" FOREIGN KEY ("medical_record_id") REFERENCES "historias_clinicas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eventos_medicos" ADD CONSTRAINT "eventos_medicos_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "pacientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eventos_medicos" ADD CONSTRAINT "eventos_medicos_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "medicos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eventos_medicos" ADD CONSTRAINT "eventos_medicos_hospital_id_fkey" FOREIGN KEY ("hospital_id") REFERENCES "hospitales"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eventos_medicos" ADD CONSTRAINT "eventos_medicos_appointment_id_fkey" FOREIGN KEY ("appointment_id") REFERENCES "turnos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "diagnosticos" ADD CONSTRAINT "diagnosticos_medical_event_id_fkey" FOREIGN KEY ("medical_event_id") REFERENCES "eventos_medicos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "diagnosticos" ADD CONSTRAINT "diagnosticos_medical_record_id_fkey" FOREIGN KEY ("medical_record_id") REFERENCES "historias_clinicas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "diagnosticos" ADD CONSTRAINT "diagnosticos_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "pacientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "diagnosticos" ADD CONSTRAINT "diagnosticos_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "medicos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "diagnosticos" ADD CONSTRAINT "diagnosticos_hospital_id_fkey" FOREIGN KEY ("hospital_id") REFERENCES "hospitales"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tratamientos" ADD CONSTRAINT "tratamientos_medical_event_id_fkey" FOREIGN KEY ("medical_event_id") REFERENCES "eventos_medicos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tratamientos" ADD CONSTRAINT "tratamientos_medical_record_id_fkey" FOREIGN KEY ("medical_record_id") REFERENCES "historias_clinicas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tratamientos" ADD CONSTRAINT "tratamientos_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "pacientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tratamientos" ADD CONSTRAINT "tratamientos_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "medicos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tratamientos" ADD CONSTRAINT "tratamientos_hospital_id_fkey" FOREIGN KEY ("hospital_id") REFERENCES "hospitales"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "observaciones_clinicas" ADD CONSTRAINT "observaciones_clinicas_medical_event_id_fkey" FOREIGN KEY ("medical_event_id") REFERENCES "eventos_medicos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "signos_vitales" ADD CONSTRAINT "signos_vitales_medical_event_id_fkey" FOREIGN KEY ("medical_event_id") REFERENCES "eventos_medicos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "archivos_medicos" ADD CONSTRAINT "archivos_medicos_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "pacientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "archivos_medicos" ADD CONSTRAINT "archivos_medicos_medical_record_id_fkey" FOREIGN KEY ("medical_record_id") REFERENCES "historias_clinicas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "archivos_medicos" ADD CONSTRAINT "archivos_medicos_hospital_id_fkey" FOREIGN KEY ("hospital_id") REFERENCES "hospitales"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "archivos_medicos" ADD CONSTRAINT "archivos_medicos_medical_event_id_fkey" FOREIGN KEY ("medical_event_id") REFERENCES "eventos_medicos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "archivos_medicos" ADD CONSTRAINT "archivos_medicos_subido_por_usuario_id_fkey" FOREIGN KEY ("subido_por_usuario_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "archivos_medicos" ADD CONSTRAINT "archivos_medicos_validado_por_usuario_id_fkey" FOREIGN KEY ("validado_por_usuario_id") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "etiquetas_archivo_medico" ADD CONSTRAINT "etiquetas_archivo_medico_medical_file_id_fkey" FOREIGN KEY ("medical_file_id") REFERENCES "archivos_medicos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "etiquetas_archivo_medico" ADD CONSTRAINT "etiquetas_archivo_medico_file_tag_id_fkey" FOREIGN KEY ("file_tag_id") REFERENCES "etiquetas_archivos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recetas" ADD CONSTRAINT "recetas_medical_event_id_fkey" FOREIGN KEY ("medical_event_id") REFERENCES "eventos_medicos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recetas" ADD CONSTRAINT "recetas_medical_record_id_fkey" FOREIGN KEY ("medical_record_id") REFERENCES "historias_clinicas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recetas" ADD CONSTRAINT "recetas_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "pacientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recetas" ADD CONSTRAINT "recetas_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "medicos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recetas" ADD CONSTRAINT "recetas_hospital_id_fkey" FOREIGN KEY ("hospital_id") REFERENCES "hospitales"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "items_receta" ADD CONSTRAINT "items_receta_prescription_id_fkey" FOREIGN KEY ("prescription_id") REFERENCES "recetas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "informes_medicos" ADD CONSTRAINT "informes_medicos_medical_event_id_fkey" FOREIGN KEY ("medical_event_id") REFERENCES "eventos_medicos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "informes_medicos" ADD CONSTRAINT "informes_medicos_medical_record_id_fkey" FOREIGN KEY ("medical_record_id") REFERENCES "historias_clinicas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "informes_medicos" ADD CONSTRAINT "informes_medicos_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "pacientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "informes_medicos" ADD CONSTRAINT "informes_medicos_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "medicos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "informes_medicos" ADD CONSTRAINT "informes_medicos_hospital_id_fkey" FOREIGN KEY ("hospital_id") REFERENCES "hospitales"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "informes_medicos" ADD CONSTRAINT "informes_medicos_archivo_id_fkey" FOREIGN KEY ("archivo_id") REFERENCES "archivos_medicos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notificaciones" ADD CONSTRAINT "notificaciones_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notificaciones" ADD CONSTRAINT "notificaciones_appointment_id_fkey" FOREIGN KEY ("appointment_id") REFERENCES "turnos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notificaciones" ADD CONSTRAINT "notificaciones_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "medicos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notificaciones" ADD CONSTRAINT "notificaciones_hospital_id_fkey" FOREIGN KEY ("hospital_id") REFERENCES "hospitales"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "preferencias_notificacion" ADD CONSTRAINT "preferencias_notificacion_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registros_consentimiento" ADD CONSTRAINT "registros_consentimiento_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registros_consentimiento" ADD CONSTRAINT "registros_consentimiento_legal_document_id_fkey" FOREIGN KEY ("legal_document_id") REFERENCES "documentos_legales"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "instantaneas_estadisticas" ADD CONSTRAINT "instantaneas_estadisticas_hospital_id_fkey" FOREIGN KEY ("hospital_id") REFERENCES "hospitales"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reportes" ADD CONSTRAINT "reportes_creado_por_usuario_id_fkey" FOREIGN KEY ("creado_por_usuario_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reportes" ADD CONSTRAINT "reportes_hospital_id_fkey" FOREIGN KEY ("hospital_id") REFERENCES "hospitales"("id") ON DELETE SET NULL ON UPDATE CASCADE;
