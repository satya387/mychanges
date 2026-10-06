import { Component, OnInit } from '@angular/core';
import { map, find, filter } from 'lodash';
import { SpinnerVisibilityService } from 'ng-http-loader';
import { FormGroup, FormBuilder } from '@angular/forms';

import { ToastService } from 'src/app/common/toast/toast.service';
import { RolesService } from '../roles/roles.service';
import { CommonService } from 'src/app/common/common.service';
import { SectionService } from '../section/section.service';
import { TilesService } from '../tiles/tiles.service';
import { UsersService } from '../users/users.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-assign',
  templateUrl: './assign.component.html',
  styleUrls: ['./assign.component.scss']
})
export class AssignComponent implements OnInit {

  rolesList: any;
  selectedTab: any;
  sectionPlaceHolderText: any;
  sectionList: any;
  selectedSectionList: any;
  selectedRole: any;
  tilesList: any;
  tilesPlaceHolderText: string;
  rolesPlaceHolderText: string;
  selectedTilesList: any;
  selectedRolesList: any;
  selectedSection: any;
  usersList: any;
  selectedUser: any;
  isRoleSectionSelected: any;
  isTileSectionSelected: any;
  isRoleUserSelected: any;
  isSectionUserSelected: any;
  isFromUserTab: any;
  assignForm: FormGroup;

