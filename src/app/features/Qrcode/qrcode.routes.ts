import { Routes } from '@angular/router';

export const QR_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./pages/dashboardqr/dashboardqr')
        .then(m => m.Dashboardqr)
  },
];
