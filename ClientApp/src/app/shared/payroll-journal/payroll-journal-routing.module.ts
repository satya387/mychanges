import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { PayrollJournalComponent } from './payroll-journal.component'
const routes: Routes = [
  {
    path: '',
    component: PayrollJournalComponent,
    canActivate: [MsalGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PayrollJournalRoutingModule { }
