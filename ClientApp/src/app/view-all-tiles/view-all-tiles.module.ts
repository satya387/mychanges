import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ViewAllTilesRoutingModule } from './view-all-tiles-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ViewAllTilesComponent } from './view-all-tiles.component';


@NgModule({
  declarations: [
    ViewAllTilesComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    ViewAllTilesRoutingModule
  ]
})
export class ViewAllTilesModule { }
