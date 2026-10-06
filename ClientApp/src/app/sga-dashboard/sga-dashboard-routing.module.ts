import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SgaDashboardComponent } from './sga-dashboard.component';
import { SgaDashboardGuard } from './sga-dashboard.guard';
import { MsalGuard } from '@azure/msal-angular';

const routes: Routes = [
  {
    path: '',
    component: SgaDashboardComponent,
    //canActivate: [MsalGuard,SgaDashboardGuard]
    //loadChildren: () => import('../purchase-request/purchase-request.module').then((m) => m.PurchaseRequestModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SgaDashboardRoutingModule { }
