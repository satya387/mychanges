import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { AddPurchaseRequestComponent } from './add-purchase-request/add-purchase-request.component';
import { PurchaseRequestComponent } from './purchase-request.component';
import { PurchaseRequestGuard } from './purchase-request.guard';

const routes: Routes = [
    {
      path: '',
      component: PurchaseRequestComponent,
      canActivate: [MsalGuard,PurchaseRequestGuard]
      //loadChildren: () => import('../purchase-request/purchase-request.module').then((m) => m.PurchaseRequestModule)
    }, 
    {
      path: 'add-purchase-request',
      component: AddPurchaseRequestComponent,
      canActivate: [MsalGuard,PurchaseRequestGuard]
      //loadChildren: () => import('../purchase-request/purchase-request.module').then((m) => m.PurchaseRequestModule)
    }
  ];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class PurchaseRequestRoutingModule { }