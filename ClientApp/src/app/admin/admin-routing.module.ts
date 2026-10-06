import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { AdminGuard } from './admin.guard';
import { AssignComponent } from './assign/assign.component';
import { ContentComponent } from './content/content.component';
import { DefaultSectionComponent } from './default-section/default-section.component';
import { RolesComponent } from './roles/roles.component';
import { SectionComponent } from './section/section.component';
import { TilesComponent } from './tiles/tiles.component';
import { UsersComponent } from './users/users.component';

const routes: Routes = [
  {
    path: 'roles',
    component: RolesComponent,
    pathMatch: 'full',
    canActivate: [MsalGuard, AdminGuard],
    loadChildren: () => import('../admin/roles/roles.module').then((m) => m.RolesModule),
  },
  {
    path: 'assign',
    pathMatch: 'full',
    component: AssignComponent,
    canActivate: [MsalGuard, AdminGuard],
    loadChildren: () => import('../admin/assign/assign.module').then((m) => m.AssignModule),
  }, {
    path: 'content',
    pathMatch: 'full',
    component: ContentComponent,
    canActivate: [MsalGuard, AdminGuard],
    loadChildren: () => import('../admin/content/content.module').then((m) => m.ContentModule),
  }, {
    path: 'default-section',
    pathMatch: 'full',
    component: DefaultSectionComponent,
    canActivate: [MsalGuard, AdminGuard],
    loadChildren: () => import('../admin/default-section/default-section.module').then((m) => m.DefaultSectionModule),
  }, {
    path: 'section',
    pathMatch: 'full',
    component: SectionComponent,
    canActivate: [MsalGuard, AdminGuard],
    loadChildren: () => import('../admin/section/section.module').then((m) => m.SectionModule),
  },
  {
    path: 'tiles',
    pathMatch: 'full',
    component: TilesComponent,
    canActivate: [MsalGuard, AdminGuard],
    loadChildren: () => import('../admin/tiles/tiles.module').then((m) => m.TilesModule),
  }, {
    path: 'users',
    pathMatch: 'full',
    component: UsersComponent,
    canActivate: [MsalGuard, AdminGuard],
    loadChildren: () => import('../admin/users/users.module').then((m) => m.UsersModule),
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
