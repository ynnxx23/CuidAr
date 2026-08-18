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

describe("Acceso: roles y permisos", () => {
  let servidor: Server;
  let puerto: number;

  const emailPaciente = `paciente_${Date.now()}@test.com`;
  const emailSuperadmin = `superadmin_${Date.now()}@test.com`;
  const contrasena = "contrasena123";
  const idsUsuariosCreados: string[] = [];

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
    await prisma.sesion.deleteMany({ where: { usuarioId: { in: idsUsuariosCreados } } });
    await prisma.usuarioRol.deleteMany({ where: { usuarioId: { in: idsUsuariosCreados } } });
    await prisma.registroAuditoria.deleteMany({
      where: { OR: [{ actorUsuarioId: { in: idsUsuariosCreados } }, { recursoId: { in: idsUsuariosCreados } }] },
    });
    await prisma.usuario.deleteMany({ where: { id: { in: idsUsuariosCreados } } });
    await prisma.$disconnect();
    servidor.close();
  });

  async function registrarUsuario(email: string): Promise<string> {
    const respuesta = await peticion<{ data: { id: string } }>(puerto, "POST", "/api/v1/auth/register", {
      dni: email.slice(0, 6) + "X",
      correoElectronico: email,
      contrasena,
      nombre: "Nombre",
      apellido: "Apellido",
    });
    expect(respuesta.status).toBe(201);
    const id = respuesta.data.data.id;
    idsUsuariosCreados.push(id);
    return id;
  }

  async function asignarRol(usuarioId: string, codigoRol: string): Promise<void> {
    const rol = await prisma.rol.findUnique({ where: { codigo: codigoRol } });
    expect(rol).not.toBeNull();
    await prisma.usuarioRol.create({ data: { usuarioId, rolId: rol!.id } });
  }

  async function iniciarSesion(email: string): Promise<string> {
    const respuesta = await peticion<{ data: { tokenAcceso: string } }>(puerto, "POST", "/api/v1/auth/login", {
      correoElectronico: email,
      contrasena,
    });
    expect(respuesta.status).toBe(200);
    expect(respuesta.data.data.tokenAcceso).toBeDefined();
    return respuesta.data.data.tokenAcceso;
  }

  it("escenario paciente vs superadmin", async () => {
    const idPaciente = await registrarUsuario(emailPaciente);
    await asignarRol(idPaciente, "patient");
    const tokenPaciente = await iniciarSesion(emailPaciente);

    const idSuperadmin = await registrarUsuario(emailSuperadmin);
    await asignarRol(idSuperadmin, "superadmin");
    const tokenSuperadmin = await iniciarSesion(emailSuperadmin);

    const rolesPaciente = await peticion(puerto, "GET", "/api/v1/roles", undefined, tokenPaciente);
    expect(rolesPaciente.status).toBe(403);

    const rolesSuperadmin = await peticion(puerto, "GET", "/api/v1/roles", undefined, tokenSuperadmin);
    expect(rolesSuperadmin.status).toBe(200);

    const permisosPaciente = await peticion(puerto, "GET", "/api/v1/permisos", undefined, tokenPaciente);
    expect(permisosPaciente.status).toBe(403);

    const permisosSuperadmin = await peticion(puerto, "GET", "/api/v1/permisos", undefined, tokenSuperadmin);
    expect(permisosSuperadmin.status).toBe(200);

    const crearRolPaciente = await peticion(puerto, "POST", "/api/v1/roles", { codigo: "test", nombre: "Test" }, tokenPaciente);
    expect(crearRolPaciente.status).toBe(403);

    const tokenInvalido = await peticion(puerto, "GET", "/api/v1/roles", undefined, "token-invalido");
    expect(tokenInvalido.status).toBe(401);
  });
});
