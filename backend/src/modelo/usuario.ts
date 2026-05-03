export interface CrearUsuario {
  ci: string;
  nombre_completo: string;
  password: string;
  id_rol: number;
}

export interface ActualizarUsuario {
  ci?: string;
  nombre_completo?: string;
  password?: string;
  id_rol?: number;
}