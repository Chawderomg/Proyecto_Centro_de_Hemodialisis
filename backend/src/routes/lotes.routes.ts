import { Router } from "express";

import { createLote,getLotes,getAlertasVencimiento} from "../controllers/lotes.controller.js";


const router = Router();

// Ruta para reponer stock (Crear nuevo lote)
router.post("/Lotes", createLote);
router.get("/getLotes", getLotes);
//router.get("/stock-total", getStockTotal);      // Solo stock sumado
router.get("/vencimientos", getAlertasVencimiento); // Solo lo que va a caducar
//router.get("/bajo-stock", getBajoStock);        // Solo alertas de cantidad

export default router;