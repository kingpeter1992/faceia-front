import { Routes } from '@angular/router';

export const FINANCE_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'offrandes',
    pathMatch: 'full'
  },
  {
    path: 'offrandes',
    loadComponent: () =>
      import('./admin-component-finance/admin-component-finance')
        .then(m => m.AdminComponentFinance)
  },
];
