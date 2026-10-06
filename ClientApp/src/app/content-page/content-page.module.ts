import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';


import { ContentPageRoutingModule } from './content-page-routing.module';
import { ContentPageComponent } from './content-page.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ContentPageComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    CKEditorModule,
    ContentPageRoutingModule
    ]
})
export class ContentPageModule { }
