import type { Request, Response } from "express";
import { SalidaService } from "../service/salida.service.js";

const salidaService = new SalidaService();

export const registrarNuevaSalida = async (req: Request, res: Response) => {
  try {
    const nuevaSalida = await salidaService.registrarSalida(req.body);
    res.status(201).json({
      success: true,
      message: "Salida registrada exitosamente",
      data: nuevaSalida
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Error al registrar la salida"
    });
  }
};

export const obtenerReporteSalidas = async (_req: Request, res: Response) => {
  try {
    const historial = await salidaService.obtenerHistorial();
    res.json(historial);
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};