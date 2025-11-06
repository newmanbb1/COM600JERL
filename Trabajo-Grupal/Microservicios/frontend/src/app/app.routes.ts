import { Routes } from '@angular/router';
import { adminGuard } from './guards/admin-guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./components/login/login').then((m) => m.Login),
  },
  {
    path: 'register',
    loadComponent: () => import('./components/register/register').then((m) => m.Register),
  },
  {
    path: 'eventos',
    loadComponent: () => import('./components/event-list/event-list').then((m) => m.EventList),
  },
  {
    path: 'crear-evento',
    loadComponent: () =>
      import('./components/create-event/create-event').then((m) => m.CreateEventComponent),
    canActivate: [adminGuard] // <-- 2. Aplicar el guardia a esta ruta
  },
  {
    path: '',
    redirectTo: '/eventos',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: '/eventos',
  },
];
