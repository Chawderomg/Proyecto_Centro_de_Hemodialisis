


import type{ Request, Response } from "express";
import { LoteService } from "../servicio/lotes.service.js";

const loteService = new LoteService();

export const createLote = async (req: Request, res: Response) => {
  try {
    const lote = await loteService.crearLote(req.body);
    res.status(201).json({ success: true, data: lote });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getLotes = async (req: Request, res: Response) => {
  const data = await loteService.obtenerLotes();
  res.json({ success: true, data });
};

export const getAlertasVencimiento = async (req: Request, res: Response) => {
  const data = await loteService.getAlertasVencimiento();
  res.json({ success: true, data });
};