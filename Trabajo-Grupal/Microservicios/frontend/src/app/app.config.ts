import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { jwtInterceptor } from './interceptors/jwt-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    // Aquí le decimos a Angular que use nuestro interceptor para todas las llamadas HTTP
    provideHttpClient(withInterceptors([jwtInterceptor]))
  ]
};
