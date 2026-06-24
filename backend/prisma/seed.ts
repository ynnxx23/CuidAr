import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
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
  { codigo: "roles:assign", recurso: "roles", accion: "assign", nombre: "Asignar roles" },
  { codigo: "patients:view", recurso: "patients", accion: "view", nombre: "Ver pacientes" },
  { codigo: "patients:create", recurso: "patients", accion: "create", nombre: "Crear pacientes" },
  { codigo: "patients:edit", recurso: "patients", accion: "edit", nombre: "Editar pacientes" },
  { codigo: "appointments:view", recurso: "appointments", accion: "view", nombre: "Ver turnos" },
  { codigo: "appointments:create", recurso: "appointments", accion: "create", nombre: "Crear turnos" },
  { codigo: "appointments:cancel", recurso: "appointments", accion: "cancel", nombre: "Cancelar turnos" },
  { codigo: "appointments:reschedule", recurso: "appointments", accion: "reschedule", nombre: "Reprogramar turnos" },
  { codigo: "medical_records:view", recurso: "medical_records", accion: "view", nombre: "Ver HC" },
  { codigo: "medical_records:create", recurso: "medical_records", accion: "create", nombre: "Crear HC" },
  { codigo: "hospitals:view", recurso: "hospitals", accion: "view", nombre: "Ver hospitales" },
  { codigo: "hospitals:manage", recurso: "hospitals", accion: "manage", nombre: "Gestionar hospitales" },
  { codigo: "statistics:view", recurso: "statistics", accion: "view", nombre: "Ver estadísticas" },
  { codigo: "audit_logs:view", recurso: "audit_logs", accion: "view", nombre: "Ver auditoría" },
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
    patient: ["patients:view", "appointments:view", "appointments:create", "appointments:cancel"],
    guardian: ["patients:view", "appointments:view", "appointments:create", "appointments:cancel"],
    support_staff: [
      "patients:view", "patients:create", "patients:edit",
      "appointments:view", "appointments:create", "appointments:cancel", "appointments:reschedule",
    ],
    health_staff: [
      "patients:view",
      "appointments:view",
      "medical_records:view",
    ],
    doctor: [
      "patients:view",
      "appointments:view", "appointments:create", "appointments:cancel", "appointments:reschedule",
      "medical_records:view", "medical_records:create",
    ],
    area_manager: [
      "patients:view",
      "appointments:view",
      "medical_records:view",
      "statistics:view",
    ],
    medical_director: [
      "patients:view",
      "appointments:view",
      "medical_records:view",
      "statistics:view",
      "audit_logs:view",
    ],
    hospital_director: [
      "patients:view",
      "appointments:view",
      "medical_records:view",
      "statistics:view",
      "audit_logs:view",
      "hospitals:view",
    ],
    ministry: [
      "statistics:view",
      "hospitals:view",
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
