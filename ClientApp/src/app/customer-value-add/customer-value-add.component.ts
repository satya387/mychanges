import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddCustomerValueAddComponent } from './add-customer-value-add/add-customer-value-add.component';
import { CustomerValueAddService } from './customer-value-add.service';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/common/toast/toast.service';
import { MatSelectChange } from '@angular/material/select';
import * as XLSX from 'xlsx';
import { ExcelService } from './Excel-cva-download';
import { ElementRef, Renderer2 } from '@angular/core';
import { CurrencyPipe } from '@angular/common';


@Component({
  selector: 'app-customer-value-add',
  templateUrl: './customer-value-add.component.html',
  styleUrls: ['./customer-value-add.component.scss']
})
export class CustomerValueAddComponent implements OnInit {

  boxes: any[] = [];
  itemId: any;
  accountList: any;
  ProjectList: any;
  //StudioList: any;
  selectedObject: any = { "AccountId": -1, "ProjectId": -1, "Studio": "-1", "serviceArea": -1, "statusId": -1 }; // Object to send to backend
  selectedAccount: any;
  selectedOption: string;
  isDropdownOpen: boolean = false;
  isDisabled: boolean = false;
  ServiceAreaList: any;
  StatusList: any;

  constructor(public dialog: MatDialog, public customervalueaddservice: CustomerValueAddService, public route: Router,
    private toastService: ToastService, private excelservice: ExcelService, private elementRef: ElementRef, private renderer: Renderer2,
    private currencyPipe: CurrencyPipe) { }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(AddCustomerValueAddComponent, {
      // width: '800px',
      // height:'600px',
      position: { top: '70px' },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }
  openEditDialog(box): void {
    const dialogRef = this.dialog.open(AddCustomerValueAddComponent, {
      //  width: '800px',
      //  height:'600px',
      position: { top: '70px' },
      disableClose: true,
      // Pass mode 'edit' and itemId for editing

    });
    dialogRef.componentInstance.openDialog(box.customer.id);
    // console.log(box.customer);// Call openDialog method with 'edit' mode and itemId
    // console.log(box.customer.id);// Call openDialog method with 'edit' mode and itemId
    dialogRef.afterClosed().subscribe(result => {

    });
  }
  getAllAccountList() {
    const userData = JSON.parse(sessionStorage.getItem('userDetail'));
    const empEmidsId = userData.EmployeeId
    this.customervalueaddservice.GetAccountsList(empEmidsId).subscribe((response: any) => {
      if (response) {
        this.accountList = response;
      }
    }, (error: any) => {
      this.toastService.showError(error, 'Error');
    })
  }
  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
  getAllProjectList() {
    const userData = JSON.parse(sessionStorage.getItem('userDetail'));
    const object = {
      AccountId: this.selectedObject.AccountId,
      empEmidsId: userData.EmployeeId,
    }
    this.customervalueaddservice.GetProjectsList(object).subscribe((response: any) => {
      if (response) {
        this.ProjectList = response;
      }
    }, (error: any) => {
      this.toastService.showError(error, 'Error');
    })
  }
  clearSelection() {
    this.selectedAccount = null;
  }
  // getAllStudioList() {
  //   this.customervalueaddservice.GetStudioDetails().subscribe((response: any) => {
  //     if (response) {
  //       this.StudioList = response;
  //     }
  //   }, (error: any) => {
  //     this.toastService.showError(error, 'Error');
  //   })
  // }

  getAllServiceAreaList() {
    this.customervalueaddservice.GetServiceAreaList().subscribe((response: any) => {
      if (response) {
        this.ServiceAreaList = response;
      }
    }, (error: any) => {
      this.toastService.showError(error, 'Error');
    })
  }

  getAllStatusList() {
    this.customervalueaddservice.GetStatusDetails().subscribe((response: any) => {
      if (response) {
        this.StatusList = response;
      }
    }, (error: any) => {
      this.toastService.showError(error, 'Error');
    })
  }

  generateCVABody() {

    const object = {
      "AccountId": -1,
      "ProjectId": -1,
      //"Studio":"-1"
      "ServiceArea": -1,
      "StatusId": -1
    }
    return object;

  }
  getProjectList() {
    const requestBody = this.selectedObject;
    this.customervalueaddservice.getCustomersList(requestBody).subscribe((CustomerValueAddlist: any) => {
      this.boxes = CustomerValueAddlist.map(customer => {
        return {
          height: 82,
          customer: customer
        };
      });

      this.boxes.forEach(box => {
        if (box.customer.isIdeaApproved == true) {
          box.customer.isIdeaApproved = 'YES';
        }
        else {
          box.customer.isIdeaApproved = 'NO';
        }
        if (box.customer.isCustomerCommunicationDone == true) {
          box.customer.isCustomerCommunicationDone = 'YES';
        }
        else {
          box.customer.isCustomerCommunicationDone = 'NO';
        }

      });
    });

  }
  onSelectDropdown(event: any, dropdownType: string): void {
    const target = event.target as HTMLSelectElement;
    const value = target.value;
    switch (dropdownType) {
      case 'AccountId':
        this.selectedObject.AccountId = parseInt(value);
        this.getAllProjectList();
        break;
      // case 'StudioId':
      //   this.selectedObject.Studio = value;
      //   break;
      case 'ServiceAreaId':
        this.selectedObject.serviceArea = parseInt(value);
        break;
      case 'StatusId':
        this.selectedObject.statusId = parseInt(value);
        break;
      case 'ProjectId':
        this.selectedObject.ProjectId = parseInt(value);
        break;
      default:
        break;
    }
    this.getProjectList();
  }
  toggleBoxHeight(box): void {
    this.boxes.forEach(b => {
      if (b !== box) {
        b.height = 82;
      }

    });
    box.height = box.height === 82 ? 385 : 82;
    // this.hidescrollers(box);

  }
  //  hidescrollers(box){
  //   debugger;
  //   const descriptionElement = this.elementRef.nativeElement.querySelector('#description');
  //   const solutionProposedLength = box.customer.problemStatement.length;
  //   if (solutionProposedLength > 500) {
  //     this.renderer.setStyle(descriptionElement.parentElement, 'overflow-y', 'auto');
  //   } else {
  //     this.renderer.setStyle(descriptionElement.parentElement, 'overflow-y', 'hidden');
  //   }

  //   const Solutionelement = this.elementRef.nativeElement.querySelector('#solution');
  //   const SolutionLength = box.customer.solutionProposed.length;
  //   if (SolutionLength > 500) {
  //     this.renderer.setStyle(Solutionelement.parentElement, 'overflow-y', 'auto');
  //   } else {
  //     this.renderer.setStyle(Solutionelement.parentElement, 'overflow-y', 'hidden');
  //   }
  //   const element = this.elementRef.nativeElement.querySelector('#benefits');
  //   const contentLength = box.customer.potentialBenifits.length;

  //   if (contentLength > 500) {
  //     this.renderer.setStyle(element.parentElement, 'overflow-y', 'auto');
  //   } else {
  //     this.renderer.setStyle(element.parentElement, 'overflow-y', 'hidden');
  //   }
  //   const actionselement = this.elementRef.nativeElement.querySelector('actions');
  //   const actionsLength = box.customer.actionsImplemented.length;

  //   if (actionsLength > 500) {
  //     this.renderer.setStyle(actionselement.parentElement, 'overflow-y', 'auto');
  //   } else {
  //     this.renderer.setStyle(actionsLength.parentElement, 'overflow-y', 'hidden');
  //   }
  //  }

  convertToMillions(savings) {
    //const valueInMillions = savings / 1000000;
    if(savings)
      return this.currencyPipe.transform(savings, 'USD', 'symbol', '1.0-2');
    else
      return 0;
  }

  GetDumpDetails(): void {
    try {
      // Subscribe to the observable returned by your API service to get the data
      const requestBody = this.selectedObject;
      this.customervalueaddservice.getCustomersList(requestBody).subscribe((AddList: any) => {
        // Convert the data to worksheet

        const Data = AddList.map(project => {
          return {
            AccountName: project.accountName,
            ProjectName: project.projectName,
            Practice: project.practice,
            IdeaLoggedBy: project.ideaLoggedBy,
            IdeaQualifiedBy_DH_DM: project.isIdeaApproved ? 'Yes' : 'No',
            IdeaLoggedOn: project.ideaLoggedOn,
            ProcessCommittedDate: project.processCommittedDate,
            ProcessActualCommittedDate: project.processActualCommittedDate,
            ImplementationOwner: project.implementationOwner,
            'DM': project.dm,
            'DH': project.dh,
            'Status': project.status,
            'Savings': project.savings,
            'CCD through(QBR/MSR)': project.isCustomerCommunicationDone ? 'Yes' : 'No',
            'Idea Title': project.ideaTitle,
            'Alignment With Customer Goals': project.customerGoals,
            'CVA Category': project.cvaCategory,
            'Idea Description/Problem Statement': project.problemStatement,
            'Potential Benefits': project.potentialBenifits,
            'Solution Proposed': project.solutionProposed,
            'Implementation Plan': project.actionsImplemented,
            'Success Measures': project.successMeasures,
            'Customer Impact': project.customerImpact,
          };
        });

        const columns = ['Account Name', 'Project Name','Practice', 'Idea Logged By', ' Idea Qualified By DH/DM', 'Idea Logged On', 'Planned Completion Date',
          'Actual Completion Date', 'Implementation Owner', 'DM', 'DH', 'Status', 'Savings ($)', 'CCD through (QBR/MSR)', 'Idea Title',
          'Alignment With Customer Goals', 'CVA Category', 'Customer Need / Problem Statement', 'Key Benefits To Customer',
          'Your Idea / Proposed Solution', 'Implementation Plan', 'Success Measures', 'Customer Impact']
        this.excelservice.exportAsExcelFile('Customer Value Add', '', columns, Data, 'Customer Value Add', 'Customer Value Add');
      });
    } catch (error) {
      console.error('Error downloading Excel file:', error);
    }
  }
  isCurrentUserIdeaOwner(box): boolean {
    const userData = JSON.parse(sessionStorage.getItem('userDetail'));
    const EmpEmidsId = userData.EmployeeId;
    const Commonname = userData.UserName;
    return ((box.customer.ideaLoggedBy === Commonname && (box.customer.status == "Idea Approved" || box.customer.status == "Execution In Progress" || box.customer.status == "Initiated")) || (box.customer.implementationOwner === Commonname && (box.customer.status == "Idea Approved" || box.customer.status == "Execution In Progress")) || (box.customer.roleType === 2 && (box.customer.status == "Idea Approved" || box.customer.status == "Execution In Progress" || box.customer.status == "Initiated")) || (box.customer.roleType == 3 && (box.customer.status == "Idea Approved" || box.customer.status == "Execution In Progress" || box.customer.status == "Initiated")));
  }
  ngOnInit(): void {
    this.getProjectList();
    this.getAllAccountList();
    this.getAllProjectList();
    //this.getAllStudioList();
    this.getAllServiceAreaList();
    this.getAllStatusList();
  }

}
