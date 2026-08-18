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

describe("FASE 7: areas medicas, hospitales, sucursales, departamentos, consultorios", () => {
  let servidor: Server;
  let puerto: number;

  const sufijo = Date.now();
  const emailSuperadmin = `hosp_super_${sufijo}@test.com`;
  const emailPaciente = `hosp_pac_${sufijo}@test.com`;
  const contrasena = "contrasena123";
  const idsUsuariosCreados: string[] = [];
  const idsConsultoriosCreados: string[] = [];
  const idsDepartamentosCreados: string[] = [];
  const idsSucursalesCreadas: string[] = [];
  const idsHospitalesCreados: string[] = [];
  const idsAreasMedicasCreadas: string[] = [];
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
    await prisma.consultorio.deleteMany({ where: { id: { in: idsConsultoriosCreados } } });
    await prisma.departamento.deleteMany({ where: { id: { in: idsDepartamentosCreados } } });
    await prisma.sucursalHospital.deleteMany({ where: { id: { in: idsSucursalesCreadas } } });
    await prisma.hospital.deleteMany({ where: { id: { in: idsHospitalesCreados } } });
    await prisma.areaMedica.deleteMany({ where: { id: { in: idsAreasMedicasCreadas } } });
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

  it("escenario superadmin gestiona estructura hospitalaria; paciente denegado", async () => {
    const tokenSuperadmin = await registrarYLogin(emailSuperadmin, "superadmin", "hosp");
    const tokenPaciente = await registrarYLogin(emailPaciente, "patient", "hosp");

    const pacienteHospitales = await peticion(puerto, "GET", "/api/v1/hospitales", undefined, tokenPaciente);
    expect(pacienteHospitales.status).toBe(403);

    const crearAreaMedica = await peticion<{ data: { id: string } }>(
      puerto,
      "POST",
      "/api/v1/areas-medicas",
      { nombre: `Cardiologia Test ${sufijo}`, descripcion: "Area de prueba" },
      tokenSuperadmin,
    );
    expect(crearAreaMedica.status).toBe(201);
    const areaMedicaId = crearAreaMedica.data.data.id;
    idsAreasMedicasCreadas.push(areaMedicaId);

    const crearPais = await peticion<{ data: { id: string } }>(
      puerto,
      "POST",
      "/api/v1/paises",
      { nombre: `Pais Hospital ${sufijo}` },
      tokenSuperadmin,
    );
    expect(crearPais.status).toBe(201);
    const paisId = crearPais.data.data.id;
    idsPaisesCreados.push(paisId);

    const crearProvincia = await peticion<{ data: { id: string } }>(
      puerto,
      "POST",
      "/api/v1/provincias",
      { paisId, nombre: `Provincia Hospital ${sufijo}` },
      tokenSuperadmin,
    );
    expect(crearProvincia.status).toBe(201);
    const provinciaId = crearProvincia.data.data.id;
    idsProvinciasCreadas.push(provinciaId);

    const crearLocalidad = await peticion<{ data: { id: string } }>(
      puerto,
      "POST",
      "/api/v1/localidades",
      { provinciaId, nombre: `Localidad Hospital ${sufijo}` },
      tokenSuperadmin,
    );
    expect(crearLocalidad.status).toBe(201);
    const localidadId = crearLocalidad.data.data.id;
    idsLocalidadesCreadas.push(localidadId);

    const crearBarrio = await peticion<{ data: { id: string } }>(
      puerto,
      "POST",
      "/api/v1/barrios",
      { localidadId, nombre: `Barrio Hospital ${sufijo}` },
      tokenSuperadmin,
    );
    expect(crearBarrio.status).toBe(201);
    idsBarriosCreados.push(crearBarrio.data.data.id);

    const crearHospital = await peticion<{ data: { id: string } }>(
      puerto,
      "POST",
      "/api/v1/hospitales",
      {
        nombre: `Hospital Central Test ${sufijo}`,
        tipoHospital: "publico",
        codigoInterno: `HC-${sufijo}`,
        correoElectronico: "hospital@test.com",
        telefono: "1234567890",
        direccion: "Av. Principal 123",
        provinciaId,
        localidadId,
        barrioId: idsBarriosCreados[0],
        areaMedicaId,
      },
      tokenSuperadmin,
    );
    expect(crearHospital.status).toBe(201);
    const hospitalId = crearHospital.data.data.id;
    idsHospitalesCreados.push(hospitalId);

    const crearSucursal = await peticion<{ data: { id: string } }>(
      puerto,
      "POST",
      "/api/v1/sucursales",
      { hospitalId, nombre: `Sucursal Norte ${sufijo}`, direccion: "Calle 456" },
      tokenSuperadmin,
    );
    expect(crearSucursal.status).toBe(201);
    idsSucursalesCreadas.push(crearSucursal.data.data.id);

    const crearDepartamento = await peticion<{ data: { id: string } }>(
      puerto,
      "POST",
      "/api/v1/departamentos",
      { hospitalId, nombre: `Cardiologia ${sufijo}`, descripcion: "Depto de prueba" },
      tokenSuperadmin,
    );
    expect(crearDepartamento.status).toBe(201);
    const departamentoId = crearDepartamento.data.data.id;
    idsDepartamentosCreados.push(departamentoId);

    const crearConsultorio = await peticion<{ data: { id: string } }>(
      puerto,
      "POST",
      "/api/v1/consultorios",
      { hospitalId, departamentoId, areaMedicaId, nombre: `Consultorio 1 ${sufijo}`, codigoConsultorio: "CON-001" },
      tokenSuperadmin,
    );
    expect(crearConsultorio.status).toBe(201);
    const consultorioId = crearConsultorio.data.data.id;
    idsConsultoriosCreados.push(consultorioId);

    const listarHospitales = await peticion(puerto, "GET", `/api/v1/hospitales?provinciaId=${provinciaId}`, undefined, tokenSuperadmin);
    expect(listarHospitales.status).toBe(200);

    const listarSucursales = await peticion(puerto, "GET", `/api/v1/sucursales?hospitalId=${hospitalId}`, undefined, tokenSuperadmin);
    expect(listarSucursales.status).toBe(200);

    const listarDepartamentos = await peticion(puerto, "GET", `/api/v1/departamentos?hospitalId=${hospitalId}`, undefined, tokenSuperadmin);
    expect(listarDepartamentos.status).toBe(200);

    const listarConsultorios = await peticion(puerto, "GET", `/api/v1/consultorios?hospitalId=${hospitalId}`, undefined, tokenSuperadmin);
    expect(listarConsultorios.status).toBe(200);

    const hospitalDuplicado = await peticion(
      puerto,
      "POST",
      "/api/v1/hospitales",
      { nombre: "Otro Hospital", tipoHospital: "clinica", codigoInterno: `HC-${sufijo}`, provinciaId, localidadId },
      tokenSuperadmin,
    );
    expect(hospitalDuplicado.status).toBe(409);

    const departamentoDuplicado = await peticion(
      puerto,
      "POST",
      "/api/v1/departamentos",
      { hospitalId, nombre: `Cardiologia ${sufijo}` },
      tokenSuperadmin,
    );
    expect(departamentoDuplicado.status).toBe(409);

    const eliminarDepartamentoConConsultorios = await peticion(
      puerto,
      "DELETE",
      `/api/v1/departamentos/${departamentoId}`,
      undefined,
      tokenSuperadmin,
    );
    expect(eliminarDepartamentoConConsultorios.status).toBe(409);

    const actualizarHospital = await peticion<{ data: { nombre: string } }>(
      puerto,
      "PATCH",
      `/api/v1/hospitales/${hospitalId}`,
      { nombre: `Hospital Central Modificado ${sufijo}` },
      tokenSuperadmin,
    );
    expect(actualizarHospital.status).toBe(200);
    expect(actualizarHospital.data.data.nombre).toContain("Modificado");

    const eliminarConsultorio = await peticion(puerto, "DELETE", `/api/v1/consultorios/${consultorioId}`, undefined, tokenSuperadmin);
    expect(eliminarConsultorio.status).toBe(200);

    const eliminarDepartamento = await peticion(puerto, "DELETE", `/api/v1/departamentos/${departamentoId}`, undefined, tokenSuperadmin);
    expect(eliminarDepartamento.status).toBe(200);

    const eliminarSucursal = await peticion(puerto, "DELETE", `/api/v1/sucursales/${idsSucursalesCreadas[0]}`, undefined, tokenSuperadmin);
    expect(eliminarSucursal.status).toBe(200);

    const eliminarHospital = await peticion(puerto, "DELETE", `/api/v1/hospitales/${hospitalId}`, undefined, tokenSuperadmin);
    expect(eliminarHospital.status).toBe(200);

    const hospitalEliminado = await peticion<{ data: { estado: string } }>(
      puerto,
      "GET",
      `/api/v1/hospitales/${hospitalId}`,
      undefined,
      tokenSuperadmin,
    );
    expect(hospitalEliminado.status).toBe(200);
    expect(hospitalEliminado.data.data.estado).toBe("inactive");

    await prisma.hospital.delete({ where: { id: hospitalId } });

    const eliminarAreaMedica = await peticion(puerto, "DELETE", `/api/v1/areas-medicas/${areaMedicaId}`, undefined, tokenSuperadmin);
    expect(eliminarAreaMedica.status).toBe(200);
  });
});
