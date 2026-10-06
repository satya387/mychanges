import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerValueAddRoutingModule } from './customer-value-add-routing.module';
import { CustomerValueAddComponent } from './customer-value-add.component';
import { AddCustomerValueAddComponent } from './add-customer-value-add/add-customer-value-add.component';
import { MatDialogModule } from '@angular/material/dialog'; // Import MatDialogModule
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Import these modules
import { MatTooltipModule} from '@angular/material/tooltip';
import { CurrencyPipe } from '@angular/common';

@NgModule({
  declarations: [
    CustomerValueAddComponent,
    AddCustomerValueAddComponent
  ],
  imports: [
    CommonModule,
    CustomerValueAddRoutingModule,
    MatDialogModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule ,
    FormsModule,
    ReactiveFormsModule,
    MatTooltipModule
 ],
 providers: [CurrencyPipe]
})
export class CustomerValueAddModule { }
