import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService, RolSistema, UsuarioSesion } from '../../services/auth.service';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.css'
})
export class Usuarios {
  authService = inject(AuthService);
  filtroBusqueda = '';
  filtroRol = 'TODOS';
  mostrarModal = false;
  mensajeNotificacion = '';

  nuevoUsuarioForm = { nombreCompleto: '', username: '', password: '', rol: 'Vendedor' as RolSistema, sedeId: 94, correo: '' };

  get usuariosFiltrados(): UsuarioSesion[] {
    return this.authService.listaUsuarios().filter(u => {
      const q = this.filtroBusqueda.toLowerCase().trim();
      const matchTxt = !q || u.nombreCompleto.toLowerCase().includes(q) || u.username.toLowerCase().includes(q);
      const matchRol = this.filtroRol === 'TODOS' || u.rol === this.filtroRol;
      return matchTxt && matchRol;
    });
  }

  abrirModalNuevoUsuario(): void {
    this.nuevoUsuarioForm = { nombreCompleto: '', username: '', password: '', rol: 'Vendedor', sedeId: 94, correo: '' };
    this.mostrarModal = true;
  }

  crearUsuario(): void {
    if (!this.nuevoUsuarioForm.nombreCompleto || !this.nuevoUsuarioForm.username || !this.nuevoUsuarioForm.password) return;
    const sedeId = Number(this.nuevoUsuarioForm.sedeId);
    const sedeNombre = sedeId === 93 ? 'Almacén Corporativo (#93)' : sedeId === 94 ? 'Tienda Full Tecnología' : 'Tienda Dahua Cámaras';
    const nuevo: UsuarioSesion = {
      id: this.authService.listaUsuarios().length + 1,
      nombreCompleto: this.nuevoUsuarioForm.nombreCompleto,
      username: this.nuevoUsuarioForm.username.toLowerCase(),
      password: this.nuevoUsuarioForm.password,
      rol: this.nuevoUsuarioForm.rol,
      rolEtiqueta: this.nuevoUsuarioForm.rol === 'Vendedor' ? 'A4 - Vendedor Punto de Venta' : 'A2 - Almacenero',
      sedeId, sedeNombre,
      correo: this.nuevoUsuarioForm.correo || `${this.nuevoUsuarioForm.username}@qbasac.pe`,
      estado: true,
      iniciales: this.nuevoUsuarioForm.nombreCompleto.substring(0, 2).toUpperCase()
    };
    this.authService.guardarListaUsuarios([...this.authService.listaUsuarios(), nuevo]);
    this.mostrarModal = false;
    this.mensajeNotificacion = `Usuario "${nuevo.nombreCompleto}" (${nuevo.username}) creado.`;
    setTimeout(() => this.mensajeNotificacion = '', 4000);
  }

  cambiarEstadoUsuario(user: UsuarioSesion): void {
    if (user.username === 'admin') return;
    this.authService.guardarListaUsuarios(this.authService.listaUsuarios().map(u => u.id === user.id ? { ...u, estado: !u.estado } : u));
  }
}