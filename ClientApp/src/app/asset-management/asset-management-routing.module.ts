import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssetManagementComponent } from './asset-management.component';
import { MsalGuard } from '@azure/msal-angular';
import {AddAssestManagementComponent} from './add-assest-management/add-assest-management.component';

 
const routes: Routes = [
  {
    path: '',
    component: AssetManagementComponent,
    canActivate: [MsalGuard]
  },
  {
    path: 'add-assest-management',
    component: AddAssestManagementComponent,
    canActivate: [MsalGuard]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssetManagementRoutingModule { }
