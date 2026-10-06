import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { HomeComponent } from './home/home.component';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { PayrollComponent } from './shared/payroll/payroll.component';
import { SearchComponent } from './shared/search/searchs.component';
import { PayrollJournalComponent } from './shared/payroll-journal/payroll-journal.component';
import { LineChartComponent } from './charts/revenue-top-five-chart/revenue-top-five-chart.component';
import { AccDashboardComponent } from './charts/acc-dashboard/acc-dashboard.component';
import { MarginChartComponent } from './charts/direct-margin-chart/direct-margin-chart.component';
import { AccMarginChartComponent } from './charts/acc-margin-chart/acc-margin-chart.component';
import { BarChartComponent } from './charts/head-count-chart/head-count-chart.component';
import { PieChartComponent } from './charts/pie-chart/pie-chart.component';
import { UtilizationChartComponent } from './charts/utilization-chart/utilization-chart.component';
import { UnauthorizedAccessPageComponent } from './shared/unauthorized-access-page/unauthorized-access-page.component';
import { OpprtunityRlsExpenseComponent } from './opportunity-rls-expense/opprtunity-rls-expense.component';
// import { LoginAsComponent } from './loginAs/loginAs.component';
import { OpportunityGuard } from './opportunity-rls-expense/opportunity.guard';
import { LoginAsModule } from './login-as/login-as.module';
import { CommissionReportComponent } from './commission-report/commission-report.component';
import { CommissionReportGuard } from './commission-report/commission-report.guard';

import { RiskIndexModule } from './risk-index/risk-index.module';
import { CreatedProjectComponent } from './opportunity-rls-expense/created-project/created-project.component';
import { PlanActualComponent } from './opportunity-rls-expense/plan-actual/plan-actual.component';
import { AlertModuleModule } from './alert-module/alert-module.module';
import { TimelineDetailsComponent } from './opportunity-rls-expense/timeline-details/timeline-details.component';
import { IronCladDashboardComponent } from './main-layout/iron-clad-dashboard/iron-clad-dashboard.component';
import { AddContractManagementDocumentsComponent } from './contract-management/add-contract-management-documents/add-contract-management-documents.component';
import { IronCladContractDetailsComponent } from './contract-management/iron-clad-contract-details/iron-clad-contract-details.component';
import {IronCladDashboardGuard} from './main-layout/iron-clad-dashboard/iron-clad-dashboard.guard'

const routes: Routes = [
  // {
  //   path: 'Customer-Contract-Review', component: MainLayoutComponent
  // },
  {
    path: 'payroll', component: PayrollComponent
  }, 
  
  {
    path: 'payroll-journal',
    component: PayrollJournalComponent,
    canActivate: [MsalGuard],
    loadChildren: () =>
      import('./shared/payroll-journal/payroll-journal.module').then(
        (m) => m.PayrollJournalModule
      ),
  },
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full',
    canActivate: [MsalGuard],
    loadChildren: () => import('./home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'content-page',
    canActivate: [MsalGuard],
    loadChildren: () =>
      import('./content-page/content-page.module').then(
        (m) => m.ContentPageModule
      ),
  },{
    path: 'request-resource',
    canActivate: [MsalGuard],
    loadChildren: () =>
      import('./request-resource/request-resource.module').then(
        (m) => m.RequestResourceModule
      ),
  },
  {
    path: 'ray',
    canActivate: [MsalGuard],
    loadChildren: () =>
      import('./ray/ray.module').then(
        (m) => m.RayModule
      ),
  },
  {
    path: '',
    canActivate: [MsalGuard],
    loadChildren: () =>
      import('./admin/admin.module').then((m) => m.AdminModule),
  },
  {
    path: 'search/:query', component: SearchComponent

  },
  {
    path: '',
    canActivate: [MsalGuard],
    loadChildren: () =>
      import('./charts/charts.module').then(
        (m) => m.ChartsModule
      ),
  },
  {
    path: '',
    canActivate: [MsalGuard],
    loadChildren: () =>
      import('./mail-box-log/mail-box-log.module').then(
        (m) => m.MailBoxLogModule
      ),
  },
  {
    path: 'unauthorized-access',component: UnauthorizedAccessPageComponent
  },
  {
    path: '',
    canActivate: [MsalGuard],
    loadChildren: () =>
      import('./customer-value-add/customer-value-add.module').then(
        (m) => m.CustomerValueAddModule
      ),
  },
  {
    path: 'CSAT',
    canActivate: [MsalGuard],
    loadChildren: () =>
      import('./customer-satisfaction-score/customer-satisfaction-score.module').then(
        (m) => m.CustomerSatisfactionScoreModule
      ),
  },
  {
    path: 'purchase-request',
    canActivate: [MsalGuard],
    loadChildren: () =>
      import('./procurement-process/purchase-request/purchase-request.module').then(
        (m) => m.PurchaseRequestModule
      ),
  },
 
  { path: 'ray-main', loadChildren: () => import('./ray/ray-main/ray-main.module').then(m => m.RayMainModule) },
  { path: 'ray', loadChildren: () => import('./ray/ray.module').then(m => m.RayModule) },
  { path: 'resource-loading', component: OpprtunityRlsExpenseComponent, canActivate: [MsalGuard, OpportunityGuard]},
  // { path: 'customer-value-add', loadChildren: () => import('./customer-value-add/customer-value-add.module').then(m => m.CustomerValueAddModule) }
  { path: 'asset-management', loadChildren: () => import('./asset-management/asset-management.module').then(m => m.AssetManagementModule) },
  { path: 'asset-assignment', loadChildren: () => import('./asset-management/asset-assignment/asset-assignment.module').then(m => m.AssetAssignmentModule) },
  {
    path: 'login-as-feature',canActivate: [MsalGuard], loadChildren: () => import('./login-as/login-as.module').then(m => m.LoginAsModule)
  },
  { path: 'sga-dashboard', loadChildren: () => import('./sga-dashboard/sga-dashboard.module').then(m => m.SgaDashboardModule) }, 
  { path: 'segment-dashboard', loadChildren: () => import('./segment-dashboard/segment-dashboard.module').then(m => m.SegmentDashboardModule) }, 
  { path: 'practice-dashboard', loadChildren: () => import('./practice-dashboard/practice-dashboard.module').then(m => m.PracticeDashboardModule) }, 
  // { path: 'commission-report', loadChildren: () => import('./commission-report/commission-report.module').then(m => m.CommissionReportModule) } 
  { path: 'commission-report', component: CommissionReportComponent, canActivate: [MsalGuard, CommissionReportGuard] },
  
  { path: 'risk-index', loadChildren: () => import('./risk-index/risk-index.module').then(m => m.RiskIndexModule) },
  { path: 'download-rls', component: CreatedProjectComponent, canActivate: [MsalGuard, OpportunityGuard] },
  {
    path: 'timeline',
   component: TimelineDetailsComponent, canActivate: [MsalGuard, OpportunityGuard] 
  },
  { path: 'risk-index', loadChildren: () => import('./risk-index/risk-index.module').then(m => m.RiskIndexModule) },
  { path: 'alert-module',canActivate: [MsalGuard], loadChildren: () => import('./alert-module/alert-module.module').then(m => m.AlertModuleModule) },
   {
    path: 'Customer-Contract-Review',
    component: MainLayoutComponent,
    children: [

      {
        path: 'dashboard',
        component: IronCladDashboardComponent,
        canActivate: [MsalGuard, IronCladDashboardGuard] 
      },

      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'add-contract-management-documents',
        component: AddContractManagementDocumentsComponent,
        canActivate: [MsalGuard, IronCladDashboardGuard] 
      },
      {
        path: 'Contract-Details/:id',
        component: IronCladContractDetailsComponent,
         canActivate: [MsalGuard, IronCladDashboardGuard] 
      }

    ]
  },

  {
    path: '',
    redirectTo: 'Customer-Contract-Review/dashboard',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
