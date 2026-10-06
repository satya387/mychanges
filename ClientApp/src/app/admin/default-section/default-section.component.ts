import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { findIndex } from 'lodash';

import { ToastService } from 'src/app/common/toast/toast.service';
import { SectionService } from '../section/section.service';
import { Pagination_Items_Per_Page, settings } from 'src/app/common/configuration.settings';

// For Confirmation Popup
import { ConfirmationPopupService } from 'src/app/shared/confirmation-popup/confirmation-popup.service';

@Component({
  selector: 'app-default-section',
  templateUrl: './default-section.component.html',
  styleUrls: ['./default-section.component.scss']
})
export class DefaultSectionComponent implements OnInit {

  limit: any = settings.limit;
  offset: any = settings.offset;
  page: any = 1;
  itemsPerPageList = Pagination_Items_Per_Page;
  requestBody: any;
  tableSizes: any = [5, 10, 15, 20];
  sectionName: any;
  publishedDate: any;
  publishedBy: any;
  sectionList: any;
  filterArray: any;
  totalRecord: any;
  isPageChanged: boolean;

  constructor(private toastService: ToastService, private modalService: ConfirmationPopupService,
    private sectionService: SectionService, private router: Router) {
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
    this.getDefaultSectionList();
  }

  getDefaultSectionList() {
    this.sectionService.getDefaultSectionsList(this.requestBody).subscribe((response: any) => {
      if (response) {
        this.sectionList = response.modules || [];
        this.totalRecord = response.totalCount;
        this.isPageChanged = false;
      }
    }, (error: any) => {
      this.toastService.showError(error, 'Error');
    });
  }

  navigateTo() {
    this.router.navigate(['add-default-section']);
  }

  redirectToTilesAssigned(data) {
    const sectionDetails = this.declaringSectionObject(data);
    this.router.navigate(['/default-section-tile'], { queryParams: { data: JSON.stringify(sectionDetails) } });
  }

  declaringSectionObject(data) {
    const object = {
      moduleId: data.moduleId,
      moduleName: data.moduleName,
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

  deleteSection(data) {
    this.modalService.confirm('Delete Section', 'Are you sure you want to delete section?')
      .then((confirmed) =>
        this.confirmDeleteSection(data, confirmed)
      ).catch();
  }

  confirmDeleteSection(data, confirmed) {
    if (confirmed) {
      const object = {
        "moduleId": data.moduleId
      };
      this.sectionService.deleteDefaultSection(object).subscribe((response: any) => {
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
      "ModuleId": data.moduleId,
      "isActive": data.isActive ? false : true,
    };
    this.sectionService.changeDefaultSectionStatus(object).subscribe((response: any) => {
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
