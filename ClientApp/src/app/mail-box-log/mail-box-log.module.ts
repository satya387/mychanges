import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmailListComponent } from './email-list/email-list.component';
import { MailBoxLogRoutingModule } from './mail-box-log-routing.module';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { EmailDetailsComponent } from './email-details/email-details.component';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule } from '@angular/material/paginator';



@NgModule({
  declarations: [
    EmailListComponent,
    EmailDetailsComponent
  ],
  imports: [
    CommonModule,
    MailBoxLogRoutingModule,
    MatListModule,
    MatCardModule,
    MatExpansionModule,
    MatTooltipModule,
    MatTableModule,
    MatPaginatorModule
  ]
})
export class MailBoxLogModule { }
