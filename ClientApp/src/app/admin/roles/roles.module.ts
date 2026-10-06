import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
//pagination module
import { NgxPaginationModule } from 'ngx-pagination';
// routing module
import { RolesRoutingModule } from './roles-routing.module';
// shared module
import { SharedModule } from 'src/app/shared/shared.module';
// Roles component
import { RolesComponent } from '../roles/roles.component';
import { AddEditRolesComponent } from '../roles/add-edit-roles/add-edit-roles.component';
import { RoleSectionComponent } from '../roles/role-section/role-section.component';


@NgModule({
  declarations: [
    RolesComponent,
    AddEditRolesComponent,
    RoleSectionComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RolesRoutingModule,
    SharedModule,
    NgxPaginationModule
  ]
})
export class RolesModule { }
