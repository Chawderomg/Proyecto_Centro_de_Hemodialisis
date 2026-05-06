
import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { UsuarioService } from "../servicio/usuario.service.js";
import { eventosUsuario ,usuarioEvents} from "../evento/usuario.evento.js";
import { MensajesBienvenida, RolUsuario } from "../constants/roles.enum.js";

const usuarioService = new UsuarioService();

export const registrarUsuarios = async (req: Request, res: Response) => {
  try {
    const { ci, nombre_completo, password, id_rol } = req.body;

    if (!ci || !nombre_completo || !password || id_rol == null) {
      return res.status(400).json({ success: false, message: "Faltan datos obligatorios" });
    }

    // Verificar existencia (Uso de lógica delegada al servicio)
    const existingUser = await usuarioService.existeCI(String(ci));
    if (existingUser) {
      return res.status(400).json({ success: false, message: "El CI ya está registrado" });
    }

    // Crear usuario
    const newUser = await usuarioService.crearUsuario({
      ci: String(ci),
      nombre_completo,
      password,
      id_rol: Number(id_rol),
    });

    setImmediate(() => {
      usuarioEvents.emit("usuarioCreado", newUser.nombre_completo);
    });

    res.status(201).json({ success: true, user: newUser });

  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * 🔐 LOGIN DE USUARIO
 */
export const loginUsuarios = async (req: Request, res: Response) => {
  try {
    const { ci, password } = req.body;

    if (!ci || !password) {
      return res.status(400).json({ success: false, message: "Datos incompletos" });
    }

    const user = await usuarioService.validarLogin(String(ci));

    if (!user) {
      return res.status(404).json({ success: false, message: "Usuario no encontrado" });
    }

    // Validación de password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: "Credenciales inválidas" });
    }

    const welcomeMessage =  MensajesBienvenida[user.id_rol as RolUsuario] ?? "Bienvenido al sistema";

    res.status(200).json({
      success: true,
      message: welcomeMessage,
      user: {
        id: user.id_usuario,
        nombre: user.nombre_completo,
        rol: user.roles.nombre_rol 
      }
    });

  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const listarUsuarios = async (_req: Request, res: Response) => {
  try {
    const usuarios = await usuarioService.obtenerUsuarios();

    // --- EXPRESIÓN LAMBDA CORREGIDA ---
    // Mantenemos los nombres originales: nombre_completo y ci
    const dataLimpia = usuarios.map(u => ({
      id_usuario: u.id_usuario,
      nombre_completo: u.nombre_completo,
      ci: u.ci,
      rol: u.roles?.id_rol || 'Sin Rol' // Usamos el nombre del rol vinculado
    }));

    res.status(200).json({ success: true, data: dataLimpia });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};


export const actualizarUsuarios = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Verificamos si existe antes de intentar editar
    const usuarioExistente = await usuarioService.buscarPorId(Number(id));
    if (!usuarioExistente) {
      return res.status(404).json({ success: false, message: "Usuario no encontrado" });
    }

    // --- MÉTODOS PARCIALES (Partial) ---
    // Enviamos req.body tal cual; el servicio se encarga de procesar solo lo que venga
    const actualizado = await usuarioService.actualizarUsuario(Number(id), req.body);

    res.status(200).json({
      success: true,
      message: "Usuario actualizado correctamente",
      data: actualizado
    });

  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};


export const eliminarUsuarios = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const usuarioExistente = await usuarioService.buscarPorId(Number(id));
    if (!usuarioExistente) {
      return res.status(404).json({ success: false, message: "Usuario no encontrado" });
    }

    await usuarioService.eliminarUsuario(Number(id));

    res.status(200).json({ success: true, message: "Usuario eliminado" });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};