import { Router } from "express";
import { getPacientes,updatePaciente,deletePaciente, registerPaciente} from "../controllers/pacientes.controller.js"; // .js obligatorio

const router = Router();

// Endpoint: POST http://localhost:3000/api/auth/register
//router.post("/register", registerUser);

export default router;
router.post("/registerPaciente", registerPaciente);


router.get('/getPaciente', getPacientes);
router.put("/:id", updatePaciente); // <-- ¡Nueva ruta!
router.delete("/:id", deletePaciente); // <-- ¡Nueva ruta!
