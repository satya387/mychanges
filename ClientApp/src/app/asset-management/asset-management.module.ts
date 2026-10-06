import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AssetManagementComponent } from './asset-management.component';
import { AssetManagementRoutingModule } from './asset-management-routing.module';
import { AddAssestManagementComponent } from './add-assest-management/add-assest-management.component';
import { FormsModule } from '@angular/forms';
import { BsDatepickerModule, BsDatepickerConfig  } from 'ngx-bootstrap/datepicker';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  declarations: [
    AssetManagementComponent,
    AddAssestManagementComponent
   
  ],
  imports: [
    CommonModule,
    AssetManagementRoutingModule,
    BsDatepickerModule.forRoot(),
    FormsModule,
    NgxPaginationModule,
    NgbModule,
    ReactiveFormsModule
  ],
  providers: [DatePipe, BsDatepickerConfig],
})
export class AssetManagementModule { }
