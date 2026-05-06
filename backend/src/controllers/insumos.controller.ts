import type{ Request, Response } from "express";
import { InsumoService } from "../servicio/insumo.service.js";

const insumoService = new InsumoService();

export const createInsumo = async (req: Request, res: Response) => {
  try {
    const { codigo_interno, nombre } = req.body;

    if (!codigo_interno || !nombre) {
      return res.status(400).json({ success: false, message: "Campos dvcobligatorios" });
    }

    const existe = await insumoService.existeCodigo(codigo_interno);

    if (existe) {
      return res.status(400).json({ success: false, message: "Código duplicado" });
    }

    const nuevo = await insumoService.crearInsumo(req.body);

    res.status(201).json({ success: true, data: nuevo });

  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getInsumos = async (req: Request, res: Response) => {
  const data = await insumoService.obtenerInsumos();
  res.json({ success: true, data });
};

export const updateInsumo = async (req: Request, res: Response) => {
  const { id } = req.params;

  const existe = await insumoService.buscarPorId(Number(id));

  if (!existe) {
    return res.status(404).json({ success: false, message: "No existe" });
  }

  const data = await insumoService.actualizarInsumo(Number(id), req.body);

  res.json({ success: true, data });
};

export const deleteInsumo = async (req: Request, res: Response) => {
  const { id } = req.params;

  const existe = await insumoService.buscarPorId(Number(id));

  if (!existe) {
    return res.status(404).json({ success: false, message: "No existe" });
  }

  await insumoService.eliminarInsumo(Number(id));

  res.json({ success: true, message: "Eliminado" });
};

export const getStockTotal = async (req: Request, res: Response) => {
  const data = await insumoService.getStockTotal();
  res.json({ success: true, data });
};

export const getDashboard = async (req: Request, res: Response) => {
  const data = await insumoService.getDashboard();
  res.json({ success: true, data });
};

export const getBajoStock = async (req: Request, res: Response) => {
  const data = await insumoService.getBajoStock();
  res.json({ success: true, data });
};

