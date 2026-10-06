import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AssignRoutingModule } from './assign-routing.module';

import { AssignComponent } from './assign.component';


@NgModule({
  declarations: [
    AssignComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    AssignRoutingModule
  ]
})
export class AssignModule { }
