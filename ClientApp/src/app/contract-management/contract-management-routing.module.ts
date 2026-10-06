import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddContractManagementDocumentsComponent } from './add-contract-management-documents/add-contract-management-documents.component';

const routes: Routes = [
  {
    path: 'add-documents',
    component: AddContractManagementDocumentsComponent
  },
  {
    path: 'edit-documents',
    component: AddContractManagementDocumentsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContractManagementRoutingModule { }