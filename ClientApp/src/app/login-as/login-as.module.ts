import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginAsComponent } from './login-as.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import * as _moment from 'moment';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../shared/shared.module';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core'; // For options in mat-select
import { MatAutocompleteModule } from '@angular/material/autocomplete'; // For autocomplete
import { MatListModule } from '@angular/material/list';
import { LoginAsRoutingModule } from './login-as-routing.module';


@NgModule({
  declarations: [
    LoginAsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    NgbModule,
    SharedModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatOptionModule,
    MatAutocompleteModule,
    MatListModule,
    LoginAsRoutingModule
  ]
})
export class LoginAsModule { }
