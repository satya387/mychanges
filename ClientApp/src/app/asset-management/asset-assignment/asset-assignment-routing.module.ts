import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AssetAssignmentComponent} from './asset-assignment.component';
import { MsalGuard } from '@azure/msal-angular';
import {AssetAssignmentDetailsComponent} from './asset-assignment-details/asset-assignment-details.component';
import { AddAssetAssignmentComponent } from './add-asset-assignment/add-asset-assignment.component';
import {AddAssetAssignmentDetailsComponent} from './asset-assignment-details/add-asset-assignment-details/add-asset-assignment-details.component'

const routes: Routes = [
  {
    path: '',
    component: AssetAssignmentComponent,
    canActivate: [MsalGuard]
  },
  {
    path: 'asset-assignment-details',
    component: AssetAssignmentDetailsComponent,
    canActivate: [MsalGuard]
  },
  {
    path: 'add-asset-assignment',
    component: AddAssetAssignmentComponent,
    canActivate: [MsalGuard]
  },
  {
    path: 'add-asset-assignment-details',
    component: AddAssetAssignmentDetailsComponent,
    canActivate: [MsalGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssetAssignmentRoutingModule { }
