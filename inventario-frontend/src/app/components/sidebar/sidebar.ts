import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService, RolSistema } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar {
  authService = inject(AuthService);
  colapsado = false;
  filtroRapido = '';

  toggleColapso(): void {
    this.colapsado = !this.colapsado;
  }

  puedeVer(roles: RolSistema[]): boolean {
    return this.authService.tienePermiso(roles);
  }

  cerrarSesion(): void {
    this.authService.logout();
  }
}