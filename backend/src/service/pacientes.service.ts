
import { prisma } from "../lib/conexion.js";

export class PacienteService {

  // 🔍 Verifica si ya existe un paciente por CI
  async existeCI(ci: string) {
    return await prisma.pacientes.findUnique({
      where: { ci }
    });
  }

  // 👤 Crear paciente con contraseña encriptada
  async CrearPaciente(data: {
    ci: string;
    nombre_completo: string;
    
    
  }) {

    

    return await prisma.pacientes.create({
      data: {
        ci: data.ci,
        nombre_completo: data.nombre_completo,
      },
      select: {
        id_paciente: true,
        nombre_completo: true,
      }
    });
  }

 

  // Buscar por ID
  async buscarPorId(id: number) {
    return prisma.pacientes.findUnique({
      where: { id_paciente: id }
    });
  }

  async obtenerPacientes() {
  return prisma.pacientes.findMany({
    orderBy: { id_paciente: 'desc' }
  });
}

// Actualizar paciente
  async actualizarPaciente(id: number, data: any) {

    let updateData: any = {
      ci: data.ci,
      nombre_completo: data.nombre_completo,
    };

   

    return prisma.pacientes.update({
      where: { id_paciente: id },
      data: updateData
    });
  }

// Eliminar paciente
  async eliminarPaciente(id: number) {
    return prisma.pacientes.delete({
      where: { id_paciente: id }
    });
  }
  
}