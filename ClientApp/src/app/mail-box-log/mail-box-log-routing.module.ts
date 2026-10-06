import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmailListComponent } from './email-list/email-list.component';
import { MsalGuard } from '@azure/msal-angular';
import { EmailDetailsComponent } from './email-details/email-details.component';
import { MailBoxLogGuard } from './mail-box-log.guard';

const routes: Routes = [
  {
    path: 'email-list',
    pathMatch: 'full',
    component: EmailListComponent,
    canActivate: [MsalGuard, MailBoxLogGuard],
    loadChildren: () => import('../mail-box-log/mail-box-log.module').then((m) => m.MailBoxLogModule)
  },
  {
    path: 'email-detail/:id',
    pathMatch: 'full',
    component: EmailDetailsComponent,
    canActivate: [MsalGuard, MailBoxLogGuard],
    loadChildren: () => import('../mail-box-log/mail-box-log.module').then((m) => m.MailBoxLogModule)
  }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MailBoxLogRoutingModule { }