  constructor(private toastService: ToastService, private commonService: CommonService, private sectionService: SectionService, private router: Router,
    private roleService: RolesService, private tileService: TilesService, private userService: UsersService, private activatedRoute: ActivatedRoute,
    private spinner: SpinnerVisibilityService, private formBuilder: FormBuilder) {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.selectedTab = params.activeTab ? params.activeTab : "firstTab";
      this.isFromUserTab = params.fromUser;
    });
    this.sectionPlaceHolderText = "Select the Section Name from the drop down";
    this.tilesPlaceHolderText = "Select the Tile Name from the drop down";
    this.rolesPlaceHolderText = "Select the Role Name from the drop down";
  }

  ngOnInit(): void {
    this.formInitialization();
    this.requiredAPIsForAssign(this.selectedTab);
  }

  formInitialization() {
    this.assignForm = this.formBuilder.group({
      roleSection: null,
      tileSection: null,
      roleUser: null,
      sectionUser: null
    })
  }

  requiredAPIsForAssign(index) {
    switch (index) {
      case 'firstTab':
        this.getAllRoles();
        this.getAllSections();
        break;
      case 'secondTab':
        this.getAllSections();
        this.getAllTiles();
        break;
      case 'thirdTab':
        this.getAllUsers();
        this.getAllRoles();
        break;
      case 'fourthTab':
        this.getAllUsers();
        break;
    }
  }

  //To get all roles without pagination
  getAllRoles() {
    this.roleService.getRolesWithoutPagination().subscribe((response: any) => {
      if (response) {
        this.rolesList = filter(response, { 'isActive': true }) || [];
        this.selectedSectionList = [];
        this.commonService.modifyResponseObject(this.rolesList, 'roleId', 'roleName');
      }
    }, (error: any) => {
      this.toastService.showError(error, 'Error');
    });
  }

  // get sections by role id
  onSelectRole(event) {
    if (event.target.value !== 'null') {
      const roleId = parseInt(event.target.value);
      this.getSectionsByRole(roleId);
    } else {
      this.selectedSectionList = [];
    }
  }

  getSectionsByRole(roleId) {
    this.sectionService.getRoleBasedSection(roleId).subscribe((response: any) => {
      if (response) {
        this.selectedSectionList = response;
        this.selectedRole = find(this.rolesList, { 'roleId': roleId });
        this.commonService.modifyResponseObject(this.selectedSectionList, 'moduleId', 'moduleName');
        // this.sectionService.setSelectedRole(true);
      }
    }, (error: any) => {
      this.toastService.showError(error, 'Error');
    });
  }

  // get all sections
  getAllSections() {
    this.sectionService.getAllSections().subscribe((response: any) => {
      if (response) {
        this.sectionList = filter(response, { 'isActive': true });
        // this.sectionList = response;
        this.commonService.modifyResponseObject(this.sectionList, 'moduleId', 'moduleName');
        this.selectedTilesList = [];
        // if (this.selectedTab === 'secondTab') {
        //   this.getTilesBySection(this.sectionList[0].moduleId);
        // }
      }
    }, (error: any) => {
      this.toastService.showError(error, 'Error');
    });
  }

  validateFields(assignTo, selectedList, value, assignToValue) {
    if (selectedList?.length === 0) {
      this.toastService.showWarning('Please select ' + value + ' from the list!', 'Alert');
      return false;
    } else if (!assignTo) {
      this.toastService.showWarning('Please select ' + assignToValue, 'Alert');
      return false;
    } else return true;
  }

  onSelectItem(data) {
    this.selectedSectionList = data;
  }

  // Save functionality
  saveSectionsToRole() {
    const checkValidation = this.validateFields(this.selectedRole, this.selectedSectionList, 'section', 'Role');
    if (checkValidation) {
      const object = {
        "roleId": this.selectedRole.roleId,
        "RoleName": this.selectedRole.roleName,
        "IsActive": true,
        "ModuleId": map(this.selectedSectionList, 'moduleId')
      }
      this.roleService.editRole(object, this.selectedRole.roleId).subscribe((response: any) => {
        if (response.data && !response.isError) {
          this.toastService.showSuccess(response.message, 'Success');
        } else if (response.isError) {
          this.toastService.showError(response.message, 'Error');
          return;
        }
      }, (error: any) => {
        this.toastService.showError(error, 'Error');
      });
    }
  }

  // get all tiles
  getAllTiles() {
    this.tileService.getTilesList().subscribe((response: any) => {
      if (response) {
        // this.tilesList = response;
        this.tilesList = filter(response, { 'isActive': true });
        this.commonService.modifyResponseObject(this.tilesList, 'tileId', 'name');
      }
    }, (error: any) => {
      this.toastService.showError(error, 'Error');
    });
  }

  getTilesBySection(sectionId) {
    this.tileService.getTilesBySectionId(sectionId).subscribe((response: any) => {
      if (response) {
        this.selectedTilesList = response;
        this.selectedSection = find(this.sectionList, { 'moduleId': sectionId });
        this.commonService.modifyResponseObject(this.selectedTilesList, 'tileId', 'name');
      }
    }, (error: any) => {
      this.toastService.showError(error, 'Error');
    });
  }

  onSelectSection(event) {
    if (event.target.value !== 'null') {
      const sectionId = parseInt(event.target.value);
      this.getTilesBySection(sectionId);
    } else {
      this.selectedTilesList = [];
    }
  }

  saveTilesToSection() {
    const checkValidation = this.validateFields(this.selectedSection, this.selectedTilesList, 'tile', 'Section');
    if (checkValidation) {
      const object = {
        "ModuleId": this.selectedSection.moduleId,
        "tileId": map(this.selectedTilesList, 'tileId')
      }
      this.sectionService.assignTilesToSection(object).subscribe((response: any) => {
        if (response.data && !response.isError) {
          this.toastService.showSuccess(response.message, 'Success');
        } else if (response.isError) {
          this.toastService.showError(response.message, 'Error');
          return;
        }
      }, (error: any) => {
        this.toastService.showError(error, 'Error');
      });
    }
  }

  // getUsersList
  getAllUsers() {
    this.userService.getUsersList().subscribe((response: any) => {
      if (response) {
        this.usersList = response;
        if (this.selectedTab === 'thirdTab') {
          this.selectedRolesList = [];
          // this.getUserMappedRoles(this.usersList[0].userId);
        } else if (this.selectedTab === 'fourthTab') {
          this.selectedSectionList = [];
          // this.getMappedSectionsByUser(this.usersList[0].userId);
        }
      }
    }, (error: any) => {
      this.toastService.showError(error, 'Error');
    });
  }

  // To get Mapped Roles
  getUserMappedRoles(userId) {
    this.roleService.getUserRoles(userId).subscribe((response: any) => {
      if (response) {
        this.selectedRolesList = response || [];
        this.selectedUser = find(this.usersList, { 'userId': userId });
        this.commonService.modifyResponseObject(this.selectedRolesList, 'roleId', 'roleName');
      }
    }, (error: any) => {
      this.toastService.showError(error, 'Error');
    });
  }

  onSelectUser(event) {
    if (event.target.value !== 'null') {
      const userId = parseInt(event.target.value);
      if (this.selectedTab === 'thirdTab') {
        this.getSectionsByRole(userId);
        this.getUserMappedRoles(userId);
      } else if (this.selectedTab === 'fourthTab') {
        this.getMappedSectionsByUser(userId);
      }
    } else {
      if (this.selectedTab === 'thirdTab') {
        this.selectedRolesList = [];
      } else {
        this.selectedSectionList = [];
      }
    }
  }

  saveRolesToUser() {
    const checkValidation = this.validateFields(this.selectedUser, this.selectedRolesList, 'role', 'User');
    if (checkValidation) {
      const object = {
        "UserId": this.selectedUser.userId,
        "Roles": map(this.selectedRolesList, 'roleId')
      }
      this.userService.saveRolesToUser(object).subscribe((response: any) => {
        if (response.data && !response.isError) {
          this.toastService.showSuccess(response.message, 'Success');
        } else if (response.isError) {
          this.toastService.showError(response.message, 'Error');
          return;
        }
      }, (error: any) => {
        this.toastService.showError(error, 'Error');
      });
    }
  }

  // get mapped sections & tiles by the user
  getMappedSectionsByUser(userId) {
    this.sectionService.getUserModulesTiles(userId).subscribe((response: any) => {
      if (response) {
        this.selectedSectionList = response;
        this.selectedUser = find(this.usersList, { 'userId': userId });
        this.commonService.modifyResponseObject(this.selectedTilesList, 'moduleId', 'moduleName');
      }
    }, (error: any) => {
      this.toastService.showError(error, 'Error');
    });
  }

  saveSectionToUser() {
    const checkValidation = this.validateFields(this.selectedUser, this.selectedSectionList, 'section', 'User');
    if (checkValidation) {
      const object = {
        "UserId": this.selectedUser.userId,
        "Sections": map(this.selectedSectionList, 'moduleId')
      }
      this.userService.saveSectionsToUser(object).subscribe((response: any) => {
        if (response.data && !response.isError) {
          this.toastService.showSuccess(response.message, 'Success');
        } else if (response.isError) {
          this.toastService.showError(response.message, 'Error');
          return;
        }
      }, (error: any) => {
        this.toastService.showError(error, 'Error');
      });
    }
  }

  cancelRedirect(param) {
    const routePath = param && this.isFromUserTab ? '/users' : '/assign';
    this.spinner.show();
    setTimeout(() => {
      this.resetValues(this.selectedTab);
      this.router.navigate([routePath]);
      this.spinner.hide();
    }, 200);
  }

  resetValues(index) {
    switch (index) {
      case 'firstTab':
        this.assignForm.controls['roleSection'].reset();
        this.selectedSectionList = [];
        break;
      case 'secondTab':
        this.assignForm.controls['tileSection'].reset();
        this.selectedTilesList = [];
        break;
      case 'thirdTab':
        this.assignForm.controls['roleUser'].reset();
        this.selectedRolesList = [];
        break;
      case 'fourthTab':
        this.assignForm.controls['sectionUser'].reset();
        this.selectedSectionList = [];
        break;
    }
  }

}
