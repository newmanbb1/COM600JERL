import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ComprasService {
  private apiUrl = '/api/compras';

  constructor(private http: HttpClient) { }

  crearCompra(eventoId: string, cantidad: number): Observable<any> {
    // Aseguramos que el eventoId siempre sea un string
    const body = { eventoId: String(eventoId), cantidad };
    // El proxy la convertirá en: POST http://localhost:8080/compras
    return this.http.post<any>(this.apiUrl, body);
  }

  confirmarPago(compraId: string): Observable<any> {
    // Llamada: POST /api/compras/ID/pagar
    // El proxy la convertirá en: POST http://localhost:8080/compras/ID/pagar
    return this.http.post<any>(`${this.apiUrl}/${compraId}/pagar`, {});
  }
}
