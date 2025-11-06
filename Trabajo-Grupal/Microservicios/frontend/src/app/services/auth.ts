import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // La URL base apunta a nuestro proxy, que redirige a localhost:3000
  private apiUrl = '/api/auth';

  constructor(private http: HttpClient, private router: Router) {}

  /**
   * Envía una petición de registro al backend.
   */
  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  /**
   * Envía las credenciales para iniciar sesión. Si es exitoso,
   * guarda el token en el almacenamiento local del navegador.
   */
  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        // La directiva 'tap' nos permite "espiar" la respuesta sin modificarla
        if (response && response.token) {
          localStorage.setItem('authToken', response.token);
        }
      })
    );
  }

  /**
   * Elimina el token del almacenamiento local y redirige al login.
   */
  logout(): void {
    localStorage.removeItem('authToken');
    this.router.navigate(['/login']);
  }

  /**
   * Obtiene el token guardado en el almacenamiento local.
   */
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  /**
   * Verifica si el usuario está logueado revisando si existe un token.
   */
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getUserRole(): string | null {
    const token = this.getToken();
    if (!token) {
        return null;
    }
    try {
        // Decode the payload part of the token
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.role;
    } catch (e) {
        console.error('Error decoding token', e);
        return null;
    }
}
}
