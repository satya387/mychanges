import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RayComponent } from './ray.component';
import { MsalGuard } from '@azure/msal-angular';

const routes: Routes = [
  {
    path: '',
    component: RayComponent,
    canActivate: [MsalGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RayRoutingModule { }
