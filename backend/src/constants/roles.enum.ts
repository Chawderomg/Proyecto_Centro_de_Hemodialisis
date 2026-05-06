export enum RolUsuario {
  ADMIN = 1,
  ENFERMERIA = 2,
  ALMACEN = 3
}

export interface IUsuarioBase {
  readonly ci: string;
  readonly nombre_completo: string;
  readonly id_rol: RolUsuario;
}


// --- INDEXERS ---
// Útil para los mensajes de bienvenida sin usar mil IFs

export const MensajesBienvenida: Record<RolUsuario, string> = {
  [RolUsuario.ADMIN]: "Bienvenido, Administrador Principal. Tienes acceso total.",
  [RolUsuario.ALMACEN]: "Acceso concedido al Inventario. Revisa las fechas de vencimiento.",
  [RolUsuario.ENFERMERIA]: "Bienvenido al sistema de consulta."
};