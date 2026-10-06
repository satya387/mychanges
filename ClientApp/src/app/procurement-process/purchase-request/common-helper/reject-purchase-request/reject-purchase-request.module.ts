import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {RejectPurchaseRequestComponent}from './reject-purchase-request.component';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';

@NgModule({
   declarations:[
       RejectPurchaseRequestComponent
   ],
   imports:[
       FormsModule,
       NgbModule,
       CommonModule
   ],
   providers:[],
   exports:[]

})

export class RejectPurchaseRequestModule {}