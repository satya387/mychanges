import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule }
from '@ng-bootstrap/ng-bootstrap';

import { SharedModule } from '../shared/shared.module';

import { HomeRoutingModule } from './home-routing.module';
import { MsalModule } from '@azure/msal-angular';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    NgbModule,
    SharedModule,
    HomeRoutingModule,
    MsalModule
  ],
})
export class HomeModule { }
