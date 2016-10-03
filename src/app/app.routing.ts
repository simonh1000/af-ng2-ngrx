import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FrameworkComponent } from './framework/framework.component';

const appRoutes: Routes = [
  {
    path: 'recommendations/:filter',
    component: FrameworkComponent
  }, {
    path: 'recommendations',
    component: FrameworkComponent
  }, {
    path: '',
    component: FrameworkComponent
  }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
