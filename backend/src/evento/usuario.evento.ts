import { EventEmitter } from "events";

export const usuarioEvents = new EventEmitter();
// Definimos la forma que debe tener cualquier función de auditoría
export type AuditoriaDelegate = (accion: string, usuario: string) => void;

// Un "Método Anónimo" que actúa como listener
const logger: AuditoriaDelegate = (accion, usuario) => {
  console.log(`[AUDITORÍA ${new Date().toLocaleTimeString()}]: ${accion} por ${usuario}`);
};

usuarioEvents.on("usuarioCreado", (nombre: string) => {
  logger("REGISTRO_NUEVO", nombre);
});

// EventEmitter para usuarios
export const eventosUsuario = new EventEmitter();

// Delegado (firma de función)
export type OperacionUsuario = (ci: string, nombre:string) => void;

// Suscripción al evento
eventosUsuario.on("usuarioCreado", (ci: string ,nombre:string) => {
  console.log(`📢 Usuario creado con CI ${ci} nombre ${nombre}`);
});
