import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SegmentDashboardComponent } from './segment-dashboard.component';
import { SegmentDashboardGuard } from './segment-dashboard.guard';
import { MsalGuard } from '@azure/msal-angular';

const routes: Routes = [
  {
    path: '',
    component: SegmentDashboardComponent,
    //canActivate: [MsalGuard,SgaDashboardGuard]
    //loadChildren: () => import('../purchase-request/purchase-request.module').then((m) => m.PurchaseRequestModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SegmentDashboardRoutingModule { }
