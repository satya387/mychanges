import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommissionReportRoutingModule } from './commission-report-routing.module';
import { CommissionReportComponent } from './commission-report.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule} from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AddCommissionReportComponent } from './add-commission-report/add-commission-report.component'
import { FormsModule } from '@angular/forms';
import { CurrencyPipe, DecimalPipe  } from '@angular/common';
import { DrillDownCommissionReportComponent } from './drill-down-commission-report/drill-down-commission-report.component';
import { TreeTableModule } from 'primeng/treetable';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSortModule } from '@angular/material/sort';
import { MatSelectModule } from '@angular/material/select';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [
    CommissionReportComponent,
    AddCommissionReportComponent,
    DrillDownCommissionReportComponent
  ],
  imports: [
    CommonModule,
    CommissionReportRoutingModule,
    MatTableModule, 
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    TreeTableModule,
    MatInputModule,
    MatFormFieldModule,
    MatSortModule,
    MatSelectModule,
    NgSelectModule
  ],
  providers: [ CurrencyPipe, DecimalPipe  ]
})
export class CommissionReportModule { }
