import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { EventosService } from '../../services/eventos';

@Component({
  selector: 'app-create-event',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-event.html',
  styleUrls: ['./create-event.scss']
})
export class CreateEventComponent {
  eventData = {
    nombre: '',
    fecha: '',
    lugar: '',
    capacidad: null,
    precio: null
  };

  successMessage = '';
  errorMessage = '';

  constructor(private eventosService: EventosService, private router: Router) {}

  onSubmit(): void {
    this.successMessage = '';
    this.errorMessage = '';

    this.eventosService.createEvent(this.eventData).subscribe({
      next: () => {
        this.successMessage = '¡Evento creado exitosamente! Redirigiendo a la lista de eventos...';
        setTimeout(() => {
          this.router.navigate(['/eventos']);
        }, 2000);
      },
      error: (err) => {
        console.error('Error al crear el evento:', err);
        this.errorMessage = err.error?.mensaje || 'Ocurrió un error al crear el evento.';
      }
    });
  }
}
