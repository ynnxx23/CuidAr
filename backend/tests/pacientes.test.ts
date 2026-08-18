import http, { IncomingMessage } from "http";
import { Server } from "http";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import app from "../src/app";
import { prisma } from "../src/config/prisma";

interface Respuesta<T> {
  status: number;
  data: T;
}

function peticion<T>(
  port: number,
  metodo: string,
  ruta: string,
  cuerpo?: unknown,
  token?: string,
): Promise<Respuesta<T>> {
  return new Promise((resolve, reject) => {
    const cuerpoSerializado = cuerpo ? JSON.stringify(cuerpo) : undefined;
    const opciones: http.RequestOptions = {
      host: "localhost",
      port,
      path: ruta,
      method: metodo,
      headers: {
        "Content-Type": "application/json",
        ...(cuerpoSerializado ? { "Content-Length": Buffer.byteLength(cuerpoSerializado) } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    };

    const req = http.request(opciones, (res: IncomingMessage) => {
      let acumulado = "";
      res.on("data", (chunk) => {
        acumulado += chunk;
      });
      res.on("end", () => {
        const data = acumulado ? JSON.parse(acumulado) : null;
        resolve({ status: res.statusCode ?? 0, data });
      });
    });

    req.on("error", reject);
    if (cuerpoSerializado) {
      req.write(cuerpoSerializado);
    }
    req.end();
  });
}

describe("FASE 8: pacientes, tutores, relaciones tutor-paciente", () => {
  let servidor: Server;
  let puerto: number;

  const sufijo = Date.now();
  const emailSuperadmin = `pac_admin_${sufijo}@test.com`;
  const emailPaciente = `pac_patient_${sufijo}@test.com`;
  const emailTutor = `pac_guard_${sufijo}@test.com`;
  const emailMinistry = `pac_ministry_${sufijo}@test.com`;
  const contrasena = "contrasena123";
  const idsUsuariosCreados: string[] = [];
  const idsRelacionesCreadas: string[] = [];
  const idsTutoresCreados: string[] = [];
  const idsPacientesCreados: string[] = [];

  beforeAll(async () => {
    servidor = app.listen(0);
    await new Promise<void>((resolve) => {
      servidor.once("listening", () => resolve());
    });
    const direccion = servidor.address();
    if (direccion && typeof direccion === "object") {
      puerto = direccion.port;
    }
  });

  afterAll(async () => {
    await prisma.pacienteTutor.deleteMany({ where: { id: { in: idsRelacionesCreadas } } });
    await prisma.tutor.deleteMany({ where: { id: { in: idsTutoresCreados } } });
    await prisma.paciente.deleteMany({ where: { id: { in: idsPacientesCreados } } });
    await prisma.sesion.deleteMany({ where: { usuarioId: { in: idsUsuariosCreados } } });
    await prisma.usuarioRol.deleteMany({ where: { usuarioId: { in: idsUsuariosCreados } } });
    await prisma.registroAuditoria.deleteMany({
      where: { OR: [{ actorUsuarioId: { in: idsUsuariosCreados } }, { recursoId: { in: idsUsuariosCreados } }] },
    });
    await prisma.usuario.deleteMany({ where: { id: { in: idsUsuariosCreados } } });
    await prisma.$disconnect();
    servidor.close();
  });

  async function registrarYLogin(email: string, codigoRol: string): Promise<{ id: string; token: string }> {
    const respuesta = await peticion<{ data: { id: string } }>(puerto, "POST", "/api/v1/auth/register", {
      dni: `pac${codigoRol}${sufijo}`.slice(0, 20),
      correoElectronico: email,
      contrasena,
      nombre: "Nombre",
      apellido: "Apellido",
    });
    expect(respuesta.status).toBe(201);
    const id = respuesta.data.data.id;
    idsUsuariosCreados.push(id);

    const rol = await prisma.rol.findUnique({ where: { codigo: codigoRol } });
    expect(rol).not.toBeNull();
    await prisma.usuarioRol.create({ data: { usuarioId: id, rolId: rol!.id } });

    const login = await peticion<{ data: { tokenAcceso: string } }>(puerto, "POST", "/api/v1/auth/login", {
      correoElectronico: email,
      contrasena,
    });
    expect(login.status).toBe(200);
    return { id, token: login.data.data.tokenAcceso };
  }

  it("escenario superadmin gestiona pacientes y tutores; paciente denegado", async () => {
    const superadmin = await registrarYLogin(emailSuperadmin, "superadmin");
    const paciente = await registrarYLogin(emailPaciente, "patient");
    const tutor = await registrarYLogin(emailTutor, "guardian");
    const ministry = await registrarYLogin(emailMinistry, "ministry");

    const ministryDenegado = await peticion(puerto, "GET", "/api/v1/pacientes", undefined, ministry.token);
    expect(ministryDenegado.status).toBe(403);

    const crearPaciente = await peticion<{ data: { id: string } }>(
      puerto,
      "POST",
      "/api/v1/pacientes",
      {
        usuarioId: paciente.id,
        tipoSangre: "O+",
        alergias: "Penicilina",
        contactoEmergenciaNombre: "Contacto Emergencia",
        contactoEmergenciaTelefono: "1198765432",
      },
      superadmin.token,
    );
    expect(crearPaciente.status).toBe(201);
    const pacienteId = crearPaciente.data.data.id;
    idsPacientesCreados.push(pacienteId);

    const pacienteDuplicado = await peticion(
      puerto,
      "POST",
      "/api/v1/pacientes",
      { usuarioId: paciente.id },
      superadmin.token,
    );
    expect(pacienteDuplicado.status).toBe(409);

    const pacienteUsuarioInexistente = await peticion(
      puerto,
      "POST",
      "/api/v1/pacientes",
      { usuarioId: "11111111-1111-1111-1111-111111111111" },
      superadmin.token,
    );
    expect(pacienteUsuarioInexistente.status).toBe(404);

    const crearTutor = await peticion<{ data: { id: string } }>(
      puerto,
      "POST",
      "/api/v1/tutores",
      { usuarioId: tutor.id, notasRelacion: "Padre" },
      superadmin.token,
    );
    expect(crearTutor.status).toBe(201);
    const tutorId = crearTutor.data.data.id;
    idsTutoresCreados.push(tutorId);

    const tutorDuplicado = await peticion(puerto, "POST", "/api/v1/tutores", { usuarioId: tutor.id }, superadmin.token);
    expect(tutorDuplicado.status).toBe(409);

    const crearRelacion = await peticion<{ data: { id: string } }>(
      puerto,
      "POST",
      "/api/v1/pacientes-tutores",
      { pacienteId, tutorUsuarioId: tutor.id, tipoRelacion: "padre", estadoAutorizacion: "pendiente" },
      superadmin.token,
    );
    expect(crearRelacion.status).toBe(201);
    const relacionId = crearRelacion.data.data.id;
    idsRelacionesCreadas.push(relacionId);

    const relacionDuplicada = await peticion(
      puerto,
      "POST",
      "/api/v1/pacientes-tutores",
      { pacienteId, tutorUsuarioId: tutor.id, tipoRelacion: "madre" },
      superadmin.token,
    );
    expect(relacionDuplicada.status).toBe(409);

    const listarRelaciones = await peticion(
      puerto,
      "GET",
      `/api/v1/pacientes-tutores?pacienteId=${pacienteId}`,
      undefined,
      superadmin.token,
    );
    expect(listarRelaciones.status).toBe(200);

    const actualizarPaciente = await peticion<{ data: { tipoSangre: string } }>(
      puerto,
      "PATCH",
      `/api/v1/pacientes/${pacienteId}`,
      { tipoSangre: "A+" },
      superadmin.token,
    );
    expect(actualizarPaciente.status).toBe(200);
    expect(actualizarPaciente.data.data.tipoSangre).toBe("A+");

    const actualizarRelacion = await peticion<{ data: { estadoAutorizacion: string } }>(
      puerto,
      "PATCH",
      `/api/v1/pacientes-tutores/${relacionId}`,
      { estadoAutorizacion: "verificado" },
      superadmin.token,
    );
    expect(actualizarRelacion.status).toBe(200);
    expect(actualizarRelacion.data.data.estadoAutorizacion).toBe("verificado");

    const eliminarPacienteConTutor = await peticion(
      puerto,
      "DELETE",
      `/api/v1/pacientes/${pacienteId}`,
      undefined,
      superadmin.token,
    );
    expect(eliminarPacienteConTutor.status).toBe(409);

    const eliminarRelacion = await peticion(puerto, "DELETE", `/api/v1/pacientes-tutores/${relacionId}`, undefined, superadmin.token);
    expect(eliminarRelacion.status).toBe(200);

    const eliminarTutor = await peticion(puerto, "DELETE", `/api/v1/tutores/${tutorId}`, undefined, superadmin.token);
    expect(eliminarTutor.status).toBe(200);

    const eliminarPaciente = await peticion(puerto, "DELETE", `/api/v1/pacientes/${pacienteId}`, undefined, superadmin.token);
    expect(eliminarPaciente.status).toBe(200);
  });
});
