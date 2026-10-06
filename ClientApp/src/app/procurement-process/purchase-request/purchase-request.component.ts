import { Component, OnInit } from '@angular/core';
import { PurchaseRequestService } from './purchase-request.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ToastService } from './common-helper/toast-alert/toast-alert.service';
import { settings } from '..//../common/configuration.settings';
import { FormGroup, FormBuilder } from '@angular/forms';
import { RejectPurchaseRequestService } from './common-helper/reject-purchase-request/reject-purchase-request.service';
import { ApprovePurchaseRequestService } from './common-helper/approve-purchase-request/approve-purchase-request.service';
import { Observable, Observer } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http/http';
import { PrpoDetailsComponent } from './prpo-details/prpo-details.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-purchase-request',
  templateUrl: './purchase-request.component.html',
  styleUrls: ['./purchase-request.component.scss']
})

export class PurchaseRequestComponent implements OnInit {

  filterArray: any = [];
  PRList: any;
  limit: any = 8;//settings.limit;
  offset: any = settings.offset;
  page: any = 1;
  isPageChanged: any;
  totalRecord: any;
  requestBody: any;
  PRStatusList: any;
  startDate: any;
  endDate: any;
  searchForm: FormGroup;
  isInitiateRequestCount: any;
  isPRApprover: any;
  showMessage: any;
  gridType: any;

  selectedTabIndex: number = 0;
  asyncTabs: Observable<any[]>;

  constructor(private purchaseRequestService: PurchaseRequestService, private router: Router, private formBuilder: FormBuilder,
    private toastService: ToastService, private approvePopUpModalService: ApprovePurchaseRequestService, private datepipe: DatePipe,
    private rejectPopUpModalService: RejectPurchaseRequestService,private dialog: MatDialog) {

    this.asyncTabs = new Observable((observer: Observer<any[]>) => {
      setTimeout(() => {
        observer.next([
          { label: 'PENDING', Value: 1 },
          { label: 'APPROVED', Value: 2 },
          { label: 'REJECTED', Value: 5 },
        ]);
      }, 1000);
    });
    this.isPageChanged = false;
    this.gridType = [
      {
        Id: 1,
        Name: 'PENDING',
        Value: 1
      }, {
        Id: 2,
        Name: 'APPROVED',
        Value: 2
      }, {
        Id: 3,
        Name: 'REJECTED',
        Value: 5
      }
    ]
  }

  ngOnInit(): void {
    this.getPRStatus();
    this.formInitialization();
    this.configureRequest();
  }
  // onTabChange(event) {
  //   this.selectedTabIndex = event.index;
  //   const tabValue = this.selectedTabIndex + 1; // Assuming tab indexes correspond to status values (1: Pending, 2: Approved, 3: Reject)
  //   this.loadTableData(tabValue);
  // }

  // loadTableData(status: number) {
  //   this.requestBody.Status = status;
  //   this.getPRDetails();
  // }


  navigateTo(data?: any, isEdit?: number) {
    debugger;
    if (data) {
      this.router.navigate(['add-purchase-request'], { queryParams: { isAdd: false, id: data.id, PR_Id:data.id,isEdit  } });
    } else {
      this.router.navigate(['add-purchase-request'], { queryParams: { isAdd: true } });
    }
  }

  navigateToPurchaseOrder() {
    this.router.navigate(['purchase-order']);
  }

  createPO(data) {
    this.router.navigate(['add-edit-Purchase'], { queryParams: { isAdd: true, id: data.id, PR_Id: data.id } });
  }


  formInitialization(data?) {
    this.searchForm = this.formBuilder.group({
      'startDate': [data ? this.datepipe.transform(data.pR_Date, 'MM/dd/yyyy') : ''],
      'endDate': [data ? this.datepipe.transform(data.pR_Date, 'MM/dd/yyyy') : ''],
      'prStatusFilter': [data ? data.pR_StatusId : 1]
    })


  }

  clearStartDate() {
    this.searchForm.get('startDate').setValue('');
  }
  clearEndDate() {
    this.searchForm.get('endDate').setValue('');
  }

  onSubmitSearch() {
    const requestBody = this.generateSearchRequestBody();
    this.purchaseRequestService.getPurchaseRequest(requestBody).subscribe((response: any) => {
      if (response) {
        this.PRList = response.data || [];
        this.totalRecord = response.totalCount;
        this.isPageChanged = false;
        this.isInitiateRequestCount = response.initiateCount > 0 ? response.initiateCount : 0;
        this.isPRApprover = response.data.some(list => list.isApprover);
      }
    }, (error: any) => {
      this.toastService.showError(error, 'Error');
    });
  }

  generateSearchRequestBody() {
    const userData = JSON.parse(sessionStorage.getItem('userDetail'));
    const empEmidsId = userData.EmployeeId; //'INEMP019';
    const statusFilter = parseInt(JSON.parse(this.searchForm.value.prStatusFilter));
    const prstatus = statusFilter !== undefined || NaN ? statusFilter : 1;
    const object = {
      "PageNumber": this.isPageChanged ? this.offset : 1,
      "PageSize": this.limit,
      "EmpEmidsId": empEmidsId,
      "StartDate": this.datepipe.transform(this.searchForm.value.startDate, 'yyyy-MM-dd', 'es-ES') || null,
      "EndDate": this.datepipe.transform(this.searchForm.value.endDate, 'yyyy-MM-dd', 'es-ES') || null,
      "Status": prstatus
    }
    this.page = this.isPageChanged ? this.offset : 1;
    this.offset = this.isPageChanged ? this.offset : 1;
    return object;
  }

  configureRequest(field?, direction?, value?) {
    const userData = JSON.parse(sessionStorage.getItem('userDetail'));
    const empEmidsId = userData.EmployeeId; //'INEMP019';
    this.clearStartDate();
    this.clearEndDate();
    
    this.requestBody = {
      "PageNumber": this.isPageChanged ? this.offset :  1,
      "PageSize": this.limit,
      "EmpEmidsId": empEmidsId,
      "Status": field ? (field == "Status" ? parseInt(value) : 1) : 1,
      "StartDate": field ? (field == "startDate" ? value : '') : '',
      "EndDate": field ? (field == "endDate" ? value : '') : '',
    }
    this.page = this.isPageChanged ? this.offset : 1;
    this.offset = this.isPageChanged ? this.offset : 1;
    this.getPRDetails();
  }

  getPRDetails() {
    this.purchaseRequestService.getPurchaseRequest(this.requestBody).subscribe((response: any) => {
      if (response) {
        this.PRList = response.data || [];
        this.totalRecord = response.totalCount;
        this.isPageChanged = false;
        this.isInitiateRequestCount = response.initiateCount > 0 ? response.initiateCount : 0;
        this.isPRApprover = response.data.some(list => list.isApprover);
      }
    }, (error: any) => {
      console.log(error);
      this.toastService.showError(error, 'Error');
    });
    this.filterArray = [];
  }

  onTableDataChange(event: any) {
    this.offset = event;
    this.page = this.offset;
    this.isPageChanged = this.page === 1 ? false : true;
    this.onSubmitSearch();
  }

  approvePR(data) {
    if ((data.pR_StatusId == 2 || data.pR_StatusId == 3) && data.pR_RoleName == 'PR Finance Approver') {
      this.toastService.showWarning(data.prNumber + ' are already approved', 'Message')
    }
    else if (data.pR_StatusId == 3 && (data.pR_RoleName == 'PR CFO Approver' || data.pR_RoleName == 'PR CEO Approver')) {
      this.toastService.showWarning(data.prNumber + ' are already approved', 'Message')
    }
    else if (data.isBudgeted == null) {
      this.toastService.showError("Budget Category is not set. Please set the Budget Category using Edit action", 'Action required');
    }
    else {
      this.approvePopUpModalService.confirm('Approve Purchase Request', data.prNumber)
        .then((confirmed) =>
          this.confirmApprove(data, confirmed)
        ).catch();
    }
  }


  confirmApprove(data, confirmed) {
    if (confirmed) {
      const object = {
        "Id": data.id
      };
      this.purchaseRequestService.updatePurchaseRequestStatus(object).subscribe((response: any) => {
        if (response.data) {
          this.toastService.showSuccess(response.data + ' ' + response.message, 'Success');
          this.onSubmitSearch();
        }
      }, (error: any) => {
        this.toastService.showError(error, 'Error');
      });
    }
  }

  rejectPR(data) {
    if (data.pR_StatusId == 5 && (data.pR_RoleName == 'PR Finance Approver' ||
      data.pR_RoleName == 'PR CFO Approver' ||
      data.pR_RoleName == 'PR CEO Approver')) {
      this.toastService.showWarning(data.prNumber + ' are already rejected', 'Message')
    }
    else {
      this.rejectPopUpModalService.confirm('Reject Purchase Request', data.prNumber)
        .then((result) => {
          this.confirmReject(data, result);
        }, (reason) => {
          // Handle dismissals if needed
        });
    }
  }

  confirmReject(data, confirmed) {
    if (confirmed) {
      const object = {
        "Id": data.id,
        "Comments": confirmed.Comments
      };
      this.purchaseRequestService.rejectPurchaseRequestStatus(object).subscribe((response: any) => {
        if (response.data) {
          this.toastService.showSuccess(response.data + ' ' + response.message, 'Success');
          this.onSubmitSearch();
        }
      }, (error: any) => {
        this.toastService.showError(error, 'Error');
      });
    }
  }

  getPRStatus() {
    this.purchaseRequestService.getPurchaseRequestStatus().subscribe((response: any) => {
      if (response) {
        this.PRStatusList = response;
      }
    }, (error: any) => {
      this.toastService.showError(error, 'Error');
    });
  }

  onSelectStatus(field, event) {
    let searchValue = 0;
    if (event.index == 1 || event.index == 0)
      searchValue = event.index + 1;
    else if (event.index == 2)
      searchValue = 5
    this.searchForm.get('prStatusFilter')?.setValue(searchValue, { emitEvent: false });
    this.configureRequest(field, 'asc', searchValue);
  }

  ExcelDump(){
    debugger;
    const userData = JSON.parse(sessionStorage.getItem('userDetail'));
    const empEmidsId = userData.EmployeeId; //'INEMP019';
    const statusFilter = parseInt(JSON.parse(this.searchForm.value.prStatusFilter));
    const prstatus = statusFilter !== undefined || NaN ? statusFilter : 1;
    const object = {
      "EmpemidsID": empEmidsId,
      "StartDate": this.datepipe.transform(this.searchForm.value.startDate, 'yyyy-MM-dd', 'es-ES') || null,
      "EndDate": this.datepipe.transform(this.searchForm.value.endDate, 'yyyy-MM-dd', 'es-ES') || null,
      "Status": prstatus
    }

    console.log(object);
    this.purchaseRequestService.downloadExcelDump(object).subscribe((data: HttpResponse<any>) => {
      if (data.status === 200 || data.status === 202) {
        console.log(`Got a successfull status code: ${data.status}`);        
        const blob = new Blob([data.body], { type: "application/vnd.ms-excel" });
        var downloadURL = window.URL.createObjectURL(blob);
        var link = document.createElement('a');
        link.href = downloadURL;
        link.download = "PR_Details_Report.xls";
        link.click();    
        link.href = "";
        window.URL.revokeObjectURL(downloadURL);
        console.log(`This contains body: ${data.body}`);
      }
    },
      (err: HttpErrorResponse) => {
        console.log(`Got a error status code: ${err.status}`);
        if (err.status === 403) {
          console.error('403 status code caught');
        }
      }
    );
  }
  openDetails(id: number): void {
    this.dialog.open(PrpoDetailsComponent, {
      data: { id: id, title: 'PR'}
    });
  }
}
