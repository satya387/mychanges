import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssetAssignmentComponent } from './asset-assignment.component';
import { AssetAssignmentRoutingModule } from './asset-assignment-routing.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { AssetAssignmentDetailsComponent } from './asset-assignment-details/asset-assignment-details.component';
import { AddAssetAssignmentComponent } from './add-asset-assignment/add-asset-assignment.component';
import { FormsModule } from '@angular/forms';
import { BsDatepickerModule, BsDatepickerConfig  } from 'ngx-bootstrap/datepicker';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AddAssetAssignmentDetailsComponent } from './asset-assignment-details/add-asset-assignment-details/add-asset-assignment-details.component';
// import { EmployeeDropdownComponent } from './add-asset-assignment/employee-dropdown/employee-dropdown.component';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core'; // For options in mat-select
import { MatAutocompleteModule } from '@angular/material/autocomplete'; // For autocomplete
import { MatListModule } from '@angular/material/list';



@NgModule({
  declarations: [
    AssetAssignmentComponent,
    AssetAssignmentDetailsComponent,
    AddAssetAssignmentComponent,
    AddAssetAssignmentDetailsComponent
    // EmployeeDropdownComponent
  ],
  imports: [
    CommonModule,
    AssetAssignmentRoutingModule,
    NgxPaginationModule,
    BsDatepickerModule.forRoot(),
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatOptionModule,
    MatAutocompleteModule,
    MatListModule,
  ]
})
export class AssetAssignmentModule { }
