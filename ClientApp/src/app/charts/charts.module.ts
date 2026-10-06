import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgChartsAngularModule } from 'ag-charts-angular';
import { LineChartComponent } from './revenue-top-five-chart/revenue-top-five-chart.component';
import { AccDashboardComponent } from './acc-dashboard/acc-dashboard.component';
import { PieChartComponent } from './pie-chart/pie-chart.component';
import { AccMarginChartComponent } from './acc-margin-chart/acc-margin-chart.component';
import { BarChartComponent } from './head-count-chart/head-count-chart.component';
import { MarginChartComponent } from './direct-margin-chart/direct-margin-chart.component';
import { UtilizationChartComponent } from './utilization-chart/utilization-chart.component';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PyramidChartComponent } from './pyramid-chart/pyramid-chart.component';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChartsRoutingModule } from './charts-routing.module';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { BookToBillComponent } from './book-to-bill/book-to-bill.component';
import { AccountRiskComponent } from './account-risk/account-risk.component';
import { QualityDashboardComponent } from './quality-dashboard/quality-dashboard.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SharedCostChartComponent } from './shared-cost-chart/shared-cost-chart.component'
import { EbitdaChartComponent } from './ebitda-chart/ebitda-chart.component';
// import { ChartModule, AccumulationChartModule } from '@syncfusion/ej2-angular-charts';


@NgModule({
  declarations: [
    LineChartComponent,
    PieChartComponent,
    BarChartComponent,
    MarginChartComponent,
    AccMarginChartComponent,
    AccDashboardComponent,
    UtilizationChartComponent,
    PyramidChartComponent,
    BookToBillComponent,
    AccountRiskComponent,
    QualityDashboardComponent,
    SharedCostChartComponent,
    EbitdaChartComponent,
  ],
  imports: [
    CommonModule,
    AgChartsAngularModule,
    MatSelectModule,
    MatRadioModule,
    MatFormFieldModule,
    MatSlideToggleModule,
    // BrowserAnimationsModule,
    FormsModule,
    ChartsRoutingModule,
    ReactiveFormsModule,
    MatInputModule,
    MatAutocompleteModule,
    MatIconModule,
    MatTooltipModule
  ]
})
export class ChartsModule { }
