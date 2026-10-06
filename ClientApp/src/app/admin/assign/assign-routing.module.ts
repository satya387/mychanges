import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { AssignComponent } from './assign.component';

const routes: Routes = [
  {
    path: 'assign',
    pathMatch: 'full',
    component: AssignComponent,
    canActivate: [MsalGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssignRoutingModule { }
