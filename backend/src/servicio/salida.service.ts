import { prisma } from "../lib/conexion.js";

export class SalidaService {

  // 1. Registrar una nueva salida (El Trigger restará el stock automáticamente)
  async registrarSalidaa(data: {
    id_lote: number;
    id_usuario: number;
    id_paciente: number;
    cantidad: number;
  }) {
    // verificar si hay stock suficiente antes de intentar insertar
    const lote = await prisma.lotes.findUnique({
      where: { id_lote: data.id_lote }
    });

    if (!lote || lote.cantidad_disponible < data.cantidad) {
      throw new Error("Stock insuficiente en el lote seleccionado");
    }

    return await prisma.salidas.create({
      data: {
        id_lote: data.id_lote,
        id_usuario: data.id_usuario,
        id_paciente: data.id_paciente,
        cantidad: data.cantidad
      }
    });
  }

  async registrarSalida(data: any) {
  const idLote = Number(data.id_lote);
  const cantidad = Number(data.cantidad);
  const idPaciente = Number(data.id_paciente);
  const idUsuario = Number(data.id_usuario);

  // 2. Ahora usamos los valores convertidos en la consulta
  const lote = await prisma.lotes.findUnique({
    where: { 
      id_lote: idLote 
    }
  });

  if (!lote || lote.cantidad_disponible < cantidad) {
    throw new Error("Stock insuficiente");
  }

  return await prisma.salidas.create({
    data: {
      id_lote: idLote,
      id_usuario: idUsuario,
      id_paciente: idPaciente,
      cantidad: cantidad
    }
  });
}
  // 2. Obtener el historial detallado (Para el reporte de Rodrigo)
  async obtenerHistorial() {

    return await prisma.$queryRaw`
      SELECT 
          s.id_salida,
          s.fecha_salida,
          u.nombre_completo AS enfermera,
          p.nombre_completo AS paciente,
          i.nombre AS insumo,
          l.numero_lote AS lote,
          s.cantidad
      FROM salidas s
      JOIN usuarios u ON s.id_usuario = u.id_usuario
      JOIN pacientes p ON s.id_paciente = p.id_paciente
      JOIN lotes l ON s.id_lote = l.id_lote
      JOIN insumos i ON l.id_insumo = i.id_insumo
      ORDER BY s.fecha_salida DESC;
    `;
  }
}