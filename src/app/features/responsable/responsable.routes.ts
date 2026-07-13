import { Routes } from '@angular/router';

export const RESPONSABLE_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./pages/admin-component-responsable/admin-component-responsable')
        .then(m => m.AdminComponentResponsable)
  },
];
