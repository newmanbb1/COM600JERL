import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

// --- CORRECCIONES EN LAS RUTAS DE IMPORTACIÓN ---
import { EventosService } from '../../services/eventos';
import { AuthService } from '../../services/auth';
import { PurchaseModalComponent } from '../purchase-modal/purchase-modal';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [CommonModule, PurchaseModalComponent], // El modal ya está importado aquí
  templateUrl: './event-list.html',
  styleUrl: './event-list.scss'
})
export class EventList implements OnInit {
  eventos: any[] = [];
  isLoading = true;
  error: string | null = null;

  // --- PROPIEDADES AÑADIDAS PARA CONTROLAR EL MODAL ---
  isModalOpen = false;
  selectedEvent: any = null;

  constructor(
    private eventosService: EventosService,
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isLoading = true; // Reiniciar el estado de carga
    this.eventosService.getEventos().subscribe({
      next: (data) => {
        this.eventos = data.eventos;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar eventos:', err);
        this.error = 'No se pudieron cargar los eventos. Intente más tarde.';
        this.isLoading = false;
      }
    });
  }

  /**
   * --- MÉTODO 'comprar' SIMPLIFICADO ---
   * Su única función ahora es abrir el modal.
   * El parámetro 'evento' es el objeto completo, no solo el ID.
   */
  comprar(evento: any): void {
    if (!this.authService.isLoggedIn()) {
      alert('Debes iniciar sesión para poder comprar.');
      this.router.navigate(['/login']);
      return;
    }
    // Guardamos el evento seleccionado y cambiamos la bandera para mostrar el modal
    this.selectedEvent = evento;
    this.isModalOpen = true;
  }

  /**
   * --- MÉTODO AÑADIDO PARA CERRAR EL MODAL ---
   * Se activa cuando el modal emite el evento 'close'.
   */
  closeModal(): void {
    this.isModalOpen = false;
    this.selectedEvent = null;
    // Recargamos los eventos para reflejar cualquier cambio en el stock
    this.ngOnInit();
  }
}
