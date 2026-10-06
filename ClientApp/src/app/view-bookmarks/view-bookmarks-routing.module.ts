import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewBookmarksComponent } from './view-bookmarks.component';

const routes: Routes = [
  {
    path:'', component: ViewBookmarksComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewBookmarksRoutingModule { }
