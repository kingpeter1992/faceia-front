import { Routes } from '@angular/router';
import { MainLayout } from './layout/component/main-layout/main-layout';
import { AuthGuard } from './core/AuthGuard/auth-guard-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./core/Auth/component/login-component/login-component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./core/Auth/component/register-component/register-component').then(m => m.RegisterComponent) },
  { path: 'attente-validation', loadComponent: () => import('./core/Auth/component/attennte-component/attennte-component').then(m => m.AttennteComponent) },
  {
    path: 'unauthorized',
    loadComponent: () =>
      import('./core/Auth/component/unauthorized/unauthorized')
        .then(m => m.Unauthorized)
  },

 {
 path: 'public/comptage/:token',
 loadComponent: () =>
 import('./features/activites/pages/public-comptage-component/public-comptage-component')
 .then(m => m.PublicComptageComponent)
},{
  path: 'success-page',
  loadComponent: () => import('./features/activites/pages/success-page/success-page').then(m => m.SuccessPage)
},

  /**
    * ROUTES SECURISEES AVEC LAYOUT
    */
  {
  path: '',
  component: MainLayout,
  canActivate: [AuthGuard],
  children: [

    {
      path: 'dashboard',
      canActivate: [AuthGuard],
      data: {
        roles: ['ADMIN','PASTEUR','RESPONSABLE_01','RESPONSABLE_02']
      },
      loadComponent: () =>
        import('./features/dashboard-component/dashboard-component')
          .then(m => m.DashboardComponent)
    },

    {
      path: 'admin',
      canActivate: [AuthGuard],
      data: { roles: ['ADMIN'] },
      loadChildren: () =>
        import('./features/admin/admin.routes')
          .then(m => m.ADMIN_ROUTES)
    },

    {
      path: 'activites',
      canActivate: [AuthGuard],
      data: { roles: ['ADMIN','RESPONSABLE_01','RESPONSABLE_02'] },
      loadChildren: () =>
        import('./features/activites/activites.routes')
          .then(m => m.ACTIVITES_ROUTES)
    },

    {
      path: 'communication',
      canActivate: [AuthGuard],
      data: { roles: ['ADMIN','RESPONSABLE_01','RESPONSABLE_02'] },
      loadChildren: () =>
        import('./features/communication/communication.routes')
          .then(m => m.COMMUNICATION_ROUTES)
    },

    {
      path: 'departement',
      canActivate: [AuthGuard],
      data: { roles: ['ADMIN','RESPONSABLE_01','RESPONSABLE_02'] },
      loadChildren: () =>
        import('./features/departement/departement.routes')
          .then(m => m.DEPARTEMENT_ROUTES)
    },

    {
      path: 'enseignements',
      canActivate: [AuthGuard],
      data: { roles: ['ADMIN','RESPONSABLE_01','RESPONSABLE_02'] },
      loadChildren: () =>
        import('./features/enseignants/enseignement.routes')
          .then(m => m.ENSEIGNEMENT_ROUTES)
    },

    {
      path: 'documents',
      canActivate: [AuthGuard],
      data: { roles: ['ADMIN','RESPONSABLE_01','RESPONSABLE_02'] },
      loadChildren: () =>
        import('./features/documents/ddocuments.routes')
          .then(m => m.DOCUMENTS_ROUTES)
    },

    {
      path: 'finances',
      canActivate: [AuthGuard],
      data: { roles: ['ADMIN','RESPONSABLE_01','RESPONSABLE_02'] },
      loadChildren: () =>
        import('./features/finances/finance.routes')
          .then(m => m.FINANCE_ROUTES)
    },

    {
      path: 'membres',
      canActivate: [AuthGuard],
      data: { roles: ['ADMIN','RESPONSABLE_01','RESPONSABLE_02'] },
      loadChildren: () =>
        import('./features/membres/membres.routes')
          .then(m => m.MEMBRE_ROUTES)
    },

    {
      path: 'responsables',
      canActivate: [AuthGuard],
      data: { roles: ['ADMIN','RESPONSABLE_01','RESPONSABLE_02'] },
      loadChildren: () =>
        import('./features/responsable/responsable.routes')
          .then(m => m.RESPONSABLE_ROUTES)
    }

  ]
},

  {
    path: '**',
    redirectTo: 'login'
  }

];
