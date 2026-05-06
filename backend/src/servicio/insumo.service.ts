import { prisma as conexion } from "../lib/conexion.js";

export class InsumoService {

  async existeCodigo(codigo: string) {
    return conexion.insumos.findUnique({
      where: { codigo_interno: codigo }
    });
  }

  async crearInsumo(data: any) {
    return conexion.insumos.create({
      data: {
        codigo_interno: data.codigo_interno,
        nombre: data.nombre,
        stock_minimo: Number(data.stock_minimo) || 0
      }
    });
  }

  async obtenerInsumos() {
    return conexion.insumos.findMany({
      orderBy: { creado_en: "desc" }
    });
  }

  async buscarPorId(id: number) {
    return conexion.insumos.findUnique({
      where: { id_insumo: id }
    });
  }

  async actualizarInsumo(id: number, data: any) {
    return conexion.insumos.update({
      where: { id_insumo: id },
      data: {
        codigo_interno: data.codigo_interno,
        nombre: data.nombre,
        stock_minimo: Number(data.stock_minimo)
      }
    });
  }

  async eliminarInsumo(id: number) {
    return conexion.insumos.delete({
      where: { id_insumo: id }
    });
  }

  // STOCK TOTAL
  async getStockTotal() {
    const insumos = await conexion.insumos.findMany({
      include: { lotes: true }
    });

    return insumos.map(i => ({
      codigo_interno: i.codigo_interno,
      nombre: i.nombre,
      stock_total: i.lotes.reduce((acc, l) => acc + l.cantidad_disponible, 0)
    }));
  }

  // DASHBOARD
  async getDashboard() {
    const insumos = await conexion.insumos.findMany({
      include: {
        lotes: { where: { cantidad_disponible: { gt: 0 } } }
      }
    });

    const fechaLimite = new Date();
    fechaLimite.setDate(fechaLimite.getDate() + 30);

    return insumos.map(insumo => {
      const stockTotal = insumo.lotes.reduce(
        (acc, lote) => acc + lote.cantidad_disponible, 0
      );

      const alertaVencimiento = insumo.lotes.some(
        lote => new Date(lote.fecha_vencimiento) <= fechaLimite
      );

      return {
        id_insumo: insumo.id_insumo,
        codigo_interno: insumo.codigo_interno,
        nombre: insumo.nombre,
        stock_minimo: insumo.stock_minimo,
        stock_total: stockTotal,
        alertaStock: stockTotal <= (insumo.stock_minimo ?? 0),
        alertaVencimiento,
        detalles_lotes: insumo.lotes
      };
    });
  }

  // BAJO STOCK
  async getBajoStock() {
    const insumos = await conexion.insumos.findMany({
      include: { lotes: true }
    });

    return insumos
      .map(i => ({
        nombre: i.nombre,
        stock_minimo: i.stock_minimo,
        stock_actual: i.lotes.reduce((acc, l) => acc + l.cantidad_disponible, 0)
      }))
      .filter(i => i.stock_actual <= (i.stock_minimo ?? 0));
  }
}