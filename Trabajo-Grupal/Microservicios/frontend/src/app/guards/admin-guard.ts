import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

/**
 * Este guardia verifica si un usuario es un administrador logueado.
 */
export const adminGuard: CanActivateFn = (route, state) => {
  // Inyectamos los servicios que necesitamos
  const authService = inject(AuthService);
  const router = inject(Router);

  // 1. ¿Está el usuario logueado?
  if (authService.isLoggedIn()) {

    // 2. ¿Tiene el rol de 'admin'?
    if (authService.getUserRole() === 'admin') {
      // Si es admin, puede pasar
      return true;
    } else {
      // Es un usuario normal, no tiene permisos. Lo redirigimos a la lista de eventos.
      alert('No tienes permisos de administrador para acceder a esta página.');
      router.navigate(['/eventos']);
      return false;
    }

  } else {
    // No está logueado. Lo redirigimos a la página de login.
    alert('Debes iniciar sesión para acceder a esta página.');
    router.navigate(['/login']);
    return false;
  }
};
