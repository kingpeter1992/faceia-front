import { Routes } from '@angular/router';

export const MEMBRE_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./pages/admin-component-membre/admin-component-membre')
        .then(m => m.AdminComponentMembre)
  },
    {
    path: 'comptage',
    loadComponent: () =>
      import('../../pages/admin/admin')
        .then(m => m.Admin)
  },

      {
    path: 'qrcode',
    loadComponent: () =>
      import('../membres/pages/qr-management-component/qr-management-component')
        .then(m => m.QrManagementComponent)
  },


 {
    path: 'enregister',
    loadComponent: () =>
      import('../../pages/enroll-component/enroll-component')
        .then(m => m.EnrollComponent)
  },
   {
    path: 'recognizer',
    loadComponent: () =>
      import('../../pages/recognize/recognize.component')
        .then(m => m.RecognizeComponent)
  },
     {
    path: 'recognizerpersonal',
    loadComponent: () =>
      import('../../pages/reconait/reconait')
        .then(m => m.Reconait)
  },
];
