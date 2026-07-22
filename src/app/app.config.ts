import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { jwtInterceptor } from './core/Jwt/interceptor';
import { providePrimeNG } from 'primeng/config';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
// ✅ Importer le fournisseur
import { provideNativeDateAdapter } from '@angular/material/core';
import { DialogService } from 'primeng/dynamicdialog';
export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimationsAsync(),
    MessageService,
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
     providePrimeNG({}),
     DialogService, // 👈 Déclarez-le ici pour qu'il soit accessible partout
    ConfirmationService,
     provideNativeDateAdapter(), // 👈 Ajouté ici pour toute l'application
    provideAnimations(),
    provideHttpClient(withInterceptors([jwtInterceptor]))
  ]
};
