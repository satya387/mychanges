import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { ContentPageComponent } from './content-page.component';

const routes: Routes = [
  {
    path: '', component: ContentPageComponent,
    canActivate: [MsalGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContentPageRoutingModule { }
