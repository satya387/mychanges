import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OpprtunityRlsExpenseComponent } from './opprtunity-rls-expense.component';
import { OpportunityComponent } from './opportunity/opportunity.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { RlsComponent } from './rls/rls.component';
import { RolePopupComponent } from './role-popup/role-popup.component';
import { ExpenseComponent } from './expense/expense.component';
import { ExpensePopupComponent } from './expense-popup/expense-popup.component';
import { OpportunityLandingPageComponent } from './opportunity-landing-page/opportunity-landing-page.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatTabsModule} from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ApproveRejectOpportunityModalComponent } from './approve-reject-opportunity-modal/approve-reject-opportunity-modal.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatExpansionModule } from '@angular/material/expansion';
import { SsrsReportComponent } from './ssrs-report/ssrs-report.component';
import { SafePipe } from './ssrs-report/safe.pipe';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DashboardChartsComponent } from './dashboard-charts/dashboard-charts.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AgChartsAngularModule } from 'ag-charts-angular';
import { ImportRlsComponent } from './import-rls/import-rls.component';
import { ContingencyComponent } from './contingency/contingency.component';
import { TimelineDetailsComponent } from './timeline-details/timeline-details.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';



@NgModule({
  declarations: [
    OpprtunityRlsExpenseComponent,
    OpportunityComponent,
    RlsComponent,
    RolePopupComponent,
    ExpenseComponent,
    ExpensePopupComponent,
    OpportunityLandingPageComponent,
    ApproveRejectOpportunityModalComponent,
    SsrsReportComponent,
    SafePipe,
    DashboardChartsComponent,
    ImportRlsComponent,
    ContingencyComponent,
    TimelineDetailsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbTypeaheadModule,
    NgSelectModule,
    NgxPaginationModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatTabsModule,
    MatDialogModule,
    MatInputModule,
    MatExpansionModule,
    NgxChartsModule,
    MatSnackBarModule,
    AgChartsAngularModule,
    MatAutocompleteModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class OpportunityRlsExpenseModule { }
