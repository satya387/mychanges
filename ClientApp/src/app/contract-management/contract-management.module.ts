import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ContractManagementComponent } from './contract-management.component';
import { ContractManagementRoutingModule } from './contract-management-routing.module';
import { AddContractManagementDocumentsComponent } from './add-contract-management-documents/add-contract-management-documents.component';
import { FormsModule } from '@angular/forms';
import { BsDatepickerModule, BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { IronCladContractDetailsComponent } from './iron-clad-contract-details/iron-clad-contract-details.component';
import { IronCladApprovalsComponent } from './iron-clad-approvals/iron-clad-approvals.component';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [
    ContractManagementComponent,
    AddContractManagementDocumentsComponent,
    IronCladContractDetailsComponent,
    IronCladApprovalsComponent
  ],
  exports: [
    AddContractManagementDocumentsComponent
  ],
  imports: [
    CommonModule,
    ContractManagementRoutingModule,
    BsDatepickerModule.forRoot(),
    FormsModule,
    NgxPaginationModule,
    NgbModule,
    ReactiveFormsModule,
    NgSelectModule
  ],
  providers: [DatePipe, BsDatepickerConfig],
})
export class ContractManagementModule { }