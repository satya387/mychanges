import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { findIndex, find } from 'lodash';
import { Pagination_Items_Per_Page, settings, BU_PRACTISE } from '../common/configuration.settings';
import { ToastService } from '../common/toast/toast.service';

import { RequestResourceService } from './request-resource.service';

@Component({
  selector: 'app-request-resource',
  templateUrl: './request-resource.component.html',
  styleUrls: ['./request-resource.component.scss']
})
export class RequestResourceComponent implements OnInit {

  filterArray: any = [];
  resourceList: any;
  jobTitle: any;
  location: any;
  rrNumber: any;
  requester: any;
  totalRecord: any;
  publishedDate: any;
  publishedBy: any;
  limit: any = settings.limit;
  offset: any = settings.offset;
  designation: any = settings.roleName;
  page: any = 1;
  itemsPerPageList = Pagination_Items_Per_Page;
  requestBody: any;
  tableSizes: any = [5, 10, 15, 20];
  countryList: any;
  accountList: any;
  projectList: any;
  buPractiseList: any = BU_PRACTISE;
  isPageChanged: any;

  constructor(private resourceRequestService: RequestResourceService, private router: Router, private toastService: ToastService) {
    this.isPageChanged = false;
  }

  ngOnInit(): void {
    this.configureRequest();
    this.getAllCountry();
    this.getAllAccountList();
    // this.getAllProjectList();
  }

  navigateTo(data?) {
    if (data) {
      this.router.navigate(['add-edit-rr'], { queryParams: { isAdd: false, id: data.id } });
    } else {
      this.router.navigate(['add-edit-rr'], { queryParams: { isAdd: true } });
    }
  }

  selectFilter(field, event) {
    const searchValue = event.target.value === 'All' ? '' : event.target.value;
    this.configureRequest(field, 'asc', searchValue);
  }

  selectAccountFilter(field, event) {
    const accName = event.target.value !== 'All' ? find(this.accountList, { id: parseInt(event.target.value) }).value : 'All';
    const searchValue = accName === 'All' ? '' : accName;
    this.configureRequest(field, 'asc', searchValue);
  }

  configureRequest(field?, direction?, value?) {
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
    this.getRequestResourceList();
  }

  getRequestResourceList() {
    this.resourceRequestService.getResourceRequestGrid(this.requestBody).subscribe((response: any) => {
      if (response) {
        this.resourceList = response.data || [];
        this.totalRecord = response.totalCount;
        this.isPageChanged = false;
      }
    }, (error: any) => {
      this.toastService.showError(error, 'Error');
    });
    this.filterArray = [];
  }

  getAllCountry() {
    this.resourceRequestService.getCountryList().subscribe((response: any) => {
      if (response) {
        this.countryList = response;
      }
    }, (error: any) => {
      this.toastService.showError(error, 'Error');
    })
  }

  getAllAccountList() {
    this.resourceRequestService.getAccountList().subscribe((response: any) => {
      if (response) {
        this.accountList = response;
      }
    }, (error: any) => {
      this.toastService.showError(error, 'Error');
    })
  }

  getAllProjectList() {
    this.resourceRequestService.getProjectList().subscribe((response: any) => {
      if (response) {
        this.projectList = response;
      }
    }, (error: any) => {
      this.toastService.showError(error, 'Error');
    })
  }

  getProjectListByAcc(accountId) {
    this.resourceRequestService.getProjectByAccountName(accountId).subscribe((response: any) => {
      if (response) {
        this.projectList = response;
      }
    }, (error: any) => {
      this.toastService.showError(error, 'Error');
    })
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

  onSelectAccount(event) {
    if (event.target.value !== 'All') {
      this.getProjectListByAcc(event.target.value);
    } else {
      this.projectList = [];
    }
  }
}
