import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// third party packages
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
// image drag and drop
import { NgxDropzoneModule } from 'ngx-dropzone';

// shared components
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { TileComponent } from './tile/tile.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AssignControlComponent } from './assign-control/assign-control.component';
import { BackButtonComponent } from './back-button/back-button.component';
import { ConfirmationPopupComponent } from './confirmation-popup/confirmation-popup.component';
import { ImageUploadComponent } from './image-upload/image-upload.component';
import { UserSectionComponent } from './user-section/user-section.component';
import { FilterPipe } from './pipe/filter.pipe';
import { UnauthorizedAccessPageComponent } from './unauthorized-access-page/unauthorized-access-page.component';
import { IronCladHeaderComponent } from './iron-clad-header/iron-clad-header.component';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    TileComponent,
    PageNotFoundComponent,
    AssignControlComponent,
    BackButtonComponent,
    ConfirmationPopupComponent,
    ImageUploadComponent,
    UserSectionComponent,
    FilterPipe,
    UnauthorizedAccessPageComponent,
    IronCladHeaderComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    NgbModule,
    NgxDropzoneModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    TileComponent,
    BackButtonComponent,
    AssignControlComponent,
    ImageUploadComponent,
    UserSectionComponent,
    FilterPipe,
    IronCladHeaderComponent
  ],
  entryComponents: [
    ConfirmationPopupComponent
  ]
})
export class SharedModule { }
