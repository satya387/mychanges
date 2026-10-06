import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RayMainComponent } from './ray-main.component';

const routes: Routes = [{ path: '', component: RayMainComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RayMainRoutingModule { }
