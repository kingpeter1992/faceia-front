import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./pages/admin-dashboard-component/admin-dashboard-component')
        .then(m => m.AdminDashboardComponent)
  },
  {
    path: 'users',
    loadComponent: () =>
      import('./pages/admin-users-component/admin-users-component')
        .then(m => m.AdminUsersComponent)
  },

];
