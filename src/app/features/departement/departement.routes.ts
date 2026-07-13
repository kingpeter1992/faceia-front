import { Routes } from '@angular/router';

export const DEPARTEMENT_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./admin-component-departement/admin-component-departement')
        .then(m => m.AdminComponentDepartement)
  },
];
