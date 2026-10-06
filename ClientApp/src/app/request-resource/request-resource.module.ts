import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//pagination module
import { NgxPaginationModule } from 'ngx-pagination';
//date picker
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BsDatepickerModule, BsDatepickerConfig  } from 'ngx-bootstrap/datepicker';
// shared module
import { SharedModule } from 'src/app/shared/shared.module';
import { RequestResourceRoutingModule } from './request-resource-routing.module';
import { RequestResourceComponent } from './request-resource.component';
import { AddEditRrComponent } from './add-edit-rr/add-edit-rr.component';
import { AddEditRrMobileComponent } from './add-edit-rr-mobile/add-edit-rr-mobile.component';


@NgModule({
  declarations: [
    RequestResourceComponent,
    AddEditRrComponent,
    AddEditRrMobileComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RequestResourceRoutingModule,
    BsDatepickerModule.forRoot(),
    SharedModule,
    NgxPaginationModule,
    NgbModule
  ],
  providers: [DatePipe, BsDatepickerConfig],
  exports: [
    AddEditRrMobileComponent]
})
export class RequestResourceModule { }
