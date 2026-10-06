import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule }
from '@ng-bootstrap/ng-bootstrap';
//pagination module
import { NgxPaginationModule } from 'ngx-pagination';
// forms Module
import { FormsModule } from '@angular/forms';

import { SharedModule } from 'src/app/shared/shared.module';

import { DefaultSectionRoutingModule } from './default-section-routing.module';
import { AddDefaultSectionComponent } from './add-default-section/add-default-section.component';
import { DefaultSectionTileComponent } from './default-section-tile/default-section-tile.component';
import { DefaultSectionComponent } from './default-section.component';


@NgModule({
  declarations: [
    DefaultSectionComponent,
    DefaultSectionTileComponent,
    AddDefaultSectionComponent
  ],
  imports: [
    CommonModule,
    DefaultSectionRoutingModule,
    NgbModule,
    NgxPaginationModule,
    FormsModule,
    SharedModule
  ]
})
export class DefaultSectionModule { }
