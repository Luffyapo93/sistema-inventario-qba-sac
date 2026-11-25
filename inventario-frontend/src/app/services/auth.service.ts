import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

export type RolSistema =
  | 'Administrador'
  | 'JefeAlmacen'
  | 'AsistenteAlmacen'
  | 'Vendedor'
  | 'Compras'
  | 'Gerencia';

export interface UsuarioSesion {
  id: number;
  nombreCompleto: string;
  username: string;
  password?: string;
  rol: RolSistema;
  rolEtiqueta: string;
  sedeId: number;
  sedeNombre: string;
  correo?: string;
  telefonoWhatsApp?: string;
  estado: boolean;
  iniciales: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly STORAGE_KEY = 'qba_usuario_sesion';
  private readonly USERS_DB_KEY = 'qba_usuarios_registrados';

  private readonly usuariosBase: UsuarioSesion[] = [
    {
      id: 1,
      nombreCompleto: 'Carlos Mendoza',
      username: 'admin',
      password: '123456',
      rol: 'Administrador',
      rolEtiqueta: 'A1 - Administrador del Sistema',
      sedeId: 93,
      sedeNombre: 'Almacén Corporativo (#93)',
      correo: 'admin@qbasac.pe',
      telefonoWhatsApp: '+51987654321',
      estado: true,
      iniciales: 'CM'
    },
    {
      id: 2,
      nombreCompleto: 'Roberto Vargas',
      username: 'almacenero',
      password: '123456',
      rol: 'JefeAlmacen',
      rolEtiqueta: 'A2 - Almacenero / Jefe Almacén',
      sedeId: 93,
      sedeNombre: 'Almacén Corporativo (#93)',
      correo: 'almacen@qbasac.pe',
      telefonoWhatsApp: '+51987654322',
      estado: true,
      iniciales: 'RV'
    },
    {
      id: 3,
      nombreCompleto: 'Ana Torres',
      username: 'vendedor',
      password: '123456',
      rol: 'Vendedor',
      rolEtiqueta: 'A4 - Vendedor Punto de Venta',
      sedeId: 94,
      sedeNombre: 'Tienda Full Tecnología',
      correo: 'fulltec@qbasac.pe',
      telefonoWhatsApp: '+51987654323',
      estado: true,
      iniciales: 'AT'
    },
    {
      id: 4,
      nombreCompleto: 'Luis Paredes',
      username: 'vendedor_dahua',
      password: '123456',
      rol: 'Vendedor',
      rolEtiqueta: 'A4 - Vendedor Punto de Venta',
      sedeId: 95,
      sedeNombre: 'Tienda Dahua Cámaras',
      correo: 'dahua@qbasac.pe',
      telefonoWhatsApp: '+51987654324',
      estado: true,
      iniciales: 'LP'
    },
    {
      id: 5,
      nombreCompleto: 'Elena Quispe',
      username: 'compras',
      password: '123456',
      rol: 'Compras',
      rolEtiqueta: 'A5 - Responsable de Compras',
      sedeId: 93,
      sedeNombre: 'Área de Abastecimiento',
      correo: 'compras@qbasac.pe',
      telefonoWhatsApp: '+51987654325',
      estado: true,
      iniciales: 'EQ'
    },
    {
      id: 6,
      nombreCompleto: 'Jorge Salazar',
      username: 'gerencia',
      password: '123456',
      rol: 'Gerencia',
      rolEtiqueta: 'A6 - Gerente / Auditor',
      sedeId: 93,
      sedeNombre: 'Gerencia General',
      correo: 'gerencia@qbasac.pe',
      telefonoWhatsApp: '+51987654326',
      estado: true,
      iniciales: 'JS'
    }
  ];

  listaUsuarios = signal<UsuarioSesion[]>(this.cargarUsuariosRegistrados());
  usuarioActual = signal<UsuarioSesion | null>(this.obtenerSesionGuardada());

  constructor(private router: Router) {}

  private cargarUsuariosRegistrados(): UsuarioSesion[] {
    const raw = localStorage.getItem(this.USERS_DB_KEY);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {
        return [...this.usuariosBase];
      }
    }
    localStorage.setItem(this.USERS_DB_KEY, JSON.stringify(this.usuariosBase));
    return [...this.usuariosBase];
  }

  guardarListaUsuarios(nuevaLista: UsuarioSesion[]): void {
    this.listaUsuarios.set(nuevaLista);
    localStorage.setItem(this.USERS_DB_KEY, JSON.stringify(nuevaLista));
  }

  private obtenerSesionGuardada(): UsuarioSesion | null {
    const raw = localStorage.getItem(this.STORAGE_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  login(username: string, password: string): boolean {
    const key = username.trim().toLowerCase();
    // Soporte también para el alias 'jefe' usado antes
    const keyNormalizado = key === 'jefe' ? 'almacenero' : key;

    const encontrado = this.listaUsuarios().find(
      (u) => u.username.toLowerCase() === keyNormalizado && u.password === password && u.estado
    );

    if (encontrado) {
      this.usuarioActual.set(encontrado);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(encontrado));
      return true;
    }
    return false;
  }

  loginRapidoPorRol(usernameKey: string): void {
    const keyNormalizado = usernameKey === 'jefe' ? 'almacenero' : usernameKey;
    const encontrado = this.listaUsuarios().find((u) => u.username.toLowerCase() === keyNormalizado);
    if (encontrado) {
      this.usuarioActual.set(encontrado);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(encontrado));
      this.router.navigate(['/dashboard']);
    }
  }

  logout(): void {
    this.usuarioActual.set(null);
    localStorage.removeItem(this.STORAGE_KEY);
    this.router.navigate(['/login']);
  }

  estaAutenticado(): boolean {
    return this.usuarioActual() !== null;
  }

  tienePermiso(rolesPermitidos: RolSistema[]): boolean {
    const user = this.usuarioActual();
    if (!user) return false;
    return rolesPermitidos.includes(user.rol);
  }
}