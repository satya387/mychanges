import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatTabsModule} from '@angular/material/tabs';
import { MatDialogModule } from '@angular/material/dialog';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { AllowanceModuleComponent } from './allowance-module.component';
import { AllowanceModuleRoutingModule } from './allowance-module-routing.module';
import { AddAllowanceComponent } from './add-allowance/add-allowance.component';
import { ApproveRejectAllowanceModuleComponent } from './approve-reject-allowance-module/approve-reject-allowance-module.component';


@NgModule({
  declarations: [
    AllowanceModuleComponent,
    AddAllowanceComponent,
    ApproveRejectAllowanceModuleComponent,
  ],
  imports: [
    CommonModule,
    MatDialogModule,   
    AllowanceModuleRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    NgxPaginationModule,
    MatTooltipModule,
    MatFormFieldModule,
    BsDatepickerModule.forRoot(),
    MatTabsModule
  ],
  exports: [
    AllowanceModuleComponent,
    AddAllowanceComponent]
})
export class AllowanceModuleModule { }
