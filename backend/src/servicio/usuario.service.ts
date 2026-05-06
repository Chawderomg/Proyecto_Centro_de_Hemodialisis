
import bcrypt from "bcryptjs";
import { prisma } from "../lib/conexion.js";
import { Usuario } from "../modelo/usuario.js";
import { eventosUsuario, type OperacionUsuario } from "../evento/usuario.evento.js";

export class UsuarioService {
  
  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  async existeCI(ci: string) {
    return await prisma.usuarios.findUnique({ where: { ci } });
  }

  async crearUsuario(data: { ci: string; nombre_completo: string; password: string; id_rol: number }) {
    const hashedPassword = await this.hashPassword(data.password);

    const usuario = new Usuario(data.ci, data.nombre_completo, hashedPassword, data.id_rol);

    const nuevo = await prisma.usuarios.create({
      data: {
        ci: usuario.getCI(),
        nombre_completo: usuario.getNombre(),
        password_hash: usuario.getPasswordHash(),
        id_rol: usuario.getRol()
      },
      select: { id_usuario: true, nombre_completo: true, ci: true, id_rol: true }
    });

    // D-E
    const emitirEvento: OperacionUsuario = (ci ,nombre) => {
      eventosUsuario.emit("usuarioCreado", ci ,nombre);
    };
    emitirEvento(nuevo.ci,nuevo.nombre_completo);

    return nuevo;
  }

  // 🔐 Buscar usuario para login
  async validarLogin(ci: string) {
    return await prisma.usuarios.findUnique({
      where: { ci },
      include: { roles: true }
    });
  }

  
  async buscarPorId(id: number) {
    return prisma.usuarios.findUnique({ where: { id_usuario: id } });
  }

  async obtenerUsuarios() {
    return prisma.usuarios.findMany({
      include: { roles: true },
      orderBy: { id_usuario: "desc" }
    });
  }

  // --- MÉTODOS PARCIALES (Uso de Partial<T>) ---
  // Permite actualizar solo lo que el usuario mande, no todo el objeto.
  async actualizarUsuario(id: number, data: any) {
    let updateData: any = {
      ci: data.ci,
      nombre_completo: data.nombre_completo,
      id_rol: Number(data.id_rol)
    };

    if (data.password) {
      updateData.password_hash = await this.hashPassword(data.password);
      delete updateData.password;
    }

    return prisma.usuarios.update({
      where: { id_usuario: id },
      data: updateData
    });
  }

  async eliminarUsuario(id: number) {
    return prisma.usuarios.delete({ where: { id_usuario: id } });
  }
}
