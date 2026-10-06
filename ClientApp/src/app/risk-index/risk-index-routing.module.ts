import { NgModule } from '@angular/core';
import { MsalGuard } from '@azure/msal-angular';
import { RiskIndexComponent } from './risk-index.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
      path: '',
      component: RiskIndexComponent,
      canActivate: [MsalGuard]
    }, {
      path: 'risk-index',
      component: RiskIndexComponent,
      canActivate: [MsalGuard]
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RiskIndexRoutingModule { }
