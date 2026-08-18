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

describe("FASE 10-12: disponibilidad, slots y turnos", () => {
  let servidor: Server;
  let puerto: number;

  const sufijo = `t${Date.now()}${Math.random().toString(36).slice(2, 6)}`;
  const emailSuperadmin = `mvp_super_${sufijo}@test.com`;
  const contrasena = "contrasena123";
  const idsUsuariosCreados: string[] = [];
  let tokenSuperadmin = "";
  let medicoId = "";
  let hospitalId = "";
  let especialidadId = "";
  let reglaId = "";
  let turnoId = "";
  const idsGeograficos: string[] = [];

  beforeAll(async () => {
    await prisma.historialEstadoTurno.deleteMany({ where: {} }).catch(() => {});
    await prisma.documentoTurno.deleteMany({ where: {} }).catch(() => {});
    await prisma.turno.deleteMany({ where: {} }).catch(() => {});
    await prisma.bloqueHorario.deleteMany({ where: {} }).catch(() => {});
    await prisma.reglaDisponibilidadMedico.deleteMany({ where: {} }).catch(() => {});
    await prisma.excepcionDisponibilidadMedico.deleteMany({ where: {} }).catch(() => {});
    await prisma.especialidadMedico.deleteMany({ where: {} }).catch(() => {});
    await prisma.hospitalMedico.deleteMany({ where: {} }).catch(() => {});
    await prisma.relacionAtencionPaciente.deleteMany({ where: {} }).catch(() => {});
    await prisma.matricula.deleteMany({ where: {} }).catch(() => {});
    await prisma.receta.deleteMany({ where: {} }).catch(() => {});
    await prisma.diagnostico.deleteMany({ where: {} }).catch(() => {});
    await prisma.tratamiento.deleteMany({ where: {} }).catch(() => {});
    await prisma.eventoMedico.deleteMany({ where: {} }).catch(() => {});
    await prisma.notificacion.deleteMany({ where: {} }).catch(() => {});
    await prisma.medico.deleteMany({ where: {} }).catch(() => {});
    await prisma.hospital.deleteMany({ where: { nombre: { contains: "MVP" } } }).catch(() => {});
    await prisma.reporte.deleteMany({ where: {} }).catch(() => {});
    await prisma.preferenciaNotificacion.deleteMany({ where: {} }).catch(() => {});
    await prisma.registroConsentimiento.deleteMany({ where: {} }).catch(() => {});
    await prisma.verificacionIdentidad.deleteMany({ where: {} }).catch(() => {});
    await prisma.usuarioRol.deleteMany({ where: {} }).catch(() => {});
    await prisma.sesion.deleteMany({ where: {} }).catch(() => {});
    await prisma.usuario.deleteMany({ where: { correoElectronico: { contains: "mvp_" } } }).catch(() => {});

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
    if (medicoId) {
      await prisma.historialEstadoTurno.deleteMany({ where: { turno: { medicoId } } }).catch(() => {});
      await prisma.documentoTurno.deleteMany({ where: { turno: { medicoId } } }).catch(() => {});
      await prisma.turno.deleteMany({ where: { medicoId } }).catch(() => {});
      await prisma.bloqueHorario.deleteMany({ where: { medicoId } }).catch(() => {});
      await prisma.reglaDisponibilidadMedico.deleteMany({ where: { medicoId } }).catch(() => {});
      await prisma.excepcionDisponibilidadMedico.deleteMany({ where: { medicoId } }).catch(() => {});
      await prisma.especialidadMedico.deleteMany({ where: { medicoId } }).catch(() => {});
      await prisma.hospitalMedico.deleteMany({ where: { medicoId } }).catch(() => {});
      await prisma.relacionAtencionPaciente.deleteMany({ where: { medicoId } }).catch(() => {});
      await prisma.matricula.deleteMany({ where: { medicoId } }).catch(() => {});
      await prisma.receta.deleteMany({ where: { medicoId } }).catch(() => {});
      await prisma.diagnostico.deleteMany({ where: { medicoId } }).catch(() => {});
      await prisma.tratamiento.deleteMany({ where: { medicoId } }).catch(() => {});
      await prisma.eventoMedico.deleteMany({ where: { medicoId } }).catch(() => {});
      await prisma.notificacion.deleteMany({ where: { medicoId } }).catch(() => {});
      await prisma.medico.deleteMany({ where: { id: medicoId } }).catch(() => {});
    }
    if (hospitalId) {
      await prisma.hospital.deleteMany({ where: { id: hospitalId } }).catch(() => {});
    }
    if (idsGeograficos.length > 0) {
      await prisma.barrio.deleteMany({ where: { id: { in: idsGeograficos } } }).catch(() => {});
      await prisma.localidad.deleteMany({ where: { id: { in: idsGeograficos } } }).catch(() => {});
      await prisma.provincia.deleteMany({ where: { id: { in: idsGeograficos } } }).catch(() => {});
      await prisma.pais.deleteMany({ where: { id: { in: idsGeograficos } } }).catch(() => {});
    }
    await prisma.sesion.deleteMany({ where: { usuarioId: { in: idsUsuariosCreados } } });
    await prisma.usuarioRol.deleteMany({ where: { usuarioId: { in: idsUsuariosCreados } } });
    await prisma.usuario.deleteMany({ where: { id: { in: idsUsuariosCreados } } });
    await prisma.$disconnect();
    servidor.close();
  });

  async function registrarYLogin(email: string, codigoRol: string, prefijoDni: string): Promise<string> {
    const dni = `${prefijoDni}${codigoRol}${sufijo}`.slice(0, 20);
    const respuesta = await peticion<{ data: { id: string } }>(puerto, "POST", "/api/v1/auth/register", {
      dni,
      correoElectronico: email,
      contrasena,
      nombre: "Nombre",
      apellido: "Apellido",
    });

    if (respuesta.status === 201) {
      const id = respuesta.data.data.id;
      idsUsuariosCreados.push(id);
      const rol = await prisma.rol.findUnique({ where: { codigo: codigoRol } });
      expect(rol).not.toBeNull();
      await prisma.usuarioRol.create({ data: { usuarioId: id, rolId: rol!.id } });
    } else if (respuesta.status === 409) {
      const existente = await prisma.usuario.findUnique({ where: { correoElectronico: email } });
      if (existente) idsUsuariosCreados.push(existente.id);
    } else {
      expect(respuesta.status).toBe(201);
    }

    const login = await peticion<{ data: { tokenAcceso: string } }>(puerto, "POST", "/api/v1/auth/login", {
      correoElectronico: email,
      contrasena,
    });
    expect(login.status).toBe(200);
    return login.data.data.tokenAcceso;
  }

  it("flujo completo: disponibilidad → slots → turnos", async () => {
    tokenSuperadmin = await registrarYLogin(emailSuperadmin, "superadmin", "mvp");

    const crearEspecialidad = await peticion<{ data: { id: string } }>(
      puerto, "POST", "/api/v1/especialidades",
      { nombre: `Cardio MVP ${sufijo}`, descripcion: "Especialidad de prueba" },
      tokenSuperadmin,
    );
    expect(crearEspecialidad.status).toBe(201);
    especialidadId = crearEspecialidad.data.data.id;

    const doctorUserId = idsUsuariosCreados[0];
    const crearMedico = await peticion<{ data: { id: string } }>(
      puerto, "POST", "/api/v1/medicos",
      { usuarioId: doctorUserId, numeroMatricula: `MAT-MVP-${sufijo}` },
      tokenSuperadmin,
    );
    expect(crearMedico.status).toBe(201);
    medicoId = crearMedico.data.data.id;

    await prisma.especialidadMedico.create({
      data: { medicoId, especialidadId },
    });

    const crearPais = await peticion<{ data: { id: string } }>(
      puerto, "POST", "/api/v1/paises",
      { nombre: `Pais MVP ${sufijo}` },
      tokenSuperadmin,
    );
    expect(crearPais.status).toBe(201);
    idsGeograficos.push(crearPais.data.data.id);

    const crearProvincia = await peticion<{ data: { id: string } }>(
      puerto, "POST", "/api/v1/provincias",
      { paisId: crearPais.data.data.id, nombre: `Prov MVP ${sufijo}` },
      tokenSuperadmin,
    );
    expect(crearProvincia.status).toBe(201);
    idsGeograficos.push(crearProvincia.data.data.id);

    const crearLocalidad = await peticion<{ data: { id: string } }>(
      puerto, "POST", "/api/v1/localidades",
      { provinciaId: crearProvincia.data.data.id, nombre: `Local MVP ${sufijo}` },
      tokenSuperadmin,
    );
    expect(crearLocalidad.status).toBe(201);
    idsGeograficos.push(crearLocalidad.data.data.id);

    const crearHospital = await peticion<{ data: { id: string } }>(
      puerto, "POST", "/api/v1/hospitales",
      {
        nombre: `Hospital MVP ${sufijo}`,
        tipoHospital: "publico",
        codigoInterno: `HMVP-${sufijo}`,
        provinciaId: crearProvincia.data.data.id,
        localidadId: crearLocalidad.data.data.id,
      },
      tokenSuperadmin,
    );
    expect(crearHospital.status).toBe(201);
    hospitalId = crearHospital.data.data.id;

    const crearRegla = await peticion<{ data: { id: string } }>(
      puerto, "POST", "/api/v1/availability/rules",
      {
        medicoId,
        hospitalId,
        diaSemana: 1,
        horaInicio: "08:00",
        horaFin: "12:00",
        duracionBloqueMinutos: 30,
        minutosDescanso: 0,
      },
      tokenSuperadmin,
    );
    expect(crearRegla.status).toBe(201);
    reglaId = crearRegla.data.data.id;

    const listarReglas = await peticion<{ data: Array<{ id: string }> }>(
      puerto, "GET", `/api/v1/availability/rules?medicoId=${medicoId}`,
      undefined, tokenSuperadmin,
    );
    expect(listarReglas.status).toBe(200);
    expect(listarReglas.data.data.length).toBeGreaterThan(0);

    const obtenerRegla = await peticion(
      puerto, "GET", `/api/v1/availability/rules/${reglaId}`,
      undefined, tokenSuperadmin,
    );
    expect(obtenerRegla.status).toBe(200);

    const actualizarRegla = await peticion(
      puerto, "PATCH", `/api/v1/availability/rules/${reglaId}`,
      { horaFin: "13:00" },
      tokenSuperadmin,
    );
    expect(actualizarRegla.status).toBe(200);

    const generarSlots = await peticion<{ data: { slotsCreados: number } }>(
      puerto, "POST", "/api/v1/slots/generate",
      {
        medicoId,
        hospitalId,
        fechaInicio: "2026-08-17",
        fechaFin: "2026-08-23",
      },
      tokenSuperadmin,
    );
    expect(generarSlots.status).toBe(201);

    const listarSlots = await peticion<{ data: Array<{ id: string }> }>(
      puerto, "GET", `/api/v1/slots/by-doctor/${medicoId}?hospitalId=${hospitalId}`,
      undefined, tokenSuperadmin,
    );
    expect(listarSlots.status).toBe(200);
    expect(listarSlots.data.data.length).toBeGreaterThan(0);
    const slotId = listarSlots.data.data[0].id;

    const listarDisponibles = await peticion(
      puerto, "GET", `/api/v1/slots/available?doctorId=${medicoId}&hospitalId=${hospitalId}&date=2026-08-18`,
      undefined, tokenSuperadmin,
    );
    expect(listarDisponibles.status).toBe(200);

    const bloquearSlot = await peticion(
      puerto, "PATCH", `/api/v1/slots/${slotId}/block`,
      undefined, tokenSuperadmin,
    );
    expect(bloquearSlot.status).toBe(200);

    const desbloquearSlot = await peticion(
      puerto, "PATCH", `/api/v1/slots/${slotId}/unblock`,
      undefined, tokenSuperadmin,
    );
    expect(desbloquearSlot.status).toBe(200);

    const eliminarReglaConBloques = await peticion(
      puerto, "DELETE", `/api/v1/availability/rules/${reglaId}`,
      undefined, tokenSuperadmin,
    );
    expect(eliminarReglaConBloques.status).toBe(409);

    const reservarTurno = await peticion<{ data: { id: string } }>(
      puerto, "POST", "/api/v1/appointments",
      {
        slotId,
        especialidadId,
        modo: "presencial",
        motivo: "Consulta de rutina",
      },
      tokenSuperadmin,
    );
    expect(reservarTurno.status).toBe(201);
    turnoId = reservarTurno.data.data.id;

    const obtenerTurno = await peticion(
      puerto, "GET", `/api/v1/appointments/${turnoId}`,
      undefined, tokenSuperadmin,
    );
    expect(obtenerTurno.status).toBe(200);

    const listarTurnos = await peticion(
      puerto, "GET", `/api/v1/appointments?hospitalId=${hospitalId}`,
      undefined, tokenSuperadmin,
    );
    expect(listarTurnos.status).toBe(200);

    const confirmarTurno = await peticion(
      puerto, "PATCH", `/api/v1/appointments/${turnoId}/confirm`,
      undefined, tokenSuperadmin,
    );
    expect(confirmarTurno.status).toBe(200);

    const checkInTurno = await peticion(
      puerto, "PATCH", `/api/v1/appointments/${turnoId}/check-in`,
      undefined, tokenSuperadmin,
    );
    expect(checkInTurno.status).toBe(200);

    const finalizarTurno = await peticion(
      puerto, "PATCH", `/api/v1/appointments/${turnoId}/complete`,
      undefined, tokenSuperadmin,
    );
    expect(finalizarTurno.status).toBe(200);

    const reintentarFinalizar = await peticion(
      puerto, "PATCH", `/api/v1/appointments/${turnoId}/complete`,
      undefined, tokenSuperadmin,
    );
    expect(reintentarFinalizar.status).toBe(409);
  });

  it("cancelar y reprogramar turno", async () => {
    if (!tokenSuperadmin) {
      tokenSuperadmin = await registrarYLogin(emailSuperadmin, "superadmin", "mvp");
    }

    if (!hospitalId) {
      const existeHospital = await prisma.hospital.findFirst();
      if (existeHospital) hospitalId = existeHospital.id;
    }
    if (!medicoId) {
      const existeMedico = await prisma.medico.findFirst();
      if (existeMedico) medicoId = existeMedico.id;
    }
    if (!especialidadId) {
      const existeEspecialidad = await prisma.especialidad.findFirst();
      if (existeEspecialidad) especialidadId = existeEspecialidad.id;
    }

    if (!hospitalId || !medicoId || !especialidadId) return;

    const generarSlots2 = await peticion(
      puerto, "POST", "/api/v1/slots/generate",
      { medicoId, hospitalId, fechaInicio: "2026-08-24", fechaFin: "2026-08-28" },
      tokenSuperadmin,
    );
    expect(generarSlots2.status).toBe(201);

    const slots2 = await peticion<{ data: Array<{ id: string }> }>(
      puerto, "GET", `/api/v1/slots/available?doctorId=${medicoId}&hospitalId=${hospitalId}&date=2026-08-25`,
      undefined, tokenSuperadmin,
    );

    if (slots2.status === 200 && slots2.data.data.length >= 2) {
      const slotId1 = slots2.data.data[0].id;
      const slotId2 = slots2.data.data[1].id;

      const turno2 = await peticion<{ data: { id: string } }>(
        puerto, "POST", "/api/v1/appointments",
        { slotId: slotId1, especialidadId, modo: "virtual", motivo: "Control" },
        tokenSuperadmin,
      );
      expect(turno2.status).toBe(201);
      const turnoId2 = turno2.data.data.id;

      const cancelar = await peticion(
        puerto, "PATCH", `/api/v1/appointments/${turnoId2}/cancel`,
        { motivo: "No puedo asistir" },
        tokenSuperadmin,
      );
      expect(cancelar.status).toBe(200);

      const turno3 = await peticion<{ data: { id: string } }>(
        puerto, "POST", "/api/v1/appointments",
        { slotId: slotId2, especialidadId, modo: "presencial" },
        tokenSuperadmin,
      );
      expect(turno3.status).toBe(201);
      const turnoId3 = turno3.data.data.id;

      const confirmar3 = await peticion(
        puerto, "PATCH", `/api/v1/appointments/${turnoId3}/confirm`,
        undefined, tokenSuperadmin,
      );
      expect(confirmar3.status).toBe(200);

      const reprogramar = await peticion(
        puerto, "PATCH", `/api/v1/appointments/${turnoId3}/reschedule`,
        { nuevoSlotId: slotId1, motivo: "Cambio de fecha" },
        tokenSuperadmin,
      );
      expect(reprogramar.status).toBe(200);

      await prisma.historialEstadoTurno.deleteMany({ where: { turnoId: turnoId2 } }).catch(() => {});
      await prisma.turno.deleteMany({ where: { id: turnoId2 } }).catch(() => {});
      await prisma.historialEstadoTurno.deleteMany({ where: { turnoId: turnoId3 } }).catch(() => {});
      await prisma.turno.deleteMany({ where: { id: turnoId3 } }).catch(() => {});
    }
  });

  it("rechazar turno en slot no disponible", async () => {
    if (!tokenSuperadmin) {
      tokenSuperadmin = await registrarYLogin(emailSuperadmin, "superadmin", "mvp");
    }

    const listarSlots = await peticion<{ data: Array<{ id: string }> }>(
      puerto, "GET", `/api/v1/slots/by-doctor/${medicoId}?hospitalId=${hospitalId}`,
      undefined, tokenSuperadmin,
    );

    if (listarSlots.status === 200 && listarSlots.data.data.length > 0) {
      const slotOcupado = listarSlots.data.data.find((s: any) => s.estado !== 'disponible') || listarSlots.data.data[0];
      const reservar = await peticion(
        puerto, "POST", "/api/v1/appointments",
        { slotId: slotOcupado.id, especialidadId, modo: "presencial" },
        tokenSuperadmin,
      );
      expect(reservar.status).toBe(409);
    }
  });
});
