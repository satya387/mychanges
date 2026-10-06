import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
//pagination module
import { NgxPaginationModule } from 'ngx-pagination';
// third party packages
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
// User routing module
import { UsersRoutingModule } from './users-routing.module';
// Shared module
import { SharedModule } from 'src/app/shared/shared.module';
// User components
import { UserRoleSectionComponent } from './user-role-section/user-role-section.component';
import { UsersComponent } from './users.component';
import { UserRoleComponent } from './user-role-section/user-role/user-role.component';
import { UserTileComponent } from './user-role-section/user-tile/user-tile.component';


@NgModule({
  declarations: [
    UsersComponent,
    UserRoleSectionComponent,
    UserRoleComponent,
    UserTileComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgxPaginationModule,
    NgbModule,
    SharedModule,
    UsersRoutingModule
  ]
})
export class UsersModule { }
