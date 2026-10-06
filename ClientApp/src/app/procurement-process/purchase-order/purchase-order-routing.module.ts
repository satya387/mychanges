import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PurchaseOrderComponent } from './purchase-order.component';
import { MsalGuard } from '@azure/msal-angular';
import { AddPurchaseOrderComponent } from '../add-purchase-order/add-purchase-order.component';
import { POGuard } from './purchase-order.guard';
import { PurchaseOrderModule } from './purchase-order.module';

const routes: Routes = [
  {
      path: 'purchase-order',
      pathMatch: 'full',
      component: PurchaseOrderComponent,
      canActivate: [MsalGuard,POGuard],
      loadChildren: () => import('../purchase-order/purchase-order.component').then((m) => PurchaseOrderModule)
    
  }, {
    path: 'add-edit-Purchase',
    component: AddPurchaseOrderComponent,
    canActivate: [MsalGuard,POGuard],
  loadChildren: () => import('../add-purchase-order/add-purchase-order.component').then((m) => PurchaseOrderModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PurchaseOrderRoutingModule { }
