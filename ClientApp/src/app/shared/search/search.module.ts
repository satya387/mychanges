import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
//pagination module
import { NgxPaginationModule } from 'ngx-pagination';

import { SearchRoutingModule } from './search-routing.module';
import { SearchComponent } from './searchs.component';


@NgModule({
  declarations: [
    SearchComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    NgxPaginationModule,
    SearchRoutingModule
  ]
})
export class SearchModule { }
