import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PracticeDashboardRoutingModule } from './practice-dashboard-routing.module';
import { PracticeDashboardComponent } from './practice-dashboard.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { TreeTableModule } from 'primeng/treetable';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AgChartsAngularModule } from 'ag-charts-angular';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@NgModule({
  declarations: [
    PracticeDashboardComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    PracticeDashboardRoutingModule,
    NgbModule,
    SharedModule,
    NgSelectModule,
    TreeTableModule,
    MatFormFieldModule,
    MatTooltipModule,
    AgChartsAngularModule,
    MatSlideToggleModule
  ]
})
export class PracticeDashboardModule { }
