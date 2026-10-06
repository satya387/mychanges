import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { AddEditContentComponent } from './add-edit-content/add-edit-content.component';
import { ContentComponent } from './content.component';

const routes: Routes = [
  {
    path: 'content',
    pathMatch: 'full',
    component: ContentComponent,
    canActivate: [MsalGuard]
  }, {
    path: 'add-content',
    component: AddEditContentComponent,
    canActivate: [MsalGuard]
  }, {
    path: 'edit-content',
    component: AddEditContentComponent,
    canActivate: [MsalGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContentRoutingModule { }
