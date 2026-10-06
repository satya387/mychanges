import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//pagination module
import { NgxPaginationModule } from 'ngx-pagination';
//date picker
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BsDatepickerModule, BsDatepickerConfig  } from 'ngx-bootstrap/datepicker';
// shared module
import { SharedModule } from 'src/app/shared/shared.module';
import { CustomerSatisfactionScoreRoutingModule } from './customer-satisfaction-score-routing.module';
import { CustomerSatisfactionScoreComponent } from './customer-satisfaction-score.component';
import { MatDialogModule } from '@angular/material/dialog';
import { UploadCustomerSatisfactionScoreComponent } from './upload-customer-satisfaction-score/upload-customer-satisfaction-score.component';
import { ViewDetailsComponent } from './view-details/view-details.component';
import { AddClientRespondentDetailsComponent } from './add-client-respondent-details/add-client-respondent-details.component';
import { DownloadTemplateComponent } from './download-template/download-template.component';
import { ViewRespondentComponent } from './view-respondent/view-respondent.component';

@NgModule({
  declarations: [
    CustomerSatisfactionScoreComponent,
    UploadCustomerSatisfactionScoreComponent,
    ViewDetailsComponent,
    AddClientRespondentDetailsComponent,
    DownloadTemplateComponent,
    ViewRespondentComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CustomerSatisfactionScoreRoutingModule,
    MatDialogModule,
    BsDatepickerModule.forRoot(),
    SharedModule,
    NgxPaginationModule,
    NgbModule,
  ],
  providers: [DatePipe, BsDatepickerConfig],
  exports: []
})
export class CustomerSatisfactionScoreModule { }
