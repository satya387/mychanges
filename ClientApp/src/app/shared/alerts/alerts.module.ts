import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AlertsRoutingModule } from './alerts-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { AlertsComponent } from './alerts.component';
@NgModule({
  declarations: [
    AlertsComponent
  ],
  imports: [
    CommonModule,
    AlertsRoutingModule,
    BrowserModule
  ]
})
export class AlertsModule { }
