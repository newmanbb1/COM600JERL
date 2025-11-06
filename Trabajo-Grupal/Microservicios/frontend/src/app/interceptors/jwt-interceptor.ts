import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  // Inyectamos el servicio de autenticación
  const authService = inject(AuthService);
  const token = authService.getToken();

  // Si hay un token, clonamos la petición y le añadimos la cabecera de autorización
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  // Dejamos que la petición continúe su camino
  return next(req);
};
