import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, "../.env") });

import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) throw new Error("DATABASE_URL no definida");

const adapter = new PrismaPg({ connectionString: dbUrl });
const prisma = new PrismaClient({ adapter });

const ROLES = [
  { codigo: "patient", nombre: "Paciente" },
  { codigo: "guardian", nombre: "Tutor" },
  { codigo: "support_staff", nombre: "Personal de Apoyo" },
  { codigo: "health_staff", nombre: "Personal de Salud" },
  { codigo: "doctor", nombre: "Médico" },
  { codigo: "area_manager", nombre: "Jefe de Área" },
  { codigo: "medical_director", nombre: "Director Médico" },
  { codigo: "hospital_director", nombre: "Director Hospitalario" },
  { codigo: "ministry", nombre: "Ministerio de Salud" },
  { codigo: "superadmin", nombre: "Superadministrador" },
];

const PERMISOS = [
  { codigo: "users:view", recurso: "users", accion: "view", nombre: "Ver usuarios" },
  { codigo: "users:create", recurso: "users", accion: "create", nombre: "Crear usuarios" },
  { codigo: "users:edit", recurso: "users", accion: "edit", nombre: "Editar usuarios" },
  { codigo: "users:delete", recurso: "users", accion: "delete", nombre: "Eliminar usuarios" },
  { codigo: "roles:view", recurso: "roles", accion: "view", nombre: "Ver roles" },
  { codigo: "roles:create", recurso: "roles", accion: "create", nombre: "Crear roles" },
  { codigo: "roles:edit", recurso: "roles", accion: "edit", nombre: "Editar roles" },
  { codigo: "roles:delete", recurso: "roles", accion: "delete", nombre: "Eliminar roles" },
  { codigo: "roles:assign", recurso: "roles", accion: "assign", nombre: "Asignar permisos a roles" },
  { codigo: "permisos:view", recurso: "permisos", accion: "view", nombre: "Ver permisos" },
  { codigo: "permisos:create", recurso: "permisos", accion: "create", nombre: "Crear permisos" },
  { codigo: "permisos:edit", recurso: "permisos", accion: "edit", nombre: "Editar permisos" },
  { codigo: "permisos:delete", recurso: "permisos", accion: "delete", nombre: "Eliminar permisos" },
  { codigo: "patients:view", recurso: "patients", accion: "view", nombre: "Ver pacientes" },
  { codigo: "patients:create", recurso: "patients", accion: "create", nombre: "Crear pacientes" },
  { codigo: "patients:edit", recurso: "patients", accion: "edit", nombre: "Editar pacientes" },
  { codigo: "patients:delete", recurso: "patients", accion: "delete", nombre: "Eliminar pacientes" },
  { codigo: "pacientes:view", recurso: "pacientes", accion: "view", nombre: "Ver pacientes (módulo pacientes)" },
  { codigo: "pacientes:create", recurso: "pacientes", accion: "create", nombre: "Crear pacientes (módulo pacientes)" },
  { codigo: "pacientes:edit", recurso: "pacientes", accion: "edit", nombre: "Editar pacientes (módulo pacientes)" },
  { codigo: "pacientes:delete", recurso: "pacientes", accion: "delete", nombre: "Eliminar pacientes (módulo pacientes)" },
  { codigo: "tutores:view", recurso: "tutores", accion: "view", nombre: "Ver tutores" },
  { codigo: "tutores:create", recurso: "tutores", accion: "create", nombre: "Crear tutores" },
  { codigo: "tutores:edit", recurso: "tutores", accion: "edit", nombre: "Editar tutores" },
  { codigo: "tutores:delete", recurso: "tutores", accion: "delete", nombre: "Eliminar tutores" },
  { codigo: "pacientes_tutores:view", recurso: "pacientes_tutores", accion: "view", nombre: "Ver relaciones tutor-paciente" },
  { codigo: "pacientes_tutores:create", recurso: "pacientes_tutores", accion: "create", nombre: "Crear relaciones tutor-paciente" },
  { codigo: "pacientes_tutores:edit", recurso: "pacientes_tutores", accion: "edit", nombre: "Editar relaciones tutor-paciente" },
  { codigo: "pacientes_tutores:delete", recurso: "pacientes_tutores", accion: "delete", nombre: "Eliminar relaciones tutor-paciente" },
  { codigo: "appointments:view", recurso: "appointments", accion: "view", nombre: "Ver turnos" },
  { codigo: "appointments:create", recurso: "appointments", accion: "create", nombre: "Crear turnos" },
  { codigo: "appointments:cancel", recurso: "appointments", accion: "cancel", nombre: "Cancelar turnos" },
  { codigo: "appointments:reschedule", recurso: "appointments", accion: "reschedule", nombre: "Reprogramar turnos" },
  { codigo: "medical_records:view", recurso: "medical_records", accion: "view", nombre: "Ver HC" },
  { codigo: "medical_records:create", recurso: "medical_records", accion: "create", nombre: "Crear HC" },
  { codigo: "hospitals:view", recurso: "hospitals", accion: "view", nombre: "Ver hospitales" },
  { codigo: "hospitals:create", recurso: "hospitals", accion: "create", nombre: "Crear hospitales" },
  { codigo: "hospitals:edit", recurso: "hospitals", accion: "edit", nombre: "Editar hospitales" },
  { codigo: "hospitals:manage", recurso: "hospitals", accion: "manage", nombre: "Gestionar hospitales" },
  { codigo: "sucursales:view", recurso: "sucursales", accion: "view", nombre: "Ver sucursales" },
  { codigo: "sucursales:create", recurso: "sucursales", accion: "create", nombre: "Crear sucursales" },
  { codigo: "sucursales:edit", recurso: "sucursales", accion: "edit", nombre: "Editar sucursales" },
  { codigo: "sucursales:delete", recurso: "sucursales", accion: "delete", nombre: "Eliminar sucursales" },
  { codigo: "departamentos:view", recurso: "departamentos", accion: "view", nombre: "Ver departamentos" },
  { codigo: "departamentos:create", recurso: "departamentos", accion: "create", nombre: "Crear departamentos" },
  { codigo: "departamentos:edit", recurso: "departamentos", accion: "edit", nombre: "Editar departamentos" },
  { codigo: "departamentos:delete", recurso: "departamentos", accion: "delete", nombre: "Eliminar departamentos" },
  { codigo: "especialidades:view", recurso: "especialidades", accion: "view", nombre: "Ver especialidades" },
  { codigo: "especialidades:create", recurso: "especialidades", accion: "create", nombre: "Crear especialidades" },
  { codigo: "especialidades:edit", recurso: "especialidades", accion: "edit", nombre: "Editar especialidades" },
  { codigo: "especialidades:delete", recurso: "especialidades", accion: "delete", nombre: "Eliminar especialidades" },
  { codigo: "consultorios:view", recurso: "consultorios", accion: "view", nombre: "Ver consultorios" },
  { codigo: "consultorios:create", recurso: "consultorios", accion: "create", nombre: "Crear consultorios" },
  { codigo: "consultorios:edit", recurso: "consultorios", accion: "edit", nombre: "Editar consultorios" },
  { codigo: "consultorios:delete", recurso: "consultorios", accion: "delete", nombre: "Eliminar consultorios" },
  { codigo: "paises:ver", recurso: "paises", accion: "view", nombre: "Ver países" },
  { codigo: "paises:crear", recurso: "paises", accion: "create", nombre: "Crear países" },
  { codigo: "paises:editar", recurso: "paises", accion: "edit", nombre: "Editar países" },
  { codigo: "paises:eliminar", recurso: "paises", accion: "delete", nombre: "Eliminar países" },
  { codigo: "provincias:ver", recurso: "provincias", accion: "view", nombre: "Ver provincias" },
  { codigo: "provincias:crear", recurso: "provincias", accion: "create", nombre: "Crear provincias" },
  { codigo: "provincias:editar", recurso: "provincias", accion: "edit", nombre: "Editar provincias" },
  { codigo: "provincias:eliminar", recurso: "provincias", accion: "delete", nombre: "Eliminar provincias" },
  { codigo: "localidades:ver", recurso: "localidades", accion: "view", nombre: "Ver localidades" },
  { codigo: "localidades:crear", recurso: "localidades", accion: "create", nombre: "Crear localidades" },
  { codigo: "localidades:editar", recurso: "localidades", accion: "edit", nombre: "Editar localidades" },
  { codigo: "localidades:eliminar", recurso: "localidades", accion: "delete", nombre: "Eliminar localidades" },
  { codigo: "barrios:ver", recurso: "barrios", accion: "view", nombre: "Ver barrios" },
  { codigo: "barrios:crear", recurso: "barrios", accion: "create", nombre: "Crear barrios" },
  { codigo: "barrios:editar", recurso: "barrios", accion: "edit", nombre: "Editar barrios" },
  { codigo: "barrios:eliminar", recurso: "barrios", accion: "delete", nombre: "Eliminar barrios" },
  { codigo: "areas_medicas:view", recurso: "areas_medicas", accion: "view", nombre: "Ver áreas médicas" },
  { codigo: "areas_medicas:create", recurso: "areas_medicas", accion: "create", nombre: "Crear áreas médicas" },
  { codigo: "areas_medicas:edit", recurso: "areas_medicas", accion: "edit", nombre: "Editar áreas médicas" },
  { codigo: "areas_medicas:delete", recurso: "areas_medicas", accion: "delete", nombre: "Eliminar áreas médicas" },
  { codigo: "areas_medicas:ver", recurso: "areas_medicas", accion: "view", nombre: "Ver áreas médicas (Spanish)" },
  { codigo: "areas_medicas:crear", recurso: "areas_medicas", accion: "create", nombre: "Crear áreas médicas (Spanish)" },
  { codigo: "areas_medicas:editar", recurso: "areas_medicas", accion: "edit", nombre: "Editar áreas médicas (Spanish)" },
  { codigo: "areas_medicas:eliminar", recurso: "areas_medicas", accion: "delete", nombre: "Eliminar áreas médicas (Spanish)" },
  { codigo: "statistics:view", recurso: "statistics", accion: "view", nombre: "Ver estadísticas" },
  { codigo: "audit_logs:view", recurso: "audit_logs", accion: "view", nombre: "Ver auditoría" },
  { codigo: "medicos:ver", recurso: "medicos", accion: "view", nombre: "Ver médicos" },
  { codigo: "medicos:crear", recurso: "medicos", accion: "create", nombre: "Crear médicos" },
  { codigo: "medicos:editar", recurso: "medicos", accion: "edit", nombre: "Editar médicos" },
  { codigo: "medicos:eliminar", recurso: "medicos", accion: "delete", nombre: "Eliminar médicos" },
  { codigo: "medicos:asignar_especialidad", recurso: "medicos", accion: "assign_specialty", nombre: "Asignar especialidades a médicos" },
  { codigo: "medicos:asignar_hospital", recurso: "medicos", accion: "assign_hospital", nombre: "Asignar hospitales a médicos" },
  { codigo: "matriculas:view", recurso: "matriculas", accion: "view", nombre: "Ver matrículas" },
  { codigo: "matriculas:create", recurso: "matriculas", accion: "create", nombre: "Crear matrículas" },
  { codigo: "matriculas:edit", recurso: "matriculas", accion: "edit", nombre: "Editar matrículas" },
  { codigo: "matriculas:delete", recurso: "matriculas", accion: "delete", nombre: "Eliminar matrículas" },
  { codigo: "disponibilidad:ver", recurso: "disponibilidad", accion: "view", nombre: "Ver disponibilidad" },
  { codigo: "disponibilidad:crear", recurso: "disponibilidad", accion: "create", nombre: "Crear reglas/excepciones de disponibilidad" },
  { codigo: "disponibilidad:editar", recurso: "disponibilidad", accion: "edit", nombre: "Editar reglas/excepciones de disponibilidad" },
  { codigo: "disponibilidad:eliminar", recurso: "disponibilidad", accion: "delete", nombre: "Eliminar reglas/excepciones de disponibilidad" },
];

