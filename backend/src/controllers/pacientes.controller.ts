import type { Request, Response } from "express";

import { PacienteService } from "../service/pacientes.service.js";
const pacienteService = new PacienteService();

export const registerPaciente = async (req: Request, res: Response) => {
  try {
    const { ci, nombre_completo} = req.body;

    if (!ci || !nombre_completo ) {
      return res.status(400).json({ success: false, message: "Faltan datos" });
    }

    const existingPaciente = await pacienteService.existeCI(String(ci));
    if (existingPaciente) {
      return res.status(400).json({ success: false, message: "CI ya existe" });
    }

    const newPaciente = await pacienteService.CrearPaciente({
      ci: String(ci),
      nombre_completo,
      
      
    });

    res.status(201).json({ success: true, user: newPaciente });

  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};




 


export const getPacientes = async (req: Request, res: Response) => {
  try {

    const pacientes = await pacienteService.obtenerPacientes();

    res.status(200).json({
      success: true,
      data: pacientes
    });

  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export const updatePaciente = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { ci, nombre_completo} = req.body;

   /* if (!ci || !nombre_completo) {
      return res.status(400).json({
        success: false,
        message: "CI y nombre son obligatorios"
      });
    }*/

    const pacienteExistente = await pacienteService.buscarPorId(Number(id));

    if (!pacienteExistente) {
      return res.status(404).json({
        success: false,
        message: "Paciente no encontrado"
      });
    }

    const actualizado = await pacienteService.actualizarPaciente(Number(id), {
      ci,
      nombre_completo,
    });

    res.status(200).json({
      success: true,
      message: "Paciente actualizado",
      data: actualizado
    });

  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deletePaciente = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const pacienteExistente = await pacienteService.buscarPorId(Number(id));

    if (!pacienteExistente) {
      return res.status(404).json({
        success: false,
        message: "Paciente no encontrado"
      });
    }

    await pacienteService.eliminarPaciente(Number(id));

    res.status(200).json({
      success: true,
      message: "Paciente eliminado correctamente"
    });

  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};