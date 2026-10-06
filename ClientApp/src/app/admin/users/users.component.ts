import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { findIndex } from 'lodash';

// services for API Call
import { ToastService } from 'src/app/common/toast/toast.service';
import { UsersService } from './users.service';

// settings for pagination
import { Pagination_Items_Per_Page, settings } from '../../common/configuration.settings';
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  userList: any;
  totalRecord: any;
  userName: any;
  roleSearch: any;
  publishedDate: any;
  publishedBy: any;
  // limit = PageSize;
  // offset = PageNumber;
  limit: any = settings.limit;
  offset: any = settings.offset;
  page: any = 1;
  requestBody: any;
  itemsPerPageList = Pagination_Items_Per_Page;
  tableSizes: any = Pagination_Items_Per_Page;
  filterArray: any = [];
  isPageChanged: boolean;
  globalField: any;
  globalValue: any;

  constructor(private userService: UsersService, private toastService: ToastService,
    private router: Router) {
    this.isPageChanged = false;
  }

  ngOnInit(): void {
    this.configureRequest();
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
    this.getUsersList();
  }

  getUsersList() {
    this.userService.getUsersGridData(this.requestBody).subscribe((response: any) => {
      if (response) {
        this.userList = response.data || [];
        this.totalRecord = response.totalCount;
        this.isPageChanged = false;
      }
    }, (error: any) => {
      this.toastService.showError(error, 'Error');
    });
  }

  redirectToUserRole(data, value) {
    const object = {
      userId: data.userId,
      name: data.name,
      targetTab: value
    }
    this.router.navigate(['/user-role-section'], { queryParams: { data: JSON.stringify(object) } })
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

  validatedate(dateString) {
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
