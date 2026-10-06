import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { findIndex } from 'lodash';

import { ToastService } from 'src/app/common/toast/toast.service';
// settings for pagination
import { Pagination_Items_Per_Page, settings } from '../../common/configuration.settings';
import { TilesService } from './tiles.service';
// For Confirmation Popup
import { ConfirmationPopupService } from 'src/app/shared/confirmation-popup/confirmation-popup.service'

@Component({
  selector: 'app-tiles',
  templateUrl: './tiles.component.html',
  styleUrls: ['./tiles.component.scss']
})
export class TilesComponent implements OnInit {

  tileList: any;
  limit: any = settings.limit;
  offset: any = settings.offset;
  page: any = 1;
  itemsPerPageList = Pagination_Items_Per_Page;
  requestBody: any;
  tableSizes: any = [5, 10, 15, 20];
  filterArray: any = [];
  totalRecord: any;
  tileName: any;
  publishedDate: any;
  publishedBy: any;
  isPageChanged: boolean;
  globalField: any;
  globalValue: any;

  constructor(private toastService: ToastService, private tileService: TilesService, private modalService: ConfirmationPopupService,
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
    this.getTilesList();
  }

  getTilesList() {
    this.tileService.getAllTilesList(this.requestBody).subscribe((response: any) => {
      if (response) {
        this.tileList = response.data || [];
        this.totalRecord = response.totalCount;
        this.isPageChanged = false;
      }
    }, (error: any) => {
      this.toastService.showError(error, 'Error');
    })
  }

  gotoEdit(item) {
    const tileDetails = this.declaringTileObject(item);
    this.router.navigate(['/edit-tile'], { queryParams: { isAdd: false, data: JSON.stringify(tileDetails) } });
  }

  declaringTileObject(data) {
    const object = {
      tileId: data.tileId,
      tileName: data.name,
      tileLink: data.TileLink,
      tileDescription: data.DisplayText
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

  navigateTo() {
    this.router.navigate(['/add-tile'], { queryParams: { isAdd: true } });
  }

  deleteTile(data) {
    this.modalService.confirm('Delete Tile', 'Are you sure you want to delete tile?')
      .then((confirmed) =>
        this.confirmDeleteTile(data, confirmed)
      ).catch();

  }

  confirmDeleteTile(data, confirmed) {
    if (confirmed) {
      const object = {
        "TileId": data.tileId
      };
      this.tileService.deleteTiles(object).subscribe((response: any) => {
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
      "TileId": data.tileId,
      "isActive": data.status ? false : true,
    };
    this.tileService.changeTileStatus(object).subscribe((response: any) => {
      if (response.data) {
        this.toastService.showSuccess(response.message, 'Success');
      }
    }, (error: any) => {
      this.toastService.showError(error, 'Error');
      this.configureRequest();
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
