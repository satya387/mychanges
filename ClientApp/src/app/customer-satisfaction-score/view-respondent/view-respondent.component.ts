import { Component, OnInit, Inject, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CustomerSatisfactionScoreService } from '../customer-satisfaction-score.service';
import { ToastService } from 'src/app/common/toast/toast.service';
import { DatePipe } from '@angular/common';
import { DateAdapter } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AddClientRespondentDetailsComponent } from '../add-client-respondent-details/add-client-respondent-details.component';
import { ConfirmationPopupService } from 'src/app/shared/confirmation-popup/confirmation-popup.service';
import { ConfirmPurchaseOrderComponent } from 'src/app/confirm-purchase-order/confirm-purchase-order.component';

@Component({
  selector: 'customer-satisfaction-score-view-respondent',
  templateUrl: './view-respondent.component.html',
  styleUrls: ['./view-respondent.component.scss'],
})
export class ViewRespondentComponent implements OnInit {
    public empEmidsId: string = '-1';
  boxes: any[] = [];
  itemId: any;
  accountList: any;
  templateData: any;
  BUList: any;
  ProjectList: any;
  StudioList: any;
  selectedObject: any = { "AccountId": -1, "ProjectId": -1};
  selectedForUploadObject: any = { "AccountName": -1, "ProjectName": -1, "Cycle": "-1" }; // Object to send to backend
  selectedAccount: any;
  selectedOption: string;
  isDropdownOpen: boolean = false;
  isDisabled: boolean = false;
  buFormControl = new FormControl();
  CycleList: any;
  UploadedData: any;
  filterTemplateData: any;
  accountfilterList: any;
  filteredData: any;
  filteredProjectList: any[] = [];
  projectLists: { AccountId: number, ProjectList: any[] }[] = [];
  respondentDetails: any;
  CSATAction: string;
  isAddCSAT: any;
  CSATId: number;

  constructor(
    private formBuilder: FormBuilder,
    private customerSatisfactionScoreService: CustomerSatisfactionScoreService,
    private toastService: ToastService,
    private dateAdapter: DateAdapter<Date>,
    private router: Router,
    private datepipe: DatePipe,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    private modalService: ConfirmationPopupService
  ) {
    
  }

  ngOnInit(): void {
    this.getAllProjectList(this.selectedObject.AccountId);
    this.getAllAccountList();
    this.GetRespondentDetails();
    this.GetCSATCycles();
   
  }

  

onSelectDropdown(event: any, dropdownType: string): void {
    const target = event.target as HTMLSelectElement;
    const value = target.value;
    switch (dropdownType) {     
      case 'AccountName':
        this.selectedForUploadObject.AccountName = value;
        const selectedItem = this.accountList.find(
          (item) => item.mastcustName === this.selectedForUploadObject.AccountName
        );
        if (selectedItem) {
          this.selectedObject.AccountId = selectedItem.mastCustID;
        }
        else if (value === "-1") {
           this.selectedObject.AccountId = -1; 
          this.selectedForUploadObject.ProjectName = "-1";     
         }
        this.projectLists = [];
        this.filteredProjectList = [];
        this.getAllProjectList(this.selectedObject.AccountId);
        break;
      case 'ProjectName':
        this.selectedForUploadObject.ProjectName = value;
        break;
      case 'Cycle':
        this.selectedForUploadObject.Cycle = value;        
          break;
      default:
        break;
    }
    this.GetRespondentDetails();
  }

  getAllProjectList(AccountId: number, callback?: () => void) {
    const userData = JSON.parse(sessionStorage.getItem('userDetail'));
    const object = {
      AccountId: AccountId,
      empEmidsId: userData.EmployeeId,
    };

    this.customerSatisfactionScoreService.GetProjectsList(object).subscribe((response: any) => {
      if (response) {
        this.ProjectList = response;
      }
    }, (error: any) => {
      this.toastService.showError(error, 'Error');
    });
  }
  navigateTo(data?) {
    if (data) {
      this.router.navigate(['add-edit-CSAT'], { queryParams: { isAdd: false, id: data.id } });
    } else {
      this.router.navigate(['add-edit-CSAT'], { queryParams: { isAdd: true ,id:0} });
    }
  }
  Delete(data) {
    return new Promise<any>((resolve, reject) => {
      const dialogRef = this.dialog.open(ConfirmPurchaseOrderComponent, {
        width: '700px',
        height: '100px',
        position: { top: '170px' },
        data: {
          message: 'Are You Sure you want to Delete the respondent "'+data.clientRespondent+'?"'
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log('Dialog closed with result:', result);
        if (result === 'yes') {
          var confirmed=true;
          this.confirmDeleteTile(data, confirmed)
        } else {
          reject('User chose not to proceed.'); 
        }
      });
    });
  }
 

  confirmDeleteTile(data, confirmed) {
    debugger;
    if (confirmed) {
      const object = {
        "Id": data.id
      };
      this.customerSatisfactionScoreService.deleteCSAT(object).subscribe((response: any) => {
        if (response) {
          debugger;
          this.toastService.showSuccess(response.message, 'Success');
          this.GetRespondentDetails();
        
        }
      }, (error: any) => {
        this.toastService.showError(error, 'Error');
      });
    }
  }
  redirectmain(){
    this.router.navigate(['CSAT'])
  }
  openAddClientRespondentDialog() {
    const dialogConfig = {
      position: { top: '70px' },
      data: {
        CycleData: this.CycleList,
        ProjectData: this.filteredProjectList.length > 0 ? this.filteredProjectList : this.ProjectList
      }
    };

    // Open the dialog with the specified configuration and pass data
    const dialogRef = this.dialog.open(AddClientRespondentDetailsComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {

    });
  }
  openEditClientRespondentDialog(item) {
    const dialogConfig = {
      position: { top: '70px' },
      data: {
        CycleData: this.CycleList,
        ProjectData: this.filteredProjectList.length > 0 ? this.filteredProjectList : this.ProjectList
      }
    };

    // Open the dialog with the specified configuration and pass data
    const dialogRef = this.dialog.open(AddClientRespondentDetailsComponent, dialogConfig);
    dialogRef.componentInstance.openDialog(item); 

    dialogRef.afterClosed().subscribe(result => {

    });
  }
  getAllAccountList() {
    const userData = JSON.parse(sessionStorage.getItem('userDetail'));
    const empEmidsId = userData.EmployeeId
    this.customerSatisfactionScoreService.GetAccountsList(empEmidsId).subscribe((response: any) => {
      if (response) {
        this.accountList = response;
        this.accountfilterList = response;
      }
    }, (error: any) => {
      this.toastService.showError(error, 'Error');
    })
  }

  GetRespondentDetails() {
    const userData = JSON.parse(sessionStorage.getItem('userDetail'));
    const requestBody = {
        EmployeeID: userData.EmployeeId,
        AccountName: this.selectedForUploadObject.AccountName,
        ProjectName: this.selectedForUploadObject.ProjectName,
        Cycle: this.selectedForUploadObject.Cycle,
      }
    this.customerSatisfactionScoreService.GetRespondentDetails(requestBody).subscribe((response: any) => {
      if (response) {
        this.respondentDetails = response;
        console.log(this.respondentDetails);
      }
    }, (error: any) => {
      this.toastService.showError(error, 'Error');
    })    
  }

  GetCSATCycles() {
    this.customerSatisfactionScoreService.GetCSATCycles().subscribe((response: any) => {
      if (response) {
        this.CycleList = response;
      }
    }, (error: any) => {
      this.toastService.showError(error, 'Error');
    })
  }
}
