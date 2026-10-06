import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';


import { RolesModule } from './roles/roles.module';
import { AdminRoutingModule } from './admin-routing.module';
import { TilesModule } from './tiles/tiles.module';
import { AssignModule } from './assign/assign.module';
import { ContentModule } from './content/content.module';
import { DefaultSectionModule } from './default-section/default-section.module';
import { SectionModule } from './section/section.module';
import { UsersModule } from './users/users.module';
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    CKEditorModule,
    AdminRoutingModule,
    RouterModule,
    RolesModule,
    TilesModule,
    AssignModule,
    ContentModule,
    DefaultSectionModule,
    SectionModule,
    UsersModule
  ]
})
export class AdminModule { }
