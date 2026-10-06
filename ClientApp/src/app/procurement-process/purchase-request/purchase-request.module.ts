import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select'; // Import NgSelectModule
//pagination module
import { NgxPaginationModule } from 'ngx-pagination';
//date picker
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BsDatepickerModule, BsDatepickerConfig  } from 'ngx-bootstrap/datepicker';
// shared module
import { SharedModule } from 'src/app/shared/shared.module';
import {PurchaseRequestRoutingModule} from './purchase-request-routing.module';
import {PurchaseRequestComponent} from './purchase-request.component';
import {AddPurchaseRequestComponent} from './add-purchase-request/add-purchase-request.component';
import {MatTabsModule} from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PrpoDetailsComponent } from './prpo-details/prpo-details.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';


@NgModule({
    declarations: [
        PurchaseRequestComponent,
        AddPurchaseRequestComponent,
        PrpoDetailsComponent,
    ],
    imports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      SharedModule,
      PurchaseRequestRoutingModule,
      BsDatepickerModule.forRoot(),
      NgxPaginationModule,
      NgbModule,
      NgSelectModule,
      MatTabsModule,
      MatFormFieldModule,
      MatTooltipModule,
      MatIconModule,
      MatButtonModule
    ],
    providers: [DatePipe, BsDatepickerConfig],
    exports: [
      AddPurchaseRequestComponent]
  })
export class PurchaseRequestModule{}