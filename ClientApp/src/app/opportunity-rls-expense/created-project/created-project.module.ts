import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
//pagination module
import { NgxPaginationModule } from 'ngx-pagination';
import { CreatedProjectRoutingModule } from './created-project-routing.module';
import { CreatedProjectComponent } from './created-project.component';


@NgModule({
  declarations: [
    CreatedProjectComponent
  ],
  imports: [
    CommonModule,
    CreatedProjectRoutingModule,
    NgxPaginationModule,
    NgSelectModule
  ]
})
export class CreatedProjectModule { }
