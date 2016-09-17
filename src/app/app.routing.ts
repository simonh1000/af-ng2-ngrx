import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FiltersComponent }      from './filters/filters.component';
import { FrameworkComponent }      from './framework/framework.component';

const appRoutes: Routes = [
  {
    path: 'recommendations/:filter',
    component: FrameworkComponent
  },{
    path: 'recommendations',
    component: FrameworkComponent
  },{
    path: '',
    redirectTo: '/recommendations',
    pathMatch: 'full'
}
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
