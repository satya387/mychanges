import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { AddEditRolesComponent } from './add-edit-roles/add-edit-roles.component';
import { RoleSectionComponent } from './role-section/role-section.component';
import { RolesComponent } from './roles.component';

const routes: Routes = [
  {
    path: 'roles',
    component: RolesComponent,
    canActivate: [MsalGuard]
  }, {
    path: 'add-role',
    component: AddEditRolesComponent,
    canActivate: [MsalGuard]
  }, {
    path: 'role-section',
    component: RoleSectionComponent,
    canActivate: [MsalGuard]
  }, {
    path: 'edit-role',
    component: AddEditRolesComponent,
    canActivate: [MsalGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RolesRoutingModule { }
