import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true, // Asegúrate de que tus componentes sean standalone
  imports: [CommonModule, FormsModule, RouterLink], // <-- Añadimos los módulos aquí
  templateUrl: './login.html', // <-- Usamos el nombre de archivo correcto
  styleUrl: './login.scss'   // <-- Usamos el nombre de archivo correcto
})
export class Login { // <-- Usamos el nombre de clase 'Login'
  // Objeto para enlazar con los campos del formulario
  credentials = {
    email: '',
    password: ''
  };
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  onLogin(): void {
    this.errorMessage = ''; // Limpiar errores previos
    this.authService.login(this.credentials).subscribe({
      next: () => {
        // Si el login es exitoso, navegar a la página de eventos
        this.router.navigate(['/eventos']);
      },
      error: (err) => {
        console.error('Login failed:', err);
        this.errorMessage = 'Credenciales incorrectas. Inténtalo de nuevo.';
      }
    });
  }
}
