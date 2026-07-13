import { Routes } from '@angular/router';

export const COMMUNICATION_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./admin-component-communication/admin-component-communication')
        .then(m => m.AdminComponentCommunication)
  },
];
