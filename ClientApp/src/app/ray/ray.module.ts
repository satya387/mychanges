import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgxPaginationModule } from 'ngx-pagination';
import { RayRoutingModule } from './ray-routing.module';
import { RayComponent } from './ray.component';
import { MoreDetailsComponent } from './more-details/more-details.component';
import { ReferralPoliciesComponent } from './referral-policies/referral-policies.component';



@NgModule({
  declarations: [
    RayComponent,
    MoreDetailsComponent,
    ReferralPoliciesComponent,
  ],
  imports: [
    CommonModule,
    RayRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    NgxPaginationModule,
    MatTooltipModule
  ],
  exports: [
    RayComponent]
})
export class RayModule { }
