-- CHECK constraints para integridad de datos
-- Estas constraints no se pueden definir en Prisma schema, se agregan via migración SQL

-- day_of_week BETWEEN 0 AND 6
ALTER TABLE reglas_disponibilidad_medico
  ADD CONSTRAINT chk_dia_semana_rango
  CHECK (dia_semana BETWEEN 0 AND 6);

-- end_time > start_time en reglas de disponibilidad
ALTER TABLE reglas_disponibilidad_medico
  ADD CONSTRAINT chk_hora_fin_posterior_inicio
  CHECK (hora_fin > hora_inicio);

-- slot_duration_minutes > 0
ALTER TABLE reglas_disponibilidad_medico
  ADD CONSTRAINT chk_duracion_bloque_positiva
  CHECK (duracion_bloque_minutos > 0);

-- end_time > start_time en bloques horarios
ALTER TABLE bloques_horarios
  ADD CONSTRAINT chk_bloque_hora_fin_posterior_inicio
  CHECK (hora_fin > hora_inicio);
