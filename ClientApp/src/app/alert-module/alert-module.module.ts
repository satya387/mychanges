import { NgModule } from '@angular/core';
import { CommonModule , DatePipe } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { AlertModuleRoutingModule } from './alert-module-routing.module';
import { AlertModuleComponent } from './alert-module.component';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CreateAlertComponent } from './create-alert/create-alert.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ActionAlertComponent } from './action-alert/action-alert.component';
import { BsDatepickerModule, BsDatepickerConfig  } from 'ngx-bootstrap/datepicker';
import { AlertFilterComponent } from './alert-filter/alert-filter.component';


export const MY_DATE_FORMATS = {
  parse: { dateInput: 'DD-MM-YYYY' },
  display: {
    dateInput: 'DD-MM-YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  }
};
@NgModule({
  declarations: [
    AlertModuleComponent,
    CreateAlertComponent,
    ActionAlertComponent,
    AlertFilterComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    AlertModuleRoutingModule,
    ReactiveFormsModule,
    NgSelectModule,
    BsDatepickerModule.forRoot(),
  ],
  providers: [DatePipe, BsDatepickerConfig],
})
export class AlertModuleModule { }
