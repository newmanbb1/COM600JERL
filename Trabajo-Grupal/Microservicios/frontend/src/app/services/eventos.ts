import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EventosService {
  private apiUrl = '/api/eventos/eventos'; // La URL que definimos en el proxy

  constructor(private http: HttpClient) {}

  getEventos(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
  createEvent(eventData: any): Observable<any> {
    // La URL apunta a /api/eventos, que el proxy reenvía a http://localhost:5002/eventos
    return this.http.post<any>('/api/eventos/eventos', eventData);
  }
}
