import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { AddEditRrComponent } from './add-edit-rr/add-edit-rr.component';
import { RequestResourceComponent } from './request-resource.component';

const routes: Routes = [
  {
    path: '',
    component: RequestResourceComponent,
    canActivate: [MsalGuard]
  }, {
    path: 'add-edit-rr',
    component: AddEditRrComponent,
    canActivate: [MsalGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequestResourceRoutingModule { }
