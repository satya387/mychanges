import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreatedProjectComponent } from './created-project.component';
import { MsalGuard } from '@azure/msal-angular';
import { OpportunityGuard } from '../opportunity.guard';
const routes: Routes = [
  {
    path: '',
    component: CreatedProjectComponent,
    canActivate: [MsalGuard,OpportunityGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreatedProjectRoutingModule { }
