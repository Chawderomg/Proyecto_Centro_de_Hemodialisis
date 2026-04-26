import { Router } from "express";
import { createLote } from "../controllers/lotes.controller.js";

const router = Router();

// Ruta para reponer stock (Crear nuevo lote)
router.post("/Lotes", createLote);

export default router;