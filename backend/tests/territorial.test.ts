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

describe("Estructura territorial: paises, provincias, localidades, barrios", () => {
  let servidor: Server;
  let puerto: number;

  const sufijo = Date.now();
  const emailSuperadmin = `terr_super_${sufijo}@test.com`;
  const emailPaciente = `terr_pac_${sufijo}@test.com`;
  const contrasena = "contrasena123";
  const idsUsuariosCreados: string[] = [];
  const idsBarriosCreados: string[] = [];
  const idsLocalidadesCreadas: string[] = [];
  const idsProvinciasCreadas: string[] = [];
  const idsPaisesCreados: string[] = [];

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
    await prisma.barrio.deleteMany({ where: { id: { in: idsBarriosCreados } } });
    await prisma.localidad.deleteMany({ where: { id: { in: idsLocalidadesCreadas } } });
    await prisma.provincia.deleteMany({ where: { id: { in: idsProvinciasCreadas } } });
    await prisma.pais.deleteMany({ where: { id: { in: idsPaisesCreados } } });
    await prisma.sesion.deleteMany({ where: { usuarioId: { in: idsUsuariosCreados } } });
    await prisma.usuarioRol.deleteMany({ where: { usuarioId: { in: idsUsuariosCreados } } });
    await prisma.registroAuditoria.deleteMany({
      where: { OR: [{ actorUsuarioId: { in: idsUsuariosCreados } }, { recursoId: { in: idsUsuariosCreados } }] },
    });
    await prisma.usuario.deleteMany({ where: { id: { in: idsUsuariosCreados } } });
    await prisma.$disconnect();
    servidor.close();
  });

  async function registrarYLogin(email: string, codigoRol: string, prefijoDni: string): Promise<string> {
    const respuesta = await peticion<{ data: { id: string } }>(puerto, "POST", "/api/v1/auth/register", {
      dni: `${prefijoDni}${codigoRol}${sufijo}`.slice(0, 20),
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
    return login.data.data.tokenAcceso;
  }

  it("escenario superadmin gestiona cascada territorial; paciente denegado", async () => {
    const tokenSuperadmin = await registrarYLogin(emailSuperadmin, "superadmin", "terr");
    const tokenPaciente = await registrarYLogin(emailPaciente, "patient", "terr");

    const pacientePaises = await peticion(puerto, "GET", "/api/v1/paises", undefined, tokenPaciente);
    expect(pacientePaises.status).toBe(403);

    const crearPais = await peticion<{ data: { id: string } }>(
      puerto,
      "POST",
      "/api/v1/paises",
      { nombre: `Pais Test ${sufijo}` },
      tokenSuperadmin,
    );
    expect(crearPais.status).toBe(201);
    const paisId = crearPais.data.data.id;
    idsPaisesCreados.push(paisId);

    const crearProvincia = await peticion<{ data: { id: string } }>(
      puerto,
      "POST",
      "/api/v1/provincias",
      { paisId, nombre: `Provincia Test ${sufijo}` },
      tokenSuperadmin,
    );
    expect(crearProvincia.status).toBe(201);
    const provinciaId = crearProvincia.data.data.id;
    idsProvinciasCreadas.push(provinciaId);

    const crearLocalidad = await peticion<{ data: { id: string } }>(
      puerto,
      "POST",
      "/api/v1/localidades",
      { provinciaId, nombre: `Localidad Test ${sufijo}` },
      tokenSuperadmin,
    );
    expect(crearLocalidad.status).toBe(201);
    const localidadId = crearLocalidad.data.data.id;
    idsLocalidadesCreadas.push(localidadId);

    const crearBarrio = await peticion<{ data: { id: string } }>(
      puerto,
      "POST",
      "/api/v1/barrios",
      { localidadId, nombre: `Barrio Test ${sufijo}` },
      tokenSuperadmin,
    );
    expect(crearBarrio.status).toBe(201);
    idsBarriosCreados.push(crearBarrio.data.data.id);

    const listarPaises = await peticion<{ data: { success: boolean; data: unknown[] } }>(
      puerto,
      "GET",
      "/api/v1/paises?incluirProvincias=true",
      undefined,
      tokenSuperadmin,
    );
    expect(listarPaises.status).toBe(200);
    expect(listarPaises.data.data.length).toBeGreaterThan(0);

    const listarProvincias = await peticion(puerto, "GET", `/api/v1/provincias?paisId=${paisId}`, undefined, tokenSuperadmin);
    expect(listarProvincias.status).toBe(200);

    const listarLocalidades = await peticion(puerto, "GET", `/api/v1/localidades?provinciaId=${provinciaId}`, undefined, tokenSuperadmin);
    expect(listarLocalidades.status).toBe(200);

    const listarBarrios = await peticion(puerto, "GET", `/api/v1/barrios?localidadId=${localidadId}`, undefined, tokenSuperadmin);
    expect(listarBarrios.status).toBe(200);
  });
});
