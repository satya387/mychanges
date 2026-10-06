import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RiskIndexComponent } from './risk-index.component';
import { RiskIndexRoutingModule } from './risk-index-routing.module';
import { TabMenuModule } from 'primeng/tabmenu';
import { TabViewModule } from "primeng/tabview";
import { TableModule } from "primeng/table";
import { DropdownModule } from "primeng/dropdown";
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [ RiskIndexComponent ],
  imports: [
    CommonModule,
    RiskIndexRoutingModule,
    TabMenuModule,
    TabViewModule,
    TableModule,
    DropdownModule,
    FormsModule
]
})
export class RiskIndexModule { }
