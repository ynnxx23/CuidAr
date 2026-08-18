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

describe("FASE 9: personal de salud, medicos, especialidades, matriculas, hospitales asociados", () => {
  let servidor: Server;
  let puerto: number;

  const sufijo = Date.now();
  const emailSuperadmin = `doc_super_${sufijo}@test.com`;
  const emailPaciente = `doc_pac_${sufijo}@test.com`;
  const emailMedicoUsuario = `doc_medico_${sufijo}@test.com`;
  const contrasena = "contrasena123";
  const idsUsuariosCreados: string[] = [];
  const idsEspecialidadesCreadas: string[] = [];
  const idsMedicosCreados: string[] = [];
  const idsMatriculasCreadas: string[] = [];
  const idsHospitalMedicoCreados: string[] = [];
  const idsEspecialidadMedicoCreados: string[] = [];
  const idsHospitalesCreados: string[] = [];
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
    await prisma.hospitalMedico.deleteMany({ where: { id: { in: idsHospitalMedicoCreados } } });
    await prisma.especialidadMedico.deleteMany({ where: { id: { in: idsEspecialidadMedicoCreados } } });
    await prisma.matricula.deleteMany({ where: { id: { in: idsMatriculasCreadas } } });
    await prisma.medico.deleteMany({ where: { id: { in: idsMedicosCreados } } });
    await prisma.especialidad.deleteMany({ where: { id: { in: idsEspecialidadesCreadas } } });
    await prisma.hospital.deleteMany({ where: { id: { in: idsHospitalesCreados } } });
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

  async function registrarYLogin(email: string, codigoRol: string): Promise<{ id: string; token: string }> {
    const respuesta = await peticion<{ data: { id: string } }>(puerto, "POST", "/api/v1/auth/register", {
      dni: `doc${codigoRol}${sufijo}`.slice(0, 20),
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

  it("escenario superadmin gestiona personal de salud; paciente denegado", async () => {
    const superadmin = await registrarYLogin(emailSuperadmin, "superadmin");
    const paciente = await registrarYLogin(emailPaciente, "patient");
    const medicoUsuario = await registrarYLogin(emailMedicoUsuario, "doctor");

    const pacienteMedicos = await peticion(puerto, "GET", "/api/v1/medicos", undefined, paciente.token);
    expect(pacienteMedicos.status).toBe(403);

    const crearEspecialidad = await peticion<{ data: { id: string } }>(
      puerto,
      "POST",
      "/api/v1/especialidades",
      { nombre: `Cardiologia ${sufijo}`, descripcion: "Especialidad de prueba" },
      superadmin.token,
    );
    expect(crearEspecialidad.status).toBe(201);
    const especialidadId = crearEspecialidad.data.data.id;
    idsEspecialidadesCreadas.push(especialidadId);

    const crearSubespecialidad = await peticion<{ data: { id: string } }>(
      puerto,
      "POST",
      "/api/v1/especialidades",
      { nombre: `Cardiologia Pediatrica ${sufijo}`, especialidadPadreId: especialidadId },
      superadmin.token,
    );
    expect(crearSubespecialidad.status).toBe(201);
    const subespecialidadId = crearSubespecialidad.data.data.id;
    idsEspecialidadesCreadas.push(subespecialidadId);

    const especialidadDuplicada = await peticion(
      puerto,
      "POST",
      "/api/v1/especialidades",
      { nombre: `Cardiologia ${sufijo}` },
      superadmin.token,
    );
    expect(especialidadDuplicada.status).toBe(409);

    const crearMedico = await peticion<{ data: { id: string } }>(
      puerto,
      "POST",
      "/api/v1/medicos",
      {
        usuarioId: medicoUsuario.id,
        numeroMatricula: `MAT-${sufijo}`,
        biografia: "Médico de prueba",
        estadoLaboral: "disponible",
      },
      superadmin.token,
    );
    expect(crearMedico.status).toBe(201);
    const medicoId = crearMedico.data.data.id;
    idsMedicosCreados.push(medicoId);

    const medicoDuplicado = await peticion(
      puerto,
      "POST",
      "/api/v1/medicos",
      { usuarioId: medicoUsuario.id, numeroMatricula: `MAT2-${sufijo}` },
      superadmin.token,
    );
    expect(medicoDuplicado.status).toBe(409);

    const medicoUsuarioInexistente = await peticion(
      puerto,
      "POST",
      "/api/v1/medicos",
      { usuarioId: "22222222-2222-2222-2222-222222222222", numeroMatricula: `MAT3-${sufijo}` },
      superadmin.token,
    );
    expect(medicoUsuarioInexistente.status).toBe(404);

    const crearMatricula = await peticion<{ data: { id: string } }>(
      puerto,
      "POST",
      "/api/v1/matriculas",
      {
        medicoId,
        numeroMatricula: `MP-${sufijo}`,
        tipo: "nacional",
        autoridadEmisora: "Ministerio de Salud",
        especialidadId,
      },
      superadmin.token,
    );
    expect(crearMatricula.status).toBe(201);
    const matriculaId = crearMatricula.data.data.id;
    idsMatriculasCreadas.push(matriculaId);

    const matriculaDuplicada = await peticion(
      puerto,
      "POST",
      "/api/v1/matriculas",
      { medicoId, numeroMatricula: `MP-${sufijo}` },
      superadmin.token,
    );
    expect(matriculaDuplicada.status).toBe(409);

    const matriculaMedicoInexistente = await peticion(
      puerto,
      "POST",
      "/api/v1/matriculas",
      { medicoId: "33333333-3333-3333-3333-333333333333", numeroMatricula: `MP2-${sufijo}` },
      superadmin.token,
    );
    expect(matriculaMedicoInexistente.status).toBe(404);

    const crearEspecialidadMedico = await peticion<{ data: { id: string } }>(
      puerto,
      "POST",
      "/api/v1/medicos-especialidades",
      { medicoId, especialidadId, principal: true },
      superadmin.token,
    );
    expect(crearEspecialidadMedico.status).toBe(201);
    const especialidadMedicoId = crearEspecialidadMedico.data.data.id;
    idsEspecialidadMedicoCreados.push(especialidadMedicoId);

    const especialidadMedicoDuplicada = await peticion(
      puerto,
      "POST",
      "/api/v1/medicos-especialidades",
      { medicoId, especialidadId },
      superadmin.token,
    );
    expect(especialidadMedicoDuplicada.status).toBe(409);

    const crearPais = await peticion<{ data: { id: string } }>(
      puerto,
      "POST",
      "/api/v1/paises",
      { nombre: `Pais Medico ${sufijo}` },
      superadmin.token,
    );
    expect(crearPais.status).toBe(201);
    const paisId = crearPais.data.data.id;
    idsPaisesCreados.push(paisId);

    const crearProvincia = await peticion<{ data: { id: string } }>(
      puerto,
      "POST",
      "/api/v1/provincias",
      { paisId, nombre: `Provincia Medico ${sufijo}` },
      superadmin.token,
    );
    expect(crearProvincia.status).toBe(201);
    const provinciaId = crearProvincia.data.data.id;
    idsProvinciasCreadas.push(provinciaId);

    const crearLocalidad = await peticion<{ data: { id: string } }>(
      puerto,
      "POST",
      "/api/v1/localidades",
      { provinciaId, nombre: `Localidad Medico ${sufijo}` },
      superadmin.token,
    );
    expect(crearLocalidad.status).toBe(201);
    const localidadId = crearLocalidad.data.data.id;
    idsLocalidadesCreadas.push(localidadId);

    const crearBarrio = await peticion<{ data: { id: string } }>(
      puerto,
      "POST",
      "/api/v1/barrios",
      { localidadId, nombre: `Barrio Medico ${sufijo}` },
      superadmin.token,
    );
    expect(crearBarrio.status).toBe(201);
    const barrioId = crearBarrio.data.data.id;
    idsBarriosCreados.push(barrioId);

    const crearHospital = await peticion<{ data: { id: string } }>(
      puerto,
      "POST",
      "/api/v1/hospitales",
      {
        nombre: `Hospital Medico Test ${sufijo}`,
        tipoHospital: "publico",
        codigoInterno: `HM-${sufijo}`,
        correoElectronico: "hmedico@test.com",
        telefono: "1234567890",
        direccion: "Av. Principal 456",
        provinciaId,
        localidadId,
        barrioId,
      },
      superadmin.token,
    );
    expect(crearHospital.status).toBe(201);
    const hospitalId = crearHospital.data.data.id;
    idsHospitalesCreados.push(hospitalId);

    const crearHospitalMedico = await peticion<{ data: { id: string } }>(
      puerto,
      "POST",
      "/api/v1/medicos-hospitales",
      { medicoId, hospitalId, activo: true },
      superadmin.token,
    );
    expect(crearHospitalMedico.status).toBe(201);
    const hospitalMedicoId = crearHospitalMedico.data.data.id;
    idsHospitalMedicoCreados.push(hospitalMedicoId);

    const hospitalMedicoDuplicado = await peticion(
      puerto,
      "POST",
      "/api/v1/medicos-hospitales",
      { medicoId, hospitalId },
      superadmin.token,
    );
    expect(hospitalMedicoDuplicado.status).toBe(409);

    const listarMatriculas = await peticion(puerto, "GET", `/api/v1/matriculas?medicoId=${medicoId}`, undefined, superadmin.token);
    expect(listarMatriculas.status).toBe(200);

    const listarEspecialidadesMedico = await peticion(
      puerto,
      "GET",
      `/api/v1/medicos-especialidades?medicoId=${medicoId}`,
      undefined,
      superadmin.token,
    );
    expect(listarEspecialidadesMedico.status).toBe(200);

    const listarHospitalesMedico = await peticion(
      puerto,
      "GET",
      `/api/v1/medicos-hospitales?medicoId=${medicoId}`,
      undefined,
      superadmin.token,
    );
    expect(listarHospitalesMedico.status).toBe(200);

    const actualizarMedico = await peticion<{ data: { estadoLaboral: string } }>(
      puerto,
      "PATCH",
      `/api/v1/medicos/${medicoId}`,
      { estadoLaboral: "atendiendo" },
      superadmin.token,
    );
    expect(actualizarMedico.status).toBe(200);
    expect(actualizarMedico.data.data.estadoLaboral).toBe("atendiendo");

    const actualizarMatricula = await peticion<{ data: { activo: boolean } }>(
      puerto,
      "PATCH",
      `/api/v1/matriculas/${matriculaId}`,
      { activo: false },
      superadmin.token,
    );
    expect(actualizarMatricula.status).toBe(200);
    expect(actualizarMatricula.data.data.activo).toBe(false);

    const eliminarMedicoConMatricula = await peticion(
      puerto,
      "DELETE",
      `/api/v1/medicos/${medicoId}`,
      undefined,
      superadmin.token,
    );
    expect(eliminarMedicoConMatricula.status).toBe(409);

    const eliminarEspecialidadConHija = await peticion(
      puerto,
      "DELETE",
      `/api/v1/especialidades/${especialidadId}`,
      undefined,
      superadmin.token,
    );
    expect(eliminarEspecialidadConHija.status).toBe(409);

    const eliminarMatricula = await peticion(puerto, "DELETE", `/api/v1/matriculas/${matriculaId}`, undefined, superadmin.token);
    expect(eliminarMatricula.status).toBe(200);

    const eliminarEspecialidadMedico = await peticion(
      puerto,
      "DELETE",
      `/api/v1/medicos-especialidades/${especialidadMedicoId}`,
      undefined,
      superadmin.token,
    );
    expect(eliminarEspecialidadMedico.status).toBe(200);

    const eliminarHospitalMedico = await peticion(
      puerto,
      "DELETE",
      `/api/v1/medicos-hospitales/${hospitalMedicoId}`,
      undefined,
      superadmin.token,
    );
    expect(eliminarHospitalMedico.status).toBe(200);

    const eliminarMedico = await peticion(puerto, "DELETE", `/api/v1/medicos/${medicoId}`, undefined, superadmin.token);
    expect(eliminarMedico.status).toBe(200);

    const eliminarSubespecialidad = await peticion(
      puerto,
      "DELETE",
      `/api/v1/especialidades/${subespecialidadId}`,
      undefined,
      superadmin.token,
    );
    expect(eliminarSubespecialidad.status).toBe(200);

    const eliminarEspecialidad = await peticion(
      puerto,
      "DELETE",
      `/api/v1/especialidades/${especialidadId}`,
      undefined,
      superadmin.token,
    );
    expect(eliminarEspecialidad.status).toBe(200);
  });
});
