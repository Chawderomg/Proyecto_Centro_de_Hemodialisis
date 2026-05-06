
import type { Request, Response } from "express";
import { PacienteService } from "../servicio/pacientes.service.js";

const pacienteService = new PacienteService();

export class PacienteController {
  static async registrarPacientes(req: Request, res: Response) {
    try {
      const { ci, nombre_completo } = req.body;
      if (!ci || !nombre_completo) {
        return res.status(400).json({ success: false, message: "Faltan datos" });
      }

      const existe = await pacienteService.existeCI(ci);
      if (existe) {
        return res.status(400).json({ success: false, message: "CI ya existe" });
      }

      const nuevo = await pacienteService.CrearPaciente({ ci, nombre_completo });
      res.status(201).json({ success: true, data: nuevo });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
    
  }

  static async listarPacientes(req: Request, res: Response) {
    try {

      const pacientes = await pacienteService.obtenerPacientes();
      res.status(200).json({ success: true, data: pacientes});

    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  static async actualizarPacientes(req: Request, res: Response) {
    try {
    const { id } = req.params;
    const { ci, nombre_completo} = req.body;

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
  }

  static async eliminarPacientes (req: Request, res: Response) {
   
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
  }
}
