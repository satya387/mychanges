import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
// lodash library
import { map } from 'lodash';

// Section http call
import { CommonService } from 'src/app/common/common.service';
import { SectionService } from '../../section/section.service';
import { ToastService } from 'src/app/common/toast/toast.service';
import { RolesService } from '../roles.service';
import { settings } from '../../../common/configuration.settings';

@Component({
  selector: 'app-add-edit-roles',
  templateUrl: './add-edit-roles.component.html',
  styleUrls: ['./add-edit-roles.component.scss']
})
export class AddEditRolesComponent implements OnInit {
  sectionList: any;
  placeHolderText: any;
  selectedSectionList: any;
  roleAction: any;
  isAddRole: any;
  roleId: any;
  designation: any = settings.roleName;
  minLength: any = settings.minLength;
  maxLength: any = settings.maxLength;
  addRoleForm: FormGroup;

  constructor(private sectionService: SectionService, private toastService: ToastService, private commonService: CommonService,
    private roleService: RolesService, private router: Router, private activatedRoute: ActivatedRoute, private formBuilder: FormBuilder) {
    this.placeHolderText = 'Select the Section Name from the drop down';
    this.selectedSectionList = [];
  }

  ngOnInit(): void {
    this.formInitialization();
    this.activatedRoute.queryParams.subscribe((params) => {
      this.roleAction = params.isAdd === "true" ? 'Create New ' : 'Edit ';
      this.isAddRole = params.isAdd;
      if(params.data) {
        const roleData = JSON.parse(params.data);
        this.roleId = parseInt(roleData.roleId);
        this.formInitialization(roleData);
      }
    });
    if (this.isAddRole === 'true') {
      this.getAllSections();
    } else if (this.roleId) {
      this.getAllSections();
      this.getRoleBasedSections();
    }
  }

  formInitialization(data?) {
    this.addRoleForm = this.formBuilder.group({
      roleName: [data ? data.roleName : null, [Validators.required, Validators.minLength(this.minLength), Validators.maxLength(this.maxLength)]]
    })
  }

  getAllSections() {
    this.sectionService.getAllSections().subscribe((response: any) => {
      if (response) {
        this.sectionList = response;
        this.commonService.modifyResponseObject(this.sectionList, 'moduleId', 'moduleName');
      }
    }, (error: any) => {
      this.toastService.showError(error, 'Error');
    });
  }

  getRoleBasedSections() {
    this.sectionService.getRoleBasedSection(this.roleId).subscribe((response: any) => {
      if (response) {
        this.selectedSectionList = response;
        this.commonService.modifyResponseObject(this.selectedSectionList, 'moduleId', 'moduleName');
      }
    }, (error: any) => {
      this.toastService.showError(error, 'Error');
    });
  }

  onSelectItem(data) {
    if(data) {
      this.selectedSectionList = data;
      this.addRoleForm.setErrors(null);
    } else {
      this.addRoleForm.setErrors({ 'invalid': true });
    }
  }

  createRole() {
    this.addRoleForm.controls.roleName.patchValue(this.addRoleForm.value.roleName.trim())
    if(!this.addRoleForm.value.roleName) { this.addRoleForm.setErrors({ 'invalid': true }); }
    if (this.addRoleForm.valid) {
      const object = {
        "RoleName": this.addRoleForm.value.roleName,
        "IsActive": true,
        "ModuleId": map(this.selectedSectionList, 'moduleId')
      }
      if (this.isAddRole === "true") {
        this.roleService.createRole(object).subscribe((response: any) => {
          if (response.data && !response.isError) {
            this.toastService.showSuccess(response.message, 'Success');
            this.router.navigate(['/roles']);
          } else if (response.isError) {
            this.toastService.showError(response.message, 'Error');
            return;
          }
        }, (error: any) => {
          this.toastService.showError(error, 'Error');
        });
      } else {
        object['roleId'] = this.roleId;
        this.roleService.editRole(object, this.roleId).subscribe((response: any) => {
          if (response.data && !response.isError) {
            this.toastService.showSuccess(response.message, 'Success');
            this.router.navigate(['/roles']);
          } else if (response.isError) {
            this.toastService.showError(response.message, 'Error');
            return;
          }
        }, (error: any) => {
          this.toastService.showError(error, 'Error');
        });
      }
    }
  }

  redirectTo() {
    this.router.navigate(['/assign'], { queryParams: { activeTab: 'secondTab' } });
  }

}
