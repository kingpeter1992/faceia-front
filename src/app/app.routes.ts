import { Routes } from '@angular/router';
import { RecognizeComponent } from './pages/recognize/recognize.component';
import { EnrollComponent } from './pages/enroll-component/enroll-component';
import { Admin } from './pages/admin/admin';
import { Reconait } from './pages/reconait/reconait';


export const routes: Routes = [
  {
    path: '',
    redirectTo: 'enroll',
    pathMatch: 'full'
  },

    {
    path: 'admin',
    component: Admin
  },

  {
    path: 'enroll',
    component: EnrollComponent
  },

  {
    path: 'recognize',
    component: RecognizeComponent
  },

   {
    path: 'reconnaitre',
    component: Reconait
  },

  {
    path: '**',
    redirectTo: 'enroll'
  }

]
