import { Routes } from '@angular/router';

export const ENSEIGNEMENT_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./pages/admin-component-eseignement/admin-component-eseignement')
        .then(m => m.AdminComponentEseignement)
  },
];
