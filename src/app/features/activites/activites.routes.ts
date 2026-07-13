import { Routes } from '@angular/router';

export const ACTIVITES_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'activites',
    pathMatch: 'full'
  },
  {
    path: 'calendrier',
    loadComponent: () =>
      import('./pages/admin-component-acitivte/admin-component-acitivte')
        .then(m => m.AdminComponentAcitivte)
  },
    {
    path: 'cultes',
    loadComponent: () =>
      import('./pages/culte-component/culte-component')
        .then(m => m.CulteComponent)
  },

   {
    path: 'addculte',
    loadComponent: () =>
      import('./pages/culte-create-component/culte-create-component')
        .then(m => m.CulteCreateComponent)
  },
{
  path: 'editculte/:id',
  loadComponent: () =>
    import('./pages/culte-create-component/culte-create-component')
      .then(m => m.CulteCreateComponent)
},

//assistance
{
  path: 'assistance',
  loadComponent: () =>
    import('./pages/assistance-culte/assistance-culte')
      .then(m => m.AssistanceCulte)
}


];
