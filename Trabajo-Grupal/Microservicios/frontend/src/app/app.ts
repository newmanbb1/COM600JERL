import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth'; // Importamos nuestro servicio
import { CommonModule } from '@angular/common'; // Necesario para *ngIf

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule], // <-- Añadimos CommonModule
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App {
  title = 'frontend';

  // Inyectamos el AuthService para poder usarlo en el componente
  constructor(public authService: AuthService) {}

  // Método que se llamará al hacer clic en "Cerrar Sesión"
  logout(): void {
    this.authService.logout();
  }
}
