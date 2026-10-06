import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { UserRoleSectionComponent } from './user-role-section/user-role-section.component';
import { UsersComponent } from './users.component';

const routes: Routes = [
  {
    path: 'users',
    pathMatch: 'full',
    component: UsersComponent,
    canActivate: [MsalGuard]
  }, {
    path: 'user-role-section',
    component: UserRoleSectionComponent,
    canActivate: [MsalGuard]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
