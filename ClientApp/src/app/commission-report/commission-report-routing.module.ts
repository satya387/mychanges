import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommissionReportComponent } from './commission-report.component';
import { MsalGuard } from '@azure/msal-angular';
import { CommissionReportGuard } from './commission-report.guard';
import { AddCommissionReportComponent } from './add-commission-report/add-commission-report.component';
import {DrillDownCommissionReportComponent} from  './drill-down-commission-report/drill-down-commission-report.component'

const routes: Routes = [{
  path: '',
  component: CommissionReportComponent,
  canActivate: [MsalGuard, CommissionReportGuard]
}, 
{
  path: 'add-commission-report',
  component: AddCommissionReportComponent,
  canActivate: [MsalGuard,CommissionReportGuard]
}, 
{
  path: 'commission-report-drill-down',
  component: DrillDownCommissionReportComponent,
  canActivate: [MsalGuard,CommissionReportGuard]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CommissionReportRoutingModule { }
