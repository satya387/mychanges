import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PracticeDashboardComponent } from './practice-dashboard.component';
import { PracticeDashboardGuard } from './practice-dashboard.guard';
import { MsalGuard } from '@azure/msal-angular';

const routes: Routes = [
  {
    path: '',
    component: PracticeDashboardComponent,
    //canActivate: [MsalGuard,SgaDashboardGuard]
    //loadChildren: () => import('../purchase-request/purchase-request.module').then((m) => m.PurchaseRequestModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PracticeDashboardRoutingModule { }
