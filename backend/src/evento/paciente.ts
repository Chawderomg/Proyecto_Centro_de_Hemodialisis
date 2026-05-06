import { EventEmitter } from "events";

export const eventosPaciente = new EventEmitter();

// Delegado (firma de función)
export type OperacionPaciente = (ci: string) => void;

// Suscripción a eventos
eventosPaciente.on("pacienteCreado", (ci: string) => {
  console.log(`📢 Evento: Paciente creado con CI ${ci}`);
});
