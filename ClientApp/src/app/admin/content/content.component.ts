import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { findIndex } from 'lodash';

import { ToastService } from 'src/app/common/toast/toast.service';
// settings for pagination
import { Pagination_Items_Per_Page, settings } from '../../common/configuration.settings';
// For Confirmation Popup
import { ConfirmationPopupService } from 'src/app/shared/confirmation-popup/confirmation-popup.service';
import { ContentService } from './content.service';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit {

  contentList: any;
  limit: any = settings.limit;
  offset: any = settings.offset;
  page: any = 1;
  itemsPerPageList = Pagination_Items_Per_Page;
  requestBody: any;
  tableSizes: any = [5, 10, 15, 20];
  filterArray: any = [];
  totalRecord: any;
  contentName: any;
  publishedDate: any;
  publishedBy: any;
  isPageChanged: boolean;

  constructor(private toastService: ToastService, private modalService: ConfirmationPopupService,
    private contentService: ContentService, private router: Router) {
    this.isPageChanged = false;
  }

  ngOnInit(): void {
    this.configureRequest();
  }

  configureRequest(field?, direction?, value?) {
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
    this.getAllContents();
  }

  // get all contents
  getAllContents() {
    this.contentService.getAllContents(this.requestBody).subscribe((response: any) => {
      if (response) {
        this.contentList = response.data || [];
        this.totalRecord = response.totalCount;
        this.isPageChanged = false;
      }
    }, (error: any) => {
      this.toastService.showError(error, 'Error');
    });
  }

  gotoEdit(item) {
    const contentDetails = this.declaringContentObject(item);
    this.router.navigate(['/edit-content'], { queryParams: { isAdd: false, data: JSON.stringify(contentDetails) } });
  }

  navigateTo() {
    this.router.navigate(['/add-content'], { queryParams: { isAdd: true } });
  }

  declaringContentObject(data) {
    const object = {
      contentId: data.contentId,
      name: data.name,
    }
    return object;
  }

  onTableDataChange(event: any) {
    this.offset = event;
    this.page = this.offset;
    this.isPageChanged = this.page === 1 ? false : true;
    this.configureRequest();
  }

  onTableSizeChange(event: any): void {
    this.limit = event;
    this.offset = 1;
    this.page = this.offset;
    this.isPageChanged = this.page === 1 ? false : true;
    this.configureRequest();
  }


  deleteContent(data) {
    this.modalService.confirm('Delete Content', 'Are you sure you want to delete content?')
      .then((confirmed) =>
        this.confirmDeleteContent(data, confirmed)
      ).catch();
  }

  confirmDeleteContent(data, confirmed) {
    if (confirmed) {
      const object = {
        "ContentId": data.contentId
      };
      this.contentService.deleteContent(object).subscribe((response: any) => {
        if (response.data) {
          this.toastService.showSuccess(response.message, 'Success');
          this.configureRequest();
        }
      }, (error: any) => {
        this.toastService.showError(error, 'Error');
      });
    }
  }

  statusToggle(data) {
    const object = {
      "ContentId": data.contentId,
      "isActive": data.status ? false : true,
    };
    this.contentService.changeContentStatus(object).subscribe((response: any) => {
      if (response.data) {
        this.toastService.showSuccess(response.message, 'Success');
      }
    }, (error: any) => {
      this.toastService.showError(error, 'Error');
    });
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
