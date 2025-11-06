import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ComprasService } from '../../services/compras';

@Component({
  selector: 'app-purchase-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './purchase-modal.html',
  styleUrls: ['./purchase-modal.scss'],
})
export class PurchaseModalComponent {
  @Input() event: any; // Recibe el evento desde el componente padre
  @Output() close = new EventEmitter<void>(); // Emite un evento para cerrar

  cantidad = 1;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(private comprasService: ComprasService) {}
  ngOnInit(): void {
    console.log('PurchaseModalComponent initialized');
    console.log('Modal abierto con el evento:', this.event);

  }
  onConfirmPurchase(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    // Inicia el flujo de compra de dos pasos
    this.comprasService.crearCompra(String(this.event.id), this.cantidad).subscribe({
      next: (compraCreada) => {
        this.comprasService.confirmarPago(compraCreada.id).subscribe({
          next: () => {
            this.successMessage =
              '¡Compra realizada con éxito! Recibirás una notificación por correo.';
            this.isLoading = false;
            // Espera 3 segundos y luego cierra el modal
            setTimeout(() => this.onClose(), 3000);
          },
          error: (err) => this.handleError(err, 'confirmar el pago'),
        });
      },
      error: (err) => this.handleError(err, 'crear la compra'),
    });
  }

  handleError(err: any, step: string): void {
    console.error(`Error al ${step}:`, err);
    this.errorMessage = `Error al ${step}: ${err.error?.error || 'Inténtalo de nuevo.'}`;
    this.isLoading = false;
  }

  onClose(): void {
    this.close.emit();
  }
}
