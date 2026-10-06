import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule} from '@angular/material/icon';
import { MatPaginatorModule} from '@angular/material/paginator';
import { MatTableModule} from '@angular/material/table';
import { PlanActualComponent } from './plan-actual.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    PlanActualComponent
  ],
  imports: [
    CommonModule,
    MatTableModule, 
    MatIconModule,
    MatPaginatorModule,
    FormsModule
  ]
})
export class PlanActualModule { }
