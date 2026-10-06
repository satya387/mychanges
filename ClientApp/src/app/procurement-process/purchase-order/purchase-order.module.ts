import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PurchaseOrderRoutingModule } from './purchase-order-routing.module';
import { PurchaseOrderComponent } from './purchase-order.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AddPurchaseOrderComponent } from '../add-purchase-order/add-purchase-order.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RejectpoComponent } from '../add-purchase-order/rejectpo/rejectpo.component';
import {MatTabsModule} from '@angular/material/tabs';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import {PoTermsconditionsComponent} from '../add-purchase-order/po-termsconditions/po-termsconditions.component'



@NgModule({
  declarations: [
    PurchaseOrderComponent,
    AddPurchaseOrderComponent,
    PoTermsconditionsComponent
  ],
  imports: [
    CommonModule,
    PurchaseOrderRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    NgxPaginationModule,
    MatTooltipModule,
    MatFormFieldModule,
    BsDatepickerModule.forRoot(),
    MatTabsModule
  ],
  exports: [
    PurchaseOrderComponent]
})
export class PurchaseOrderModule { }
