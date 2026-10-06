import { Component, OnInit } from '@angular/core';
import { PurchaseOrderService } from './purchase-order.service';
import { ToastService } from 'src/app/common/toast/toast.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Pagination_Items_Per_Page, settings, BU_PRACTISE } from '..//../common/configuration.settings';
import { PO_URLS } from './purchase-order.url-config';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators'; // Import operators
import { FormBuilder } from '@angular/forms';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http/http';
import { Observable, Observer } from 'rxjs';
import { ConfirmPurchaseOrderComponent } from 'src/app/confirm-purchase-order/confirm-purchase-order.component';
import { MatDialog } from '@angular/material/dialog';
import { RejectMessageComponent } from '../reject-message/reject-message.component';
import { ApprovePurchaseRequestService } from '../purchase-request/common-helper/approve-purchase-request/approve-purchase-request.service';
import { RejectpoComponent } from '../add-purchase-order/rejectpo/rejectpo.component';
import { PrpoDetailsComponent } from '../purchase-request/prpo-details/prpo-details.component';

@Component({
  selector: 'app-purchase-order',
  templateUrl: './purchase-order.component.html',
  styleUrls: ['./purchase-order.component.scss']
})
export class PurchaseOrderComponent implements OnInit {
  POList: any;
  filterArray: any = [];
  PRList: any;
  limit: any = 8;
  offset: any = settings.offset;
  page: any = 1;
  isPageChanged: any;
  totalRecord: any;
  requestBody: any;
  PO_Id: number;
  PONumber: string;
  searchData: any = { searchText: "" }
  selectedTabIndex: number = 0;
  asyncTabs: Observable<any[]>;
  gridType: { Id: number; Name: string; Value: number; }[];
  EditPOList: any;
  constructor(public purchaseOrderService: PurchaseOrderService,private approvePopUpModalService: ApprovePurchaseRequestService,private toastService: ToastService, private router: Router,private formBuilder:FormBuilder
    ,public dialog: MatDialog) {
    this.isPageChanged = false;
    this.asyncTabs = new Observable((observer: Observer<any[]>) => {
      setTimeout(() => {
        observer.next([
          { label: 'PENDING', Value: 1 },
          { label: 'PO GENERATED', Value: 2 },
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
        Name: 'PO GENERATED',
        Value: 2
      }, {
        Id: 3,
        Name: 'REJECTED',
        Value: 5
      }
    ]

   }

  ngOnInit(): void {
    // this.getAllPOList();
    this.configureRequest();
    // this.searchControl.valueChanges
    // .pipe(
    //   debounceTime(300), // Debounce to limit the number of calls
    //   distinctUntilChanged() // Only emit if the new value is different from the previous one
    // )
    // .subscribe(searchTerm => {
    //   debugger;
    //   this.POList = this.filterItems(searchTerm);
    // });
  }
  onSearchChange(event: any) {
    this.searchData.searchText = event.target.value; // Update the search value in the object
    console.log("Updated object:", this.searchData);
    let searchValue = 0;
    this.isPageChanged = this.page === 1 ? false : true;
    if (this.selectedTabIndex == 0 || this.selectedTabIndex == 1) {
      searchValue = this.selectedTabIndex + 1;
    }
    else if (this.selectedTabIndex == 2)
      searchValue = 8
    this.configureRequest('Status', 'asc', searchValue);
  }
  getAllPOList() {
    debugger;
    this.purchaseOrderService.GetPODetails(this.requestBody).subscribe((response: any) => {
      debugger;
      if (response) {
        this.POList = response.data || [];
        this.totalRecord = response.totalCount;
        this.isPageChanged = false;
      }
    }, (error: any) => {
      this.toastService.showError(error, 'Error');
    });
    this.filterArray = [];
  }
  // filterItems(searchTerm: string): any[] {
  //   if (!searchTerm || searchTerm.trim() === '') {
  //     return this.POList; // Return all items if search term is empty
  //   }
  //   debugger;
  //   const lowerCaseSearchTerm = searchTerm.toLowerCase();
  //   return this.POList.filter(item =>
  //     item.pR_Number&&item.pR_Number.toLowerCase().includes(lowerCaseSearchTerm) || // Filter by PR id
  //     item.vendorName&&item.vendorName.toLowerCase().includes(lowerCaseSearchTerm) // Filter by Vendor name
  //   );
    
  // }
 
  onSelectStatus(field, event) {
    let searchValue = 0;
    this.offset = 1
    if (event.index == 1 || event.index == 0)
      searchValue = event.index + 1;
    else if (event.index == 2)
      searchValue = 8
    //this.searchForm.get('prStatusFilter')?.setValue(searchValue, { emitEvent: false });
    this.configureRequest(field, 'asc', searchValue);
  }
  configureRequest(field?, direction?, value?) {
    debugger;
    const userData = JSON.parse(sessionStorage.getItem('userDetail'));
    const empEmidsId = userData.EmployeeId;
    const SearchValue=this.searchData.searchText;
    console.log(SearchValue);
    this.requestBody = {
      "PageNumber": this.isPageChanged ? this.offset : this.filterArray.length ? 1 : this.offset,
      "PageSize": this.limit,
      "EmpEmidsId": empEmidsId,
      "SearchValue": SearchValue,
      "Status": field ? (field == "Status" ? parseInt(value) : 1) : 1,

    }
    this.page = this.isPageChanged ? this.offset : 1;
    this.offset = this.isPageChanged ? this.offset : 1;
    this.getAllPOList();
  }
  onSubmitRejectForm(id){
    const POID=id
    this.EditRejectForm(POID);
  }
  EditRejectForm(POID: Number): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const dialogRef = this.dialog.open(RejectpoComponent, {
        width: '600px',
        height: '200px',
        position: { top: '170px' },
        data: POID
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log('Dialog closed with result:', result);
        // Handle the result here based on 'yes' or 'no'
        if (result === 'yes') {
          resolve(result);
          this.configureRequest();
           // Resolve with the result if needed
        } else {
          reject('User chose not to proceed.'); // Optionally reject with a reason
        }
      });
    });
  }
  onSubmitSearch(){
    this.purchaseOrderService.GetPODetails(this.requestBody).subscribe((response: any) => {
      if (response) {
        this.PRList = response.data || [];
        this.totalRecord = response.totalCount;
        this.isPageChanged = false;
      }
    }, (error: any) => {
      this.toastService.showError(error, 'Error');
    });
  }
  navigateTo(data?: any, isEdit?: number) {
    debugger
    if (data) {

        this.router.navigate(['add-edit-Purchase'], { queryParams: { isAdd: false, id: data.id ,PR_Id:data.pR_Id,isEdit } });
    
    } else {
      this.router.navigate(['add-edit-Purchase'], { queryParams: { isAdd: true ,id:0,PR_Id:0} });
    }
  }
  isDownload(data): boolean {
    return (data.prStatus === 7)
  }
  isApprove(data): boolean {
    return (data.prStatus === 4 || data.prStatus === 6 ||data.prStatus === 9)
  }
  isError(data): boolean {
    return (data.prStatus === 8)
  }
  DownloadDetails(data){
  const FileName=data.poNumber+'.pdf';
  const POId = data.poNumber
  debugger;
  const object = {
    FileName: FileName,
    POId: POId
  }
  this.purchaseOrderService.getPdf(object).subscribe((response: any) => {
    // var fileName = response.headers.get('x-file-name');
    // console.log(fileName);
    debugger;
    const blob = new Blob([response.body], {type: "application/pdf"});
    var downloadURL = window.URL.createObjectURL(blob);
    var link = document.createElement('a');
    link.href = downloadURL;
    link.name = FileName;
    link.title= FileName;
    link.download = FileName;
    window.open(downloadURL);
    link.click();    
    link.href = "";
    window.URL.revokeObjectURL(downloadURL);
    });
}
  navigateToPurchaseRequest() {
    debugger;
    this.router.navigate(['purchase-request']);
  }
  onTableDataChange(event: any) {
    this.offset = event;
    this.page = this.offset;
    let searchValue = 0;
    this.isPageChanged = this.page === 1 ? false : true;
    if (this.selectedTabIndex == 0 || this.selectedTabIndex == 1) {
      searchValue = this.selectedTabIndex + 1;
    }
    else if (this.selectedTabIndex == 2)
        searchValue = 8
    this.configureRequest('Status', 'asc', searchValue);
  
  }
  ViewError(data){
    const reason= data.reason
    this.openAddDialog(reason);
  }
  openAddDialog(note: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const dialogRef = this.dialog.open(RejectMessageComponent, {
        width: '600px',
        height: '200px',
        position: { top: '170px' },
        data: {
          message: note ,
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log('Dialog closed with result:', result);
        // Handle the result here based on 'yes' or 'no'
        if (result === 'yes') {
          resolve(result); // Resolve with the result if needed
        } else {
          reject('User chose not to proceed.'); // Optionally reject with a reason
        }
      });
    });
  }
  approvePO(Data){
    debugger;
    this.approvePopUpModalService.confirm('Approve Purchase Order', Data.poNumber)
    .then((confirmed) =>
      this.confirmApprove(Data, confirmed)
    ).catch();
  }
  confirmApprove(data, confirmed) {
    debugger;
    if (confirmed) {
      const object = {
        "Id": data.id
      };
      this.purchaseOrderService.updatePurchaseOrderStatus(object).subscribe((response: any) => {
        if (response.data) {
          this.toastService.showSuccess(response.data + ' ' + response.message, 'Success');
          //this.onSubmitSearch();
          this.configureRequest();
          this.purchaseOrderService.GetPOEditDetails(data.id).subscribe((response: any) => {
            if (response) {
              this.EditPOList = response;
              if(this.EditPOList[0].prStatus == 7){
                this.UploadPurchaseOrderReporttoSharepoint(data.id)
               }
            }
          }, (error: any) => {
            this.toastService.showError(error, 'Error');
          })
        }
      }, (error: any) => {
        this.toastService.showError(error, 'Error');
      });
    }
  }
  UploadPurchaseOrderReporttoSharepoint(id) {
    debugger;
    var Filename;
    var LocationId;
    var Buyers;
    this.purchaseOrderService.GetPOEditDetails(id).subscribe((response: any) => {
      if (response) {
        this.EditPOList = response;
        const object = {
          Id: id,
          url: PO_URLS.UPLOAD_PDF,
          fileName: this.EditPOList[0].poNumber + ".pdf",
          LocationId: this.EditPOList[0].locationId,
          PO_Number:this.EditPOList[0].poNumber,
          Buyers:this.EditPOList[0].buyers
        }
   
        this.purchaseOrderService.UploadPdf(object).subscribe((data: HttpResponse<any>) => {
          if (data.status === 200 || data.status === 202) {
            console.log(`Got a successfull status code: ${data.status}`);
            this.toastService.showSuccess("File uploaded successfully.", 'Success');
            const blob = new Blob([data.body], { type: "application/pdf" });
            var downloadURL = window.URL.createObjectURL(blob);
            var link = document.createElement('a');
            link.href = downloadURL;
            link.download = "PurchaseOrder.pdf";
            window.open(downloadURL);
            //link.click();    
            link.href = "";
            window.URL.revokeObjectURL(downloadURL);
            console.log(`This contains body: ${data.body}`);
          }
        },
          (err: HttpErrorResponse) => {
            console.log(`Got a error status code: ${err.status}`);
            this.toastService.showError("Error occured while Uploading File! Please try again.", 'Error');  //err.message
            if (err.status === 403) {
              console.error('403 status code caught');
            }
          }
        );
      }
    }, (error: any) => {
      this.toastService.showError(error, 'Error');
    })
   
  }
  ExcelDump(){
    debugger;
    const userData = JSON.parse(sessionStorage.getItem('userDetail'));
    const empEmidsId = userData.EmployeeId; //'INEMP019';
    const SearchValue=this.searchData.searchText;

    const object = {
      "EmpemidsID": empEmidsId,
      "SearchValue": SearchValue
    }
    console.log(object);
    this.purchaseOrderService.downloadExcelDump(object).subscribe((data: HttpResponse<any>) => {
      if (data.status === 200 || data.status === 202) {
        console.log(`Got a successfull status code: ${data.status}`);        
        const blob = new Blob([data.body], { type: "application/vnd.ms-excel" });
        var downloadURL = window.URL.createObjectURL(blob);
        var link = document.createElement('a');
        link.href = downloadURL;
        link.download = "PO_Details_Report.xls";
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
  openDetails(id: number,pR_Id: number): void {
    this.dialog.open(PrpoDetailsComponent, {
      data: { id: id, title: 'PO',pR_Id: pR_Id }
    });
  }
}
