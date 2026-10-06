import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewBookmarksRoutingModule } from './view-bookmarks-routing.module';
import { ViewBookmarksComponent } from './view-bookmarks.component';


@NgModule({
  declarations: [
    ViewBookmarksComponent
  ],
  imports: [
    CommonModule,
    ViewBookmarksRoutingModule
  ]
})
export class ViewBookmarksModule { }
