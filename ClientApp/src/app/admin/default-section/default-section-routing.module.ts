import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { AddDefaultSectionComponent } from './add-default-section/add-default-section.component';
import { DefaultSectionTileComponent } from './default-section-tile/default-section-tile.component';
import { DefaultSectionComponent } from './default-section.component';

const routes: Routes = [
  {
    path: 'default-section',
    pathMatch: 'full',
    component: DefaultSectionComponent,
    canActivate: [MsalGuard],
  }, {
    path: 'add-default-section',
    component: AddDefaultSectionComponent,
    canActivate: [MsalGuard]
  }, {
    path: 'default-section-tile',
    component: DefaultSectionTileComponent,
    canActivate: [MsalGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DefaultSectionRoutingModule { }
