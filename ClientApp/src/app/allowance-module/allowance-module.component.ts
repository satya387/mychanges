import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastService } from 'src/app/common/toast/toast.service';
import { map, filter, forEach } from 'lodash';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../common/common.service';
import { HomeService } from '../home/home.service';
import { distinctUntilChanged,debounceTime, switchMap, catchError, finalize } from 'rxjs/operators';
import { Subject,of, Observable, Observer } from 'rxjs';
import { ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { AllowanceModuleService } from './allowance-module.service';
import { DomSanitizer } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { settings } from '../common/configuration.settings';
import { ApproveRejectAllowanceModuleComponent } from './approve-reject-allowance-module/approve-reject-allowance-module.component';

//Component.ts
interface Employee {
  id: string;
  value: string;
  mail: string;
}
interface EmployeeResponse {
  value: string;
  mail: string;
}

@Component({
  selector: 'allowance-module',
  templateUrl: './allowance-module.component.html',
  styleUrls: ['./allowance-module.component.scss']
})
export class AllowanceModuleComponent implements OnInit {

  AllowanceDetailsList: any;
  FilteredAllowanceDetailsList: any;
  limit: any = 8;
  offset: any = settings.offset;
  page: any = 1;
  isPageChanged: any;
  totalRecord: any;
  requestBody: any;
  searchData: any = { searchText: "" }
  selectedTabIndex: number = 0;
  asyncTabs: Observable<any[]>;
  gridType: { Id: number; Name: string; Value: number; }[];
  ProjectList: any;
  IsPM: boolean = false;
  IsUserHaveModuleAccess: boolean = false;
  constructor(private formBuilder: FormBuilder, private allowanceservice: AllowanceModuleService, private toastService: ToastService,
    private router: Router, private activatedRoute: ActivatedRoute,private sanitizer: DomSanitizer,private datepipe: DatePipe,public dialog: MatDialog) {       
      this.isPageChanged = false;
      this.asyncTabs = new Observable((observer: Observer<any[]>) => {
        setTimeout(() => {
          observer.next([
            { label: 'PENDING', Value: 1 },
            { label: 'APPROVED', Value: 2 },
            { label: 'REJECTED', Value: 3 },
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
          Value: 3
        }
      ]
    }

  ngOnInit(): void {
    const userData = JSON.parse(sessionStorage.getItem('userDetail'));
    const empEmidsId = userData.EmployeeId;
    this.getAllowanceAccessByEmpId(); 
    this.getProjectList();
    this.getAllowanceDetails();
  }

  getAllowanceAccessByEmpId() {
    this.allowanceservice.GetAllowanceAccessByEmpId().subscribe((response: any) => {
        if (!response) {
          this.router.navigateByUrl('/unauthorized-access');
        }
    }, (error: any) => {
      this.toastService.showError(error, 'Error');
    })
  }

  navigateTo(data?: any, isEdit?: number) {
    debugger
    if (data) {

      this.router.navigate(['add-edit-allowance'], { queryParams: { isAdd: false, allowanceId: data.allowanceId ,isEdit } });
  
  } else {
    this.router.navigate(['add-edit-allowance'], { queryParams: { isAdd: true , allowanceId:0 } });
  }
    //this.router.navigate(['add-edit-allowance'] );
  }

  approveAllowance(Id: number, action: string) {
    const dialogRef = this.dialog.open(ApproveRejectAllowanceModuleComponent, {
      panelClass: 'approve-reject',
      width: '400px',
      data: { status: action },
    });

    dialogRef.afterClosed().subscribe((result) => {
      debugger;
      if (result) {
        let approveRejectObject = {
          id: Id,
          comments: result,
          isApprove: true,
        };
        this.allowanceservice
          .approveRejectAllowance(approveRejectObject)
          .subscribe(
            (response) => {
              this.ngOnInit();
            },
            (error) => console.error('Error:', error)
          );
      }
    });
  }

  rejectAllowance(Id: number, action: string) {
    const dialogRef = this.dialog.open(ApproveRejectAllowanceModuleComponent, {
      width: '400px',
      data: { status: action },
    });
    dialogRef.afterClosed().subscribe((result) => {
      debugger;
      if (result) {
        let approveRejectObject = {
          id: Id,
          comments: result,
          isReject: true,
        };
        this.allowanceservice
          .approveRejectAllowance(approveRejectObject)
          .subscribe(
            (response) => {
              this.ngOnInit();
            },
            (error) => console.error('Error:', error)
          );
      }
    });
  }

  onSelectStatus(field, event) {
    let searchValue = "Pending";
    searchValue = event.index + 1;
    // this.offset = 1
    if (event.index == 0)
      searchValue = "Pending";
    if (event.index == 1)
      searchValue = "Approved";
    else if (event.index == 2)
      searchValue = "Rejected"
      
      this.FilteredAllowanceDetailsList = this.AllowanceDetailsList.filter(
        a => a.approvalStatus === searchValue
      );
    //this.searchForm.get('prStatusFilter')?.setValue(searchValue, { emitEvent: false });
    // this.configureRequest(field, 'asc', searchValue);
  }
  getProjectList() {
    this.allowanceservice.GetProjectList().subscribe((response: any) => {
      if (response) {
        this.ProjectList = response;
        this.IsPM = this.ProjectList?.length > 0 ? true : false;
      }
    }, (error: any) => {
      this.toastService.showError(error, 'Error');
    })
  }
  getAllowanceDetails(){
    this.allowanceservice.GetAllowanceDetails().subscribe((response: any) => {
      if (response) {
        this.AllowanceDetailsList = response;
        this.FilteredAllowanceDetailsList = this.AllowanceDetailsList.filter(
          a => a.approvalStatus === "Pending"
        );
        // this.totalRecord = response.totalCount;
        // this.isPageChanged = false;
      }
    }, (error: any) => {
      this.toastService.showError(error, 'Error');
    })
  }

  
  onTableDataChange(event: any) {
    this.offset = event;
    this.page = this.offset;
    let searchValue = 0;
    // this.isPageChanged = this.page === 1 ? false : true;
    if (this.selectedTabIndex == 0 || this.selectedTabIndex == 1) {
      searchValue = this.selectedTabIndex + 1;
    } else if (event.index == 2) searchValue = 8;
    // this.configureRequest('Status', 'asc', searchValue);
  }
}
