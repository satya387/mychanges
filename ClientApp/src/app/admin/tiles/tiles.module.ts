import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';

import { TilesRoutingModule } from './tiles-routing.module';
import { TilesComponent } from './tiles.component';
import { AddEditTilesComponent } from './add-edit-tiles/add-edit-tiles.component';


@NgModule({
  declarations: [
    TilesComponent,
    AddEditTilesComponent
  ],
  imports: [
    CommonModule,
    NgxPaginationModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    TilesRoutingModule
  ]
})
export class TilesModule { }
