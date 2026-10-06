import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { AddEditSectionComponent } from './add-edit-section/add-edit-section.component';
import { SectionTileComponent } from './section-tile/section-tile.component';
import { SectionComponent } from './section.component';

const routes: Routes = [
  {
    path: 'section',
    pathMatch: 'full',
    component: SectionComponent,
    canActivate: [MsalGuard]
  }, {
    path: 'add-section',
    component: AddEditSectionComponent,
    canActivate: [MsalGuard]
  }, {
    path: 'edit-section',
    component: AddEditSectionComponent,
    canActivate: [MsalGuard]
  }, {
    path: 'section-tile',
    component: SectionTileComponent,
    canActivate: [MsalGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SectionRoutingModule { }
