import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { ViewAllTilesComponent } from './view-all-tiles.component';

const routes: Routes = [
  {
    path: 'view-all-tile', component: ViewAllTilesComponent,
    canActivate: [MsalGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewAllTilesRoutingModule { }
