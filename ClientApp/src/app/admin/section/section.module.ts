import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//pagination module
import { NgxPaginationModule } from 'ngx-pagination';
// forms module
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// shared module
import { SharedModule } from 'src/app/shared/shared.module';

import { SectionRoutingModule } from './section-routing.module';
import { AddEditSectionComponent } from './add-edit-section/add-edit-section.component';
import { SectionTileComponent } from './section-tile/section-tile.component';
import { SectionComponent } from './section.component';


@NgModule({
  declarations: [
    SectionComponent,
    AddEditSectionComponent,
    SectionTileComponent,
    AddEditSectionComponent
  ],
  imports: [
    CommonModule,
    NgxPaginationModule,
    FormsModule,
    ReactiveFormsModule,
    SectionRoutingModule,
    SharedModule
  ]
})
export class SectionModule { }
