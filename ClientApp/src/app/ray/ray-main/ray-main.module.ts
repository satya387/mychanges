import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RayMainRoutingModule } from './ray-main-routing.module';
import { RayMainComponent } from './ray-main.component';


@NgModule({
  declarations: [
    RayMainComponent
  ],
  imports: [
    CommonModule,
    RayMainRoutingModule
  ]
})
export class RayMainModule { }
