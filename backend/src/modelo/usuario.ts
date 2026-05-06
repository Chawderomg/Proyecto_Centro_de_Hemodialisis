import { RolUsuario } from "../constants/roles.enum.js";

// Clase Usuario con encapsulamiento
export class Usuario {
  private ci: string;
  private nombre_completo: string;
  private password_hash: string;
  private id_rol: RolUsuario;

  constructor(ci: string, nombre_completo: string, password_hash: string, id_rol: RolUsuario) {
    this.ci = ci;
    this.nombre_completo = nombre_completo;
    this.password_hash = password_hash;
    this.id_rol = id_rol;
  }

  getCI(): string { return this.ci; }
  getNombre(): string { return this.nombre_completo; }
  getPasswordHash(): string { return this.password_hash; }
  getRol(): RolUsuario { return this.id_rol; }
}
