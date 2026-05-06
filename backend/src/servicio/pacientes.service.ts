

import { prisma } from "../lib/conexion.js";
import { eventosPaciente } from "../evento/paciente.js";
import { Paciente } from "../modelo/paciente.js";

export class PacienteService {
  //virficar ci existe
  async existeCI(ci: string) {
    return await prisma.pacientes.findUnique({ where: { ci } });
  }
  async CrearPaciente(data: { ci: string; nombre_completo: string }) {
    const paciente = new Paciente(data.ci, data.nombre_completo);

    const nuevo = await prisma.pacientes.create({
      data: {
        ci: paciente.getCI(),
        nombre_completo: paciente.getNombre(),
         es_activo: true
      },
      select: { id_paciente: true, nombre_completo: true, es_activo: true }
    });

    // Emitir evento (modelo de eventos)
    eventosPaciente.emit("pacienteCreado", paciente.getCI(),paciente.getNombre());

     return {
      ...nuevo,
      estado: nuevo.es_activo ? "Activo" : "Inactivo"
    };
  }

  async buscarPorId(id: number) {
    return prisma.pacientes.findUnique({ where: { id_paciente: id } });
  }

  async obtenerPacientes() {
    return prisma.pacientes.findMany({ orderBy: { id_paciente: "desc" } });
  }

  async actualizarPaciente(id: number, data: any) {
    return prisma.pacientes.update({
      where: { id_paciente: id },
      data: { ci: data.ci, nombre_completo: data.nombre_completo }
    });
  }

  async eliminarPaciente(id: number) {
    return prisma.pacientes.delete({ where: { id_paciente: id } });
  }
}
