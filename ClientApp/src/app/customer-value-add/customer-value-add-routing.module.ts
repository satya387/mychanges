import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerValueAddComponent } from './customer-value-add.component';
import { CVAGuard } from './customer-value-add.guard';
import { MsalGuard } from '@azure/msal-angular';

// const routes: Routes = [{ path: '', component: CustomerValueAddComponent }];
const routes: Routes = [
  {
    path: 'customer-value-add',
    pathMatch: 'full',
    component: CustomerValueAddComponent,
    canActivate: [MsalGuard, CVAGuard],
    loadChildren: () => import('../customer-value-add/customer-value-add.module').then((m) => m.CustomerValueAddModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerValueAddRoutingModule { }
