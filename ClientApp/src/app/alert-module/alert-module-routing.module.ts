import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AlertModuleComponent } from './alert-module.component';
import { MsalGuard } from '@azure/msal-angular';
import { CreateAlertComponent } from './create-alert/create-alert.component';
import {ActionAlertComponent} from './action-alert/action-alert.component';
import { AlertModuleModule } from './alert-module.module';
import { AlertModuleGuard } from './alert-module.guard';

const routes: Routes = [
  {
    path: '',
    component: AlertModuleComponent,
    canActivate: [MsalGuard,AlertModuleGuard]
  }, {
    path: 'alert-module',
    component: AlertModuleComponent,
    canActivate: [MsalGuard,AlertModuleGuard]
  },
  {
    path: 'create-alert',
    component: CreateAlertComponent,
    canActivate: [MsalGuard,AlertModuleGuard],
  loadChildren: () => import('../alert-module/create-alert/create-alert.component').then((m) => AlertModuleModule)
  },
  {
    path: 'action-alert',
    component: ActionAlertComponent,
    canActivate: [MsalGuard,AlertModuleGuard],
  loadChildren: () => import('../alert-module/action-alert/action-alert.component').then((m) => AlertModuleModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AlertModuleRoutingModule { }