async function main() {
  console.log("Sembrando roles...");
  const mapaRoles: Record<string, string> = {};
  for (const r of ROLES) {
    const rol = await prisma.rol.upsert({
      where: { codigo: r.codigo },
      update: { nombre: r.nombre },
      create: { codigo: r.codigo, nombre: r.nombre, descripcion: null },
    });
    mapaRoles[r.codigo] = rol.id;
  }

  console.log("Sembrando permisos...");
  const mapaPermisos: Record<string, string> = {};
  for (const p of PERMISOS) {
    const permiso = await prisma.permiso.upsert({
      where: { codigo: p.codigo },
      update: { nombre: p.nombre },
      create: { codigo: p.codigo, nombre: p.nombre, descripcion: null, recurso: p.recurso, accion: p.accion },
    });
    mapaPermisos[p.codigo] = permiso.id;
  }

  console.log("Asignando permisos a roles...");
  const rolesPermisos: Record<string, string[]> = {
    superadmin: PERMISOS.map((p) => p.codigo),
    patient: ["pacientes:view", "appointments:view", "appointments:create", "appointments:cancel"],
    guardian: ["pacientes:view", "appointments:view", "appointments:create", "appointments:cancel"],
    support_staff: [
      "pacientes:view",
      "appointments:view", "appointments:create", "appointments:cancel", "appointments:reschedule",
      "medicos:ver",
      "consultorios:view", "especialidades:view",
      "disponibilidad:ver",
    ],
    health_staff: [
      "pacientes:view",
      "appointments:view",
      "medical_records:view",
      "consultorios:view", "especialidades:view",
      "matriculas:view",
      "disponibilidad:ver",
    ],
    doctor: [
      "pacientes:view",
      "appointments:view", "appointments:create", "appointments:cancel", "appointments:reschedule",
      "medical_records:view", "medical_records:create",
      "medicos:ver",
      "consultorios:view", "especialidades:view", "hospitals:view",
      "matriculas:view", "matriculas:create", "matriculas:edit",
      "disponibilidad:ver",
    ],
    area_manager: [
      "pacientes:view",
      "appointments:view",
      "medical_records:view",
      "statistics:view",
      "medicos:ver",
      "consultorios:view", "consultorios:create", "consultorios:edit",
      "especialidades:view", "especialidades:create", "especialidades:edit",
      "departamentos:view", "departamentos:create", "departamentos:edit",
      "areas_medicas:ver", "areas_medicas:crear", "areas_medicas:editar",
      "hospitals:view",
      "sucursales:view",
      "matriculas:view", "matriculas:create", "matriculas:edit",
      "disponibilidad:ver",
    ],
    medical_director: [
      "pacientes:view",
      "appointments:view",
      "medical_records:view",
      "statistics:view",
      "audit_logs:view",
      "medicos:ver", "medicos:crear", "medicos:editar", "medicos:asignar_especialidad", "medicos:asignar_hospital",
      "hospitals:view", "hospitals:create", "hospitals:edit",
      "sucursales:view", "sucursales:create", "sucursales:edit",
      "departamentos:view", "departamentos:create", "departamentos:edit",
      "especialidades:view", "especialidades:create", "especialidades:edit",
      "consultorios:view", "consultorios:create", "consultorios:edit",
      "areas_medicas:ver", "areas_medicas:crear", "areas_medicas:editar",
      "paises:ver", "provincias:ver", "localidades:ver", "barrios:ver",
      "matriculas:view", "matriculas:create", "matriculas:edit", "matriculas:delete",
      "disponibilidad:ver", "disponibilidad:crear", "disponibilidad:editar", "disponibilidad:eliminar",
      "tutores:view", "pacientes_tutores:view",
    ],
    hospital_director: [
      "pacientes:view",
      "appointments:view",
      "medical_records:view",
      "statistics:view",
      "audit_logs:view",
      "hospitals:view", "hospitals:create", "hospitals:edit",
      "sucursales:view", "sucursales:create", "sucursales:edit", "sucursales:delete",
      "departamentos:view", "departamentos:create", "departamentos:edit", "departamentos:delete",
      "especialidades:view", "especialidades:create", "especialidades:edit", "especialidades:delete",
      "consultorios:view", "consultorios:create", "consultorios:edit", "consultorios:delete",
      "areas_medicas:ver", "areas_medicas:crear", "areas_medicas:editar",
      "paises:ver", "provincias:ver", "localidades:ver", "barrios:ver",
      "medicos:ver", "medicos:crear", "medicos:editar", "medicos:eliminar", "medicos:asignar_especialidad", "medicos:asignar_hospital",
      "tutores:view", "pacientes_tutores:view",
    ],
    ministry: [
      "statistics:view",
      "hospitals:view",
      "medicos:ver",
      "paises:ver", "provincias:ver", "localidades:ver", "barrios:ver",
      "especialidades:view",
    ],
  };

  for (const [codigoRol, codigosPermiso] of Object.entries(rolesPermisos)) {
    const idRol = mapaRoles[codigoRol];
    if (!idRol) continue;
    for (const codigoPerm of codigosPermiso) {
      const idPerm = mapaPermisos[codigoPerm];
      if (!idPerm) continue;
      await prisma.rolPermiso.upsert({
        where: { rolId_permisoId: { rolId: idRol, permisoId: idPerm } },
        update: {},
        create: { rolId: idRol, permisoId: idPerm },
      });
    }
  }

  console.log("Siembra completada.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
