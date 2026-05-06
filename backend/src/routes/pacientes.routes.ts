import { Router } from "express";
import {PacienteController} from "../controllers/pacientes.controller.js"; // .js obligatorio

const router = Router();

export default router;
router.post("/registrarPaciente", PacienteController.registrarPacientes);
router.get('/listaPaciente', PacienteController.listarPacientes);
router.put("/:id", PacienteController.actualizarPacientes); // <-- ¡Nueva ruta!
router.delete("/:id", PacienteController.eliminarPacientes); // <-- ¡Nueva ruta!
