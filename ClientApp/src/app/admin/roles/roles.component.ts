import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { findIndex } from 'lodash';
// For Confirmation Popup
import { ConfirmationPopupService } from 'src/app/shared/confirmation-popup/confirmation-popup.service';

import { ToastService } from '../../common/toast/toast.service';
import { RolesService } from './roles.service';
import { SectionService } from '../section/section.service';

// settings for pagination
import { Pagination_Items_Per_Page, settings } from '../../common/configuration.settings';
@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit {

  rolesList: any;
  totalRecord: any;
  roleValue: any;
  publishedDate: any;
  publishedBy: any;
  // limit = PageSize;
  // offset = PageNumber;
  limit: any = settings.limit;
  offset: any = settings.offset;
  designation: any = settings.roleName;
  page: any = 1;
  itemsPerPageList = Pagination_Items_Per_Page;
  requestBody: any;
  tableSizes: any = [5, 10, 15, 20];
  filterArray: any = [];
  isPageChanged: boolean;
  globalField: any;
  globalValue: any;

  constructor(private router: Router, private roleService: RolesService, private sectionService: SectionService,
    private toastService: ToastService, private modalService: ConfirmationPopupService) {
    this.isPageChanged = false;
  }

  ngOnInit(): void {
    this.configureRequest();
  }

  navigateTo() {
    this.router.navigate(['add-role'], { queryParams: { isAdd: true } });
  }

  configureRequest(field?, direction?, value?) {
    this.globalField = field;
    this.globalValue = value;
    if (field == 'createdDate') {
      if (value) {
        let date = this.validatedate(value);
        if (!date) {
          this.toastService.showError('Enter valid date format', 'Error');
          return;
        }
      }
    }
    if (field && value) {
      const index = findIndex(this.filterArray, { Field: field });
      if (index >= 0) {
        this.filterArray.splice(index, 1);
      }
      this.filterArray.push({
        "Field": field || "",
        "Operator": "eq",
        "Value": value || ""
      });
    } else if (field && !value) {
      const index = findIndex(this.filterArray, { Field: field });
      this.filterArray.splice(index, 1)
    } else {
      this.filterArray = [];
    }
    // this.requestBody.PageNumber = this.filterArray.length ? 1 : this.offset;
    this.requestBody = {
      "Filter": this.filterArray,
      "PageNumber": this.isPageChanged ? this.offset : this.filterArray.length ? 1 : this.offset,
      "PageSize": this.limit,
      "Sort": {
        "Dir": direction || 'asc',
        "Field": field || ""
      }
    }
    this.page = this.isPageChanged ? this.offset : this.filterArray.length ? 1 : this.offset;
    this.offset = this.isPageChanged ? this.offset : 1;
    this.getRolesList();
  }

  getRolesList() {
    this.roleService.getRolesList(this.requestBody).subscribe((response: any) => {
      if (response) {
        this.rolesList = response.roles || [];
        this.totalRecord = response.totalCount;
        this.isPageChanged = false;
      }
    }, (error: any) => {
      this.toastService.showError(error, 'Error');
    });
    this.filterArray = [];
  }

  redirectToRoleSection(data) {
    if (data.modulesAssigned > 0) {
      const object = this.declaringRoleObject(data);
      this.router.navigate(['/role-section'], { queryParams: { data: JSON.stringify(object) } });
    } else {
      this.gotoEdit(data);
    }
  }

  declaringRoleObject(data) {
    const object = {
      roleId: data.roleId,
      roleName: data.roleName,
    }
    return object;
  }

  onTableDataChange(event: any) {
    this.offset = event;
    this.page = this.offset;
    this.isPageChanged = this.page === 1 ? false : true;
    this.configureRequest(this.globalField, undefined, this.globalValue);
  }

  onTableSizeChange(event: any): void {
    this.limit = event;
    this.offset = 1;
    this.page = this.offset;
    this.isPageChanged = this.page === 1 ? false : true;
    this.configureRequest();
  }

  gotoEdit(item) {
    const roleDetails = this.declaringRoleObject(item);
    this.router.navigate(['/edit-role'], { queryParams: { isAdd: false, data: JSON.stringify(roleDetails) } });
  }

  deleteRole(data) {
    const roleName = data.roleName[0].toUpperCase() + data.roleName.substr(1).toLowerCase();
    if (roleName === this.designation) {
      this.toastService.showWarning('Admin role cannot be deleted!', 'Alert');
      return;
    } else {
      this.modalService.confirm('Delete Role', 'Are you sure you want to delete role?')
        .then((confirmed) =>
          this.confirmDeleteRole(data, confirmed)
        ).catch();
    }
  }

  confirmDeleteRole(data, confirmed) {
    if (confirmed) {
      const object = {
        "RoleId": data.roleId
      };
      this.roleService.deleteRole(object).subscribe((response: any) => {
        if (response.data) {
          this.toastService.showSuccess(response.message, 'Success');
          this.configureRequest();
        }
      }, (error: any) => {
        this.toastService.showError(error, 'Error');
      });
    }
  }

  validatedate(dateString) {
    // let dateformat = /^(0?[1-9]|[1-2][0-9]|3[01])[\/](0?[1-9]|1[0-2])[\/]\d{4}$/;
    let dateformat = /^(0?[1-9]|1[0-2])[\/](0?[1-9]|[1-2][0-9]|3[01])[\/]\d{4}$/;

    // Match the date format through regular expression
    if (dateString.match(dateformat)) {
      let operator = dateString.split('/');

      // Extract the string into month, date and year
      let datepart = [];
      if (operator.length > 1) {
        datepart = dateString.split('/');
      }
      else return false;
      let month = parseInt(datepart[0]);
      let day = parseInt(datepart[1]);
      let year = parseInt(datepart[2]);

      // Create list of days of a month
      let ListofDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
      if (month == 1 || month <= 12) {
        if (day > ListofDays[month - 1]) {
          ///This check is for Confirming that the date is not out of its range
          return false;
        }
      } else if (month == 2) {
        let leapYear = false;
        if ((!(year % 4) && year % 100) || !(year % 400)) {
          leapYear = true;
        }
        if ((leapYear == false) && (day >= 29)) {
          return false;
        } else
          if ((leapYear == true) && (day > 29)) {
            return false;
          }
      }
      else if (month > 12) {
        return false;
      }
    } else {
      return false;
    }
    return true;
  }

}
