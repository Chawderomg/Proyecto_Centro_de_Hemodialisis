import { prisma } from "../lib/prisma.js";

export class LoteService {

  // 📦 Crear lote (ingreso)
  async crearLote(data: any) {

    const { id_insumo, numero_lote, cantidad_inicial, fecha_vencimiento } = data;

    // 🔥 Validaciones de negocio
    if (!id_insumo || !numero_lote || !cantidad_inicial || !fecha_vencimiento) {
      throw new Error("Todos los campos son obligatorios");
    }

    const cantidad = Number(cantidad_inicial);

    if (isNaN(cantidad)) {
      throw new Error("Cantidad inválida");
    }

    // 🔥 Verificar insumo
    const insumoExiste = await prisma.insumos.findUnique({
      where: { id_insumo: Number(id_insumo) }
    });

    if (!insumoExiste) {
      throw new Error("El insumo no existe");
    }

    // 🔥 Crear lote (con relación correcta)
    const nuevoLote = await prisma.lotes.create({
      data: {
        numero_lote,
        cantidad_disponible: cantidad,
        fecha_vencimiento: new Date(fecha_vencimiento),

        insumo: {
          connect: {
            id_insumo: Number(id_insumo)
          }
        }
      }
    });

    return {
      mensaje: `Stock repuesto: ${cantidad} unidades a ${insumoExiste.nombre}`,
      data: nuevoLote
    };
  }

  // 📋 Listar lotes
  async obtenerLotes() {
    return prisma.lotes.findMany({
      include: { insumo: true },
      orderBy: { fecha_vencimiento: "asc" }
    });
  }

  // ⚠️ HU05 - Vencimientos
  async getAlertasVencimiento() {
    const fechaLimite = new Date();
    fechaLimite.setDate(fechaLimite.getDate() + 30);

    return prisma.lotes.findMany({
      where: {
        fecha_vencimiento: { lte: fechaLimite },
        cantidad_disponible: { gt: 0 }
      },
      include: { insumo: true },
      orderBy: { fecha_vencimiento: "asc" }
    });
  }

  // 🔍 Buscar lote
  async buscarPorId(id: number) {
    return prisma.lotes.findUnique({
      where: { id_lote: id }
    });
  }

}