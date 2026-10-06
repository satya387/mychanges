import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//pagination module
import { NgxPaginationModule } from 'ngx-pagination';
//date picker
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
// shared module
import { SharedModule } from 'src/app/shared/shared.module';
import { PayrollJournalComponent } from 'src/app/shared/payroll-journal/payroll-journal.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatDatepicker, MatDatepickerModule} from '@angular/material/datepicker';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule, MATERIAL_SANITY_CHECKS} from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MY_FORMATS } from './payroll-journal.component';
import {FormControl} from '@angular/forms';
import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import * as _moment from 'moment';

@NgModule({
  declarations: [
    PayrollJournalComponent
  ],
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    MatNativeDateModule
  ],
  providers: [{
    provide: DateAdapter,
    useClass: MomentDateAdapter,
    deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
  },
  {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  {
    provide: MATERIAL_SANITY_CHECKS,
    useValue: false
    }
],
  exports: [
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class PayrollJournalModule { }
