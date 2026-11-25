import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  private authService = inject(AuthService);
  private router = inject(Router);

  username = '';
  password = '';
  errorMensaje = '';

  iniciarSesion(): void {
    this.errorMensaje = '';
    if (!this.username.trim() || !this.password.trim()) {
      this.errorMensaje = 'Ingresa tu usuario y contraseña.';
      return;
    }
    if (this.authService.login(this.username, this.password)) {
      this.router.navigate(['/dashboard']);
    } else {
      this.errorMensaje = 'Credenciales incorrectas o usuario inactivo.';
    }
  }

  accesoRapido(usernameKey: string): void {
    this.authService.loginRapidoPorRol(usernameKey);
  }
}