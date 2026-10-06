import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
// import { AddPurchaseOrderComponent } from '../add-purchase-order/add-purchase-order.component';
import { AllowanceModuleModule } from './allowance-module.module';
import { AllowanceModuleComponent } from './allowance-module.component';
import { AddAllowanceComponent } from './add-allowance/add-allowance.component';
import { AllowanceModuleGuard } from './allowance-module.guard';
const routes: Routes = [
  {
      path: 'allowance-module',
      pathMatch: 'full',
      component: AllowanceModuleComponent,
      canActivate: [MsalGuard],
      loadChildren: () => import('../allowance-module/allowance-module.component').then((m) => AllowanceModuleModule)
    
  },
   {
    path: 'add-edit-allowance',
    component: AddAllowanceComponent,
    canActivate: [MsalGuard],
  loadChildren: () => import('./add-allowance/add-allowance.component').then((m) => AllowanceModuleModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AllowanceModuleRoutingModule { }
