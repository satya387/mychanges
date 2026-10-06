import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { LoginAsComponent } from './login-as.component';
import {LoginAsGuard} from './login-as.guard';

 
const routes: Routes = [
  {
    path: '',
    component: LoginAsComponent,
    canActivate: [MsalGuard,LoginAsGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginAsRoutingModule { }
