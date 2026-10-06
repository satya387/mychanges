import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// forms module
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//pagination module
import { NgxPaginationModule } from 'ngx-pagination';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
// image drag and drop
import { NgxDropzoneModule } from 'ngx-dropzone';

import { ContentRoutingModule } from './content-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { AddEditContentComponent } from './add-edit-content/add-edit-content.component';
import { ContentComponent } from './content.component';

@NgModule({
  declarations: [
    ContentComponent,
    AddEditContentComponent
  ],
  imports: [
    CommonModule,
    ContentRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    CKEditorModule,
    NgxDropzoneModule,
    SharedModule
  ]
})
export class ContentModule { }
