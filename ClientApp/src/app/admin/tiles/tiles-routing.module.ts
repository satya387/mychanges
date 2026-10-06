import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { AddEditTilesComponent } from './add-edit-tiles/add-edit-tiles.component';
import { TilesComponent } from './tiles.component';

const routes: Routes = [
  {
    path: 'tiles',
    pathMatch: 'full',
    component: TilesComponent,
    canActivate: [MsalGuard]
  },  {
    path: 'add-tile',
    component: AddEditTilesComponent,
    canActivate: [MsalGuard]
  },  {
    path: 'edit-tile',
    component: AddEditTilesComponent,
    canActivate: [MsalGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TilesRoutingModule { }
