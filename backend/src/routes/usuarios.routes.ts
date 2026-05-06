import { Router } from "express";
import { registrarUsuarios ,loginUsuarios,listarUsuarios,actualizarUsuarios,eliminarUsuarios} from "../controllers/usuarios.controller.js"; // .js obligatorio
const router = Router();


export default router;
router.post("/registrarUsuario", registrarUsuarios);
router.post("/loginUsuario", loginUsuarios); // <-- ¡Nueva ruta!

router.get('/listaUsuari', listarUsuarios);
router.put("/:id", actualizarUsuarios); // <-- ¡Nueva ruta!
router.delete("/:id", eliminarUsuarios); // <-- ¡Nueva ruta!
