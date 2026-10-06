import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { CustomerSatisfactionScoreComponent } from './customer-satisfaction-score.component';
import { ViewRespondentComponent } from './view-respondent/view-respondent.component';
import { CustomerSatisfactionScoreModule } from './customer-satisfaction-score.module';

const routes: Routes = [
  {
    path: '',
    component: CustomerSatisfactionScoreComponent,
    canActivate: [MsalGuard]
  },
   {
    path: 'add-edit-CSAT',
    component: ViewRespondentComponent,
    canActivate: [MsalGuard],
  loadChildren: () => import('../customer-satisfaction-score/view-respondent/view-respondent.component').then((m) => CustomerSatisfactionScoreModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerSatisfactionScoreRoutingModule { }
