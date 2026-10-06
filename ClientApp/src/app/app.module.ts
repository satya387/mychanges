import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ErrorHandler, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { AlertsModule } from './shared/alerts/alerts.module';
import { PublicClientApplication, InteractionType } from '@azure/msal-browser';
import { MsalBroadcastService, MsalGuard, MsalInterceptor, MsalModule, MsalService, MSAL_GUARD_CONFIG,
  MSAL_INSTANCE, MSAL_INTERCEPTOR_CONFIG, MsalRedirectComponent  } from '@azure/msal-angular';
import { MSALInstanceFactory, MSALGuardConfigFactory, MSALInterceptorConfigFactory } from './config/azureAD.config';
import { ToastrModule } from 'ngx-toastr';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { NgHttpLoaderModule } from 'ng-http-loader';

import { environment } from 'src/environments/environment';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AppRoutingModule } from './app-routing.module';
import { LoginModule } from './login/login.module';
import { SharedModule } from './shared/shared.module';
import { ApiInterceptor } from './interceptor/api.interceptor';
import { GlobalErrorHandlerService } from './common/error-handler/global-error-handler.service';
import { ContentPageModule } from './content-page/content-page.module';
import { ViewAllTilesModule } from './view-all-tiles/view-all-tiles.module';
import { RequestResourceModule } from './request-resource/request-resource.module';
import { LogoutModule } from './logout/logout.module';
import { SearchModule } from './shared/search/search.module';
import { PayrollComponent } from './shared/payroll/payroll.component';
import { PayrollJournalModule } from './shared/payroll-journal/payroll-journal.module';
import { AgChartsAngularModule } from 'ag-charts-angular';
import { ChartsModule } from './charts/charts.module';
import { AddEditContentComponent } from './admin/content/add-edit-content/add-edit-content.component';
import { AddCustomerValueAddComponent } from './customer-value-add/add-customer-value-add/add-customer-value-add.component';
import { MailBoxLogModule } from './mail-box-log/mail-box-log.module';
import { PurchaseRequestModule } from './procurement-process/purchase-request/purchase-request.module';
import { PurchaseOrderModule } from './procurement-process/purchase-order/purchase-order.module';
import { RejectPurchaseRequestModule } from './procurement-process/purchase-request/common-helper/reject-purchase-request/reject-purchase-request.module';
import { CustomerSatisfactionScoreModule } from './customer-satisfaction-score/customer-satisfaction-score.module';
import { ApprovePurchaseRequestModule } from './procurement-process/purchase-request/common-helper/approve-purchase-request/approve-purchase-request.module';
import { RayComponent } from './ray/ray.component';
import { RayModule } from './ray/ray.module';
import { RayMainModule } from './ray/ray-main/ray-main.module';
import { ConfirmPurchaseOrderComponent } from './confirm-purchase-order/confirm-purchase-order.component';
import { OpportunityRlsExpenseModule } from './opportunity-rls-expense/opportunity-rls-expense.module';
import { RejectpoComponent } from './procurement-process/add-purchase-order/rejectpo/rejectpo.component';
import { RejectMessageComponent } from './procurement-process/reject-message/reject-message.component';
import { AssetAssignmentModule} from './asset-management/asset-assignment/asset-assignment.module'
import { SgaDashboardModule } from './sga-dashboard/sga-dashboard.module';
import { SegmentDashboardModule } from './segment-dashboard/segment-dashboard.module';
import { PracticeDashboardModule } from './practice-dashboard/practice-dashboard.module';
import { CommissionReportModule } from './commission-report/commission-report.module';
import { ContractManagementModule } from './contract-management/contract-management.module';

import { RiskIndexModule } from './risk-index/risk-index.module';
import { TabViewModule } from 'primeng/tabview';
import { CreatedProjectModule } from './opportunity-rls-expense/created-project/created-project.module';
import { PlanActualModule } from './opportunity-rls-expense/plan-actual/plan-actual.module';
import { AlertModuleModule } from './alert-module/alert-module.module';
import { AllowanceModuleModule } from './allowance-module/allowance-module.module';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { IronCladHeaderComponent } from './shared/iron-clad-header/iron-clad-header.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { IronCladDashboardComponent } from './main-layout/iron-clad-dashboard/iron-clad-dashboard.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PayrollComponent,
    ConfirmPurchaseOrderComponent,
    RejectpoComponent,
    RejectMessageComponent,
    MainLayoutComponent,
    SidebarComponent,
    IronCladDashboardComponent,
    // RayComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    BrowserAnimationsModule,
    RouterModule,
    CKEditorModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    LogoutModule,
    AlertsModule,
    SharedModule,
    ContentPageModule,
    ViewAllTilesModule,
    RequestResourceModule,
    ChartsModule,
    MailBoxLogModule,
    PayrollJournalModule,
    SearchModule,
    AgChartsAngularModule,
    PurchaseOrderModule,
    AllowanceModuleModule,
    RayModule,
    RayMainModule,
    OpportunityRlsExpenseModule,
    PurchaseRequestModule,
    RejectPurchaseRequestModule,
    CustomerSatisfactionScoreModule,
    ApprovePurchaseRequestModule,
    AssetAssignmentModule,
    SgaDashboardModule,
    SegmentDashboardModule,
    PracticeDashboardModule,
    CommissionReportModule,
    ContractManagementModule,
    RiskIndexModule,
    TabViewModule,
    CreatedProjectModule,
    PlanActualModule,
    AlertModuleModule,
    FormsModule,
    NgHttpLoaderModule.forRoot(),
    ToastrModule.forRoot(
      {
        closeButton: true,
        timeOut: 2500,
        preventDuplicates: true,
        enableHtml :  true
      }
    ),
    NgIdleKeepaliveModule.forRoot(),
    MsalModule.forRoot( new PublicClientApplication({
			auth: {
				clientId: environment.clientId
			},
			cache: {
				cacheLocation: 'localStorage'
			}
		}), {
			interactionType: InteractionType.Redirect,
			authRequest: {
				scopes: ['user.read']
			}
		}, {
			interactionType: InteractionType.Redirect,
			protectedResourceMap: new Map([
				['https://graph.microsoft.com/v1.0/me', ['user.read']]
			])
		})
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiInterceptor,
      multi: true
    },
    {
      provide: MSAL_INSTANCE,
      useFactory: MSALInstanceFactory
    },
    {
      provide: MSAL_GUARD_CONFIG,
      useFactory: MSALGuardConfigFactory
    },
    {
      provide: MSAL_INTERCEPTOR_CONFIG,
      useFactory: MSALInterceptorConfigFactory,
    },
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandlerService
    },
    MsalService,
    MsalGuard,
    MsalBroadcastService
  ],
  bootstrap: [AppComponent, MsalRedirectComponent]
  // exports: [MatFormFieldModule,
  //   MatInputModule,
  //   MatDatepickerModule,
  //   MatNativeDateModule,
  //   MatIconModule
  // ]
})
export class AppModule { }

