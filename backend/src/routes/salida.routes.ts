import { Router } from "express";
import { registrarNuevaSalida, obtenerReporteSalidas } from "../controllers/salida.controller.js";

const router = Router();

// POST: http://localhost:3000/api/salidas
router.post("/", registrarNuevaSalida);

// GET: http://localhost:3000/api/salidas/historial
router.get("/historial", obtenerReporteSalidas);

export default router;