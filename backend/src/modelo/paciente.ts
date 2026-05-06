// Enumerador para estado del paciente
// Enumerador para estado del paciente
export enum EstadoPaciente {
  Activo = "Activo",
  Inactivo = "Inactivo"
}


// Estructura para dirección
export interface Direccion {
  calle: string;
  ciudad: string;
  pais: string;
}

// Clase Paciente con encapsulamiento
export class Paciente {
  private ci: string;
  private nombre_completo: string;
  private es_activo: EstadoPaciente;

  constructor(ci: string, nombre_completo: string, es_activo: EstadoPaciente = EstadoPaciente.Activo) {
    this.ci = ci;
    this.nombre_completo = nombre_completo;
    this.es_activo = es_activo;
  }

  // Getters y setters (encapsulamiento)
  getCI(): string { return this.ci; }
  getNombre(): string { return this.nombre_completo; }
  setNombre(nuevo: string) { this.nombre_completo = nuevo; }
  //getEstado(): EstadoPaciente { return this.es_activo; }
  getEstado(): EstadoPaciente { return this.es_activo ? EstadoPaciente.Activo : EstadoPaciente.Inactivo; }
}
