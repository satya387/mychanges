import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'lodash';

import { ToastService } from 'src/app/common/toast/toast.service';
import { RolesService } from '../../../roles/roles.service';
import { UsersService } from '../../users.service';
import { CommonService } from 'src/app/common/common.service';

@Component({
  selector: 'app-user-role',
  templateUrl: './user-role.component.html',
  styleUrls: ['./user-role.component.scss']
})
export class UserRoleComponent implements OnInit {

  rolesList: any;
  selectedRolesList: any;
  rolePlaceHolderText: any;
  userName: any;
  userId: any;
  isRoleSelected: boolean;

  constructor(private toastService: ToastService, private userService: UsersService, private router: Router,
    private commonService: CommonService, private roleService: RolesService, private activatedRoute: ActivatedRoute) {

    this.rolePlaceHolderText = "Select the Role Name from the drop down";
    this.selectedRolesList = [];
    this.isRoleSelected = false;
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      const userData = JSON.parse(params.data);
      this.userName = userData.name;
      this.userId = userData.userId;
    });
    this.getMappedRoles();
    this.getAllRoles();
  }

  // To get Mapped Roles
  getMappedRoles() {
    this.roleService.getUserRoles(this.userId).subscribe((response: any) => {
      if (response) {
        this.selectedRolesList = response || [];
        this.commonService.modifyResponseObject(this.selectedRolesList, 'roleId', 'roleName');
      }
    }, (error: any) => {
      this.toastService.showError(error, 'Error');
    });
  }

  //To get all roles without pagination
  getAllRoles() {
    this.roleService.getRolesWithoutPagination().subscribe((response: any) => {
      if (response) {
        this.rolesList = response || [];
        this.commonService.modifyResponseObject(this.rolesList, 'roleId', 'roleName');
      }
    }, (error: any) => {
      this.toastService.showError(error, 'Error');
    });
  }

  // assign roles to user
  saveRole() {
    const object = {
      "UserId": this.userId,
      "Roles": map(this.selectedRolesList, 'roleId')
    }
    this.userService.saveRolesToUser(object).subscribe((response: any) => {
      if (response) {
        // this.toastService.showSuccess(response.message, 'Success');
        this.toastService.showSuccess('Roles mapped to the user!', 'Success');
        this.router.navigate(['/users']);
      }
    }, (error: any) => {
      this.toastService.showError(error, 'Error');
    });
  }

  onSelectItem(data) {
    if(data) {
      this.selectedRolesList = data;
      this.isRoleSelected = true;
    } else {
      this.isRoleSelected = false;
    }
  }

  redirectTo() {
    this.router.navigate(['/assign'], { queryParams: { activeTab: 'firstTab', fromUser: true } });
  }

}
