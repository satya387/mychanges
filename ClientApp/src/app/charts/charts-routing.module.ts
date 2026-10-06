import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { AccDashboardComponent } from './acc-dashboard/acc-dashboard.component';
import { ChartsGuard } from './charts.guard';
const routes: Routes = [
  {
    path: 'delivery-dashboard',
    pathMatch: 'full',
    component: AccDashboardComponent,
    canActivate: [MsalGuard, ChartsGuard],
    loadChildren: () => import('../charts/charts.module').then((m) => m.ChartsModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChartsRoutingModule { }
