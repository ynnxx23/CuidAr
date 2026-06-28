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
  { codigo: "paciente", nombre: "Paciente" },
  { codigo: "tutor", nombre: "Tutor" },
  { codigo: "personal_apoyo", nombre: "Personal de Apoyo" },
  { codigo: "personal_salud", nombre: "Personal de Salud" },
  { codigo: "medico", nombre: "Médico" },
  { codigo: "jefe_area", nombre: "Jefe de Área" },
  { codigo: "director_medico", nombre: "Director Médico" },
  { codigo: "director_hospital", nombre: "Director Hospitalario" },
  { codigo: "ministerio", nombre: "Ministerio de Salud" },
  { codigo: "superadmin", nombre: "Superadministrador" },
];

const PERMISOS = [
  { codigo: "usuarios:ver", recurso: "usuarios", accion: "ver", nombre: "Ver usuarios" },
  { codigo: "usuarios:crear", recurso: "usuarios", accion: "crear", nombre: "Crear usuarios" },
  { codigo: "usuarios:editar", recurso: "usuarios", accion: "editar", nombre: "Editar usuarios" },
  { codigo: "usuarios:eliminar", recurso: "usuarios", accion: "eliminar", nombre: "Eliminar usuarios" },
  { codigo: "roles:ver", recurso: "roles", accion: "ver", nombre: "Ver roles" },
  { codigo: "roles:asignar", recurso: "roles", accion: "asignar", nombre: "Asignar roles" },
  { codigo: "pacientes:ver", recurso: "pacientes", accion: "ver", nombre: "Ver pacientes" },
  { codigo: "pacientes:crear", recurso: "pacientes", accion: "crear", nombre: "Crear pacientes" },
  { codigo: "pacientes:editar", recurso: "pacientes", accion: "editar", nombre: "Editar pacientes" },
  { codigo: "turnos:ver", recurso: "turnos", accion: "ver", nombre: "Ver turnos" },
  { codigo: "turnos:crear", recurso: "turnos", accion: "crear", nombre: "Crear turnos" },
  { codigo: "turnos:cancelar", recurso: "turnos", accion: "cancelar", nombre: "Cancelar turnos" },
  { codigo: "turnos:reprogramar", recurso: "turnos", accion: "reprogramar", nombre: "Reprogramar turnos" },
  { codigo: "historias_clinicas:ver", recurso: "historias_clinicas", accion: "ver", nombre: "Ver HC" },
  { codigo: "historias_clinicas:crear", recurso: "historias_clinicas", accion: "crear", nombre: "Crear HC" },
  { codigo: "hospitales:ver", recurso: "hospitales", accion: "ver", nombre: "Ver hospitales" },
  { codigo: "hospitales:gestionar", recurso: "hospitales", accion: "gestionar", nombre: "Gestionar hospitales" },
  { codigo: "estadisticas:ver", recurso: "estadisticas", accion: "ver", nombre: "Ver estadísticas" },
  { codigo: "auditoria:ver", recurso: "auditoria", accion: "ver", nombre: "Ver auditoría" },
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
    paciente: ["pacientes:ver", "turnos:ver", "turnos:crear", "turnos:cancelar"],
    tutor: ["pacientes:ver", "turnos:ver", "turnos:crear", "turnos:cancelar"],
    personal_apoyo: [
      "pacientes:ver", "pacientes:crear", "pacientes:editar",
      "turnos:ver", "turnos:crear", "turnos:cancelar", "turnos:reprogramar",
    ],
    personal_salud: [
      "pacientes:ver",
      "turnos:ver",
      "historias_clinicas:ver",
    ],
    medico: [
      "pacientes:ver",
      "turnos:ver", "turnos:crear", "turnos:cancelar", "turnos:reprogramar",
      "historias_clinicas:ver", "historias_clinicas:crear",
    ],
    jefe_area: [
      "pacientes:ver",
      "turnos:ver",
      "historias_clinicas:ver",
      "estadisticas:ver",
    ],
    director_medico: [
      "pacientes:ver",
      "turnos:ver",
      "historias_clinicas:ver",
      "estadisticas:ver",
      "auditoria:ver",
    ],
    director_hospital: [
      "pacientes:ver",
      "turnos:ver",
      "historias_clinicas:ver",
      "estadisticas:ver",
      "auditoria:ver",
      "hospitales:ver",
    ],
    ministerio: [
      "estadisticas:ver",
      "hospitales:ver",
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
