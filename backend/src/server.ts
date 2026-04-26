import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js"; // IMPORTANTE: El .js es vital por tu tsconfig
import insumoRoutes from "./routes/insumos.routes.js";
import loteRoutes from "./routes/lotes.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: "http://localhost:4200", 
  credentials: true
}));

app.use(express.json());

// Punto de entrada de la API con el frontend
app.use("/api/usuarios", authRoutes);
app.use("/api/insumos", insumoRoutes);
app.use("/api/lotes", loteRoutes);



app.get("/", (req, res) => {
  res.json({ message: "🚀 Backend funcionando" });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});