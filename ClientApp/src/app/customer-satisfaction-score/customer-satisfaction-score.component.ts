import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ToastService } from '../common/toast/toast.service';
import { FormControl } from '@angular/forms';
import { CustomerSatisfactionScoreService } from './customer-satisfaction-score.service';
import { ExcelService } from '../customer-satisfaction-score/Excel-csat-download';//'./Excel-cva-download';
import { UploadCustomerSatisfactionScoreComponent } from '../customer-satisfaction-score/upload-customer-satisfaction-score/upload-customer-satisfaction-score.component';
import { ViewDetailsComponent } from './view-details/view-details.component';
import { AddClientRespondentDetailsComponent } from './add-client-respondent-details/add-client-respondent-details.component';
import { DownloadTemplateComponent } from './download-template/download-template.component';
import { ViewRespondentComponent } from './view-respondent/view-respondent.component';
import { Pagination_Items_Per_Page, settings, BU_PRACTISE } from '../common/configuration.settings';
import { findIndex, find } from 'lodash';
import { PurchaseOrderService } from '../procurement-process/purchase-order/purchase-order.service';

@Component({
  selector: 'app-customer-satisfaction-score',
  templateUrl: './customer-satisfaction-score.component.html',
  styleUrls: ['./customer-satisfaction-score.component.scss']
})


export class CustomerSatisfactionScoreComponent implements OnInit {
  public empEmidsId: string = '-1';
  boxes: any[] = [];
  itemId: any;
  accountList: any;
  templateData: any;
  BUList: any;
  ProjectList: any;
  StudioList: any;
  selectedObject: any = { "AccountId": -1, "ProjectId": -1, "BUId": -1 };
  selectedForUploadObject: any = { "AccountName": -1, "ProjectName": -1, "BUName": "-1" }; // Object to send to backend
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
  limit: any = settings.limit;
  offset: any = settings.offset;
  isPageChanged: any;
  page: any = 1;
  totalRecord: any;
  itemsPerPageList = Pagination_Items_Per_Page//[5];
  filterArray: any = [];
  isAdmin:boolean=false;
  resourceList: any;//Pagination_Items_Per_Page;
  requestBody: { Filter: any; PageNumber: any; PageSize: any; Sort: { Dir: any; Field: any; }; };
  UserRoles: any;

  constructor(private customerSatisfactionScoreService: CustomerSatisfactionScoreService,private purchaseorderservice: PurchaseOrderService,
 private router: Router, private toastService: ToastService,
    private excelservice: ExcelService, public dialog: MatDialog
  ) {
    this.isPageChanged = false;
  }
  ngOnInit(): void {
    this.getAllAccountList();
    this.getAllProjectList(this.selectedObject.AccountId);
    this.getBUList();
    this.GetCSATCycles();
    this.GetCSATUploadData();
    this.getProjectList();
    this.GetTemplateDetails();
    this.addvalidation();
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

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  getAllProjectList(AccountId: number, callback?: () => void) {
    const userData = JSON.parse(sessionStorage.getItem('userDetail'));
    const object = {
      AccountId: AccountId,
      empEmidsId: userData.EmployeeId,
    };

    this.customerSatisfactionScoreService.GetProjectsList(object).subscribe((response: any) => {
      if (response) {
        // Store the project list along with the corresponding account ID
        this.projectLists.push({ AccountId: object.AccountId, ProjectList: response });
        this.filteredProjectList.push(...response); // Push to filteredProjectList
        if (callback) callback();
      }
    }, (error: any) => {
      this.toastService.showError(error, 'Error');
    });
  }

  clearSelection() {
    this.selectedAccount = null;
  }

  getProjectList() {
    const requestBody = this.selectedObject;
    this.customerSatisfactionScoreService.getCustomersList(requestBody).subscribe((CsatList: any) => {
      this.boxes = CsatList.map(customer => {
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
      case 'BUName':
        this.selectedForUploadObject.BUName = value;

        if (value === "-1") {
          this.selectedObject.AccountId = -1;
          this.selectedObject.ProjectId = -1;
          this.selectedForUploadObject.AccountName = -1;
          this.selectedForUploadObject.ProjectName = -1;
          this.projectLists = [];
          this.filteredProjectList = [];
          this.getAllProjectList(this.selectedObject.AccountId);
          this.getAllAccountList();
        } else {
          const selectedBuItems = this.filterTemplateData.filter(item => item.buName === this.selectedForUploadObject.BUName);
          this.selectedObject.AccountId = -1;
          this.accountList = [];
          this.ProjectList = [];
          this.filteredProjectList = [];

          selectedBuItems.forEach(selectedBuItem => {
            const selectedAccountID = this.accountfilterList.find(item => item.mastcustName === selectedBuItem.accountName);
            if (selectedAccountID && !this.accountList.some(account => account.mastCustID === selectedAccountID.mastCustID)) {
              this.accountList.push(selectedAccountID);
            }
          });

          if (this.accountList.length > 0) {
            this.accountList.forEach(account => {
              this.selectedObject.AccountId = account.mastCustID;
              this.getAllProjectList(this.selectedObject.AccountId, () => {
                if (this.ProjectList.length === 0) {
                  this.selectedObject.ProjectId = -1;
                }
              });
            });
          }
        }
        break;
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
          this.selectedObject.ProjectId = -1;          
        }
        this.projectLists = [];
        this.filteredProjectList = [];
        this.getAllProjectList(this.selectedObject.AccountId);
        break;
      case 'ProjectName':
        this.selectedForUploadObject.ProjectName = value;
        break;
      default:
        break;
    }
    this.GetCSATUploadData();
  }

  toggleBoxHeight(box): void {
    this.boxes.forEach(b => {
      if (b !== box) {
        b.height = 82;
      }
    });
    box.height = box.height === 82 ? 360 : 82;
  }

  openUploadDialog(): void {
    const dialogConfig = {
      position: { top: '70px' },
      data: {
        CycleData: this.CycleList,
        UploadedData: this.UploadedData
      }
    };

    // Open the dialog with the specified configuration and pass data
    const dialogRef = this.dialog.open(UploadCustomerSatisfactionScoreComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {

    });
  }

  getBUList() {
    const userData = JSON.parse(sessionStorage.getItem('userDetail'));
    const empEmidsId = userData.EmployeeId;
    this.customerSatisfactionScoreService.GetBUList(empEmidsId).subscribe((response: any) => {
      if (response) {
        this.BUList = response;
      }
    }, (error: any) => {
      this.toastService.showError(error, 'Error');
    })
  }

  openEditDialog(box): void {
    const dialogRef = this.dialog.open(UploadCustomerSatisfactionScoreComponent, {
      position: { top: '70px' },
    });
    dialogRef.componentInstance.openDialog(box.customer.id);
    dialogRef.afterClosed().subscribe(result => {

    });
  }

  isCurrentUserIdeaOwner(box): boolean {
    const userData = JSON.parse(sessionStorage.getItem('userDetail'));
    const EmpEmidsId = userData.EmployeeId;
    const Commonname = userData.UserName;
    return ((box.customer.ideaLoggedBy === Commonname && (box.customer.status == "Approved" || box.customer.status == "In Progress" || box.customer.status == "Initiated")) || (box.customer.implementationOwner === Commonname && (box.customer.status == "Approved" || box.customer.status == "In Progress")) || (box.customer.roleType === 2 && (box.customer.status == "Approved" || box.customer.status == "In Progress" || box.customer.status == "Initiated")) || (box.customer.roleType == 3 && (box.customer.status == "Approved" || box.customer.status == "In Progress" || box.customer.status == "Initiated")));
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

  GetCSATUploadData() {
    const userData = JSON.parse(sessionStorage.getItem('userDetail'));
    const requestBody = {
      EmployeeID: userData.EmployeeId,
      AccountName: this.selectedForUploadObject.AccountName,
      ProjectName: this.selectedForUploadObject.ProjectName,
      BUName: this.selectedForUploadObject.BUName,
    }
    this.isPageChanged = false;
    this.customerSatisfactionScoreService.GetCSATUploadData(requestBody).subscribe((response: any) => {
      if (response) {
        this.UploadedData = response;
        console.log(this.UploadedData);
      }
    }, (error: any) => {
      this.toastService.showError(error, 'Error');
    })
  }
  addvalidation(){
    const userData = JSON.parse(sessionStorage.getItem('userDetail'));
    const empEmidsId = userData.EmployeeId;
    this.purchaseorderservice.GetPOUserDetails(empEmidsId).subscribe((response: any) => {
      if (response) {
        this.UserRoles = response;
        this.isAdmin=this.UserRoles[0].iscsatAdmin;
        //debugger
        console.log(this.isAdmin);
      }
    }, (error: any) => {
      this.toastService.showError(error, 'Error');
    })
      

  }
  GetDownloadData(): void {
    try {
      const userData = JSON.parse(sessionStorage.getItem('userDetail'));
      const requestBody = {
        EmployeeID: userData.EmployeeId,
        AccountName: this.selectedForUploadObject.AccountName,
        ProjectName: this.selectedForUploadObject.ProjectName,
        BUName: this.selectedForUploadObject.BUName,
      }
      this.customerSatisfactionScoreService.GetCSATUploadData(requestBody).subscribe((DownloadList: any) => {
        // Convert the data to worksheet
        const Data = DownloadList.map(data => {
          return {
            'Cycle': data.cycle,
            'BU': data.bu,
            'Account Name': data.accountName,
            'Program / Project Name (multiple project selection)': data.programProjectName,
            'Client Respondent': data.clientRespondent,
            'Client Respondent Email': data.clientRespondentEmail,
            'Management Level (CEO/Senior/Operational)': data.managementLevel,
            'Managing Partner': data.buHead,
            'Client Partner / Account Manager': data.clientPartnerAccountManager,
            'Delivery Head': data.deliveryHead,
            'Delivery Manager': data.deliveryManager,
            'Project Manager': data.projectManager,
            'Studio Leader': data.studioLeader,
            'Studio': data.studio,
            'Sub Studio': data.subStudio,
            'Project Type (A/B/C)': data.projectType,
            'Engagement Type (Solution Based/IEP/ICP/Capacity Infusion)': data.engagementType,
            'Focus Ac (Y/N)': data.focusAc,
            'NPS Score (Numeric)': data.npsScore,
            'NPS Category (Text)': data.npsCategory,
            'Expectation 1 (Numeric)': data.expectation1,
            'Exp 1 rating (Text)': data.exp1Rating,
            'Expectation 2 (Numeric)': data.expectation2,
            'Exp 2 rating (Text)': data.exp2Rating,
            'Expectation 3 (Numeric)': data.expectation3,
            'Exp 3 rating (Text)': data.exp3Rating,
            'You are very satisfied with your experience with Emids (Numeric)': data.verySatisfiedWithExperience,
            'You will definitely choose Emids for your future requirements (Numeric)': data.willChooseForFutureRequirements,
            'You believe that Emids delivers the best business value for your money (Numeric)': data.bestBusinessValueForMoney,
            'Relationship management (business understanding,stakeholder mgmt., customer centricity) (Numeric)': data.relationshipManagement,
            'Resource management (availability of key resources,managing transition, knowledge transfer) (Numeric)': data.resourceManagement,
            'Quality of resources (knowledge , personnel , technical expertise) (Numeric)': data.qualityOfResources,
            'Execution excellence (program/project management, governance, coordination of multiple groups) (Numeric)': data.executionExcellence,
            'Delivering on project/program KPIs (SLA, Scope, Budget, Timelines) (Numeric)': data.deliveringOnKPIs,
            'Automation efforts to increase productivity/ efficiencies (Numeric)': data.automationEfforts,
            'Quality of deliverables (Numeric)': data.qualityOfDeliverables,
            'Leveraging agile/ DevOps to increase pace of deployment (Numeric)': data.leveragingAgileDevOps,
            'Emids has a strong understanding of your industry / domain (Numeric)': data.strongIndustryUnderstanding,
            'Emids showcases the right technology solutions that are contextual to your business needs (Numeric)': data.rightTechnologySolutions,
            'Emids demonstrates the ability to own & deliver end to end programs (Numeric)': data.abilityToOwnDeliverPrograms,
            'Emids adopts a consultative approach in crafting the right solutions for your needs (Numeric)': data.consultativeApproach,
            'Emids actively brings ideas / suggestions to enhance your program outcomes (Numeric)': data.activelyBringsIdeas,
            'Emids proactively engages in discussions beyond the contract ( on strategic inputs, future roadmap, and thought leadership) (Numeric)': data.proactiveEngagements,
            'Comp1 (Text)': data.comp1,
            'Reason1 (Text)': data.reason1,
            'Comp2 (Text)': data.comp2,
            'Reason2 (Text)': data.reason2,
            'Comp3 (Text)': data.comp3,
            'Reason3 (Text)': data.reason3,
            'What in your opinion differentiates Emids from other similar service providers? (Text)': data.differentiatesEmids,
            'What are the areas you wish Emids could strengthen further? (Text)': data.areasToStrengthen,
            'BusinessPriorities1 (Text)': data.businessPriorities1,
            'BusinessPriorities2 (Text)': data.businessPriorities2,
            'BusinessPriorities3 (Text)': data.businessPriorities3,
            'EmidsHelp1 (Text)': data.emidsHelp1,
            'EmidsHelp2 (Text)': data.emidsHelp2,
            'EmidsHelp3 (Text)': data.emidsHelp3,
            'OrgWide Capabilities - Generative AI': data.orgWideCapabilitiesGenerativeAI,
            'OrgWide Capabilities - Product Strategy, Design & Engineering': data.orgWideCapabilitiesProductStrategy,
            'OrgWide Capabilities - Design-Led engineering': data.orgWideCapabilitiesDesignLedEngineering,
            'OrgWide Capabilities - Modernization (Cloud migration and optimization)': data.orgWideCapabilitiesModernization,
            'OrgWide Capabilities - Data Engineering (DI, DQ, DS)': data.orgWideCapabilitiesDataEngineering,
            'OrgWide Capabilities - Interoperability': data.orgWideCapabilitiesInteroperability,
            'OrgWide Capabilities - Automation': data.orgWideCapabilitiesAutomation,
            'Platform implementation - Healthcare core platforms, Emids data platforms': data.platformImplementation,
            'HC Domain Capabilities - Care Management': data.hcDomainCapabilitiesCareManagement,
            'HC Domain Capabilities - Population Health': data.hcDomainCapabilitiesPopulationHealth,
            'HC Domain Capabilities - Member Experience': data.hcDomainCapabilitiesMemberExperience,
            'HC Domain Capabilities - Revenue Cycle Management': data.hcDomainCapabilitiesRevenueCycleManagement,
            'HC Domain Capabilities - Payment Integrity': data.hcDomainCapabilitiesPaymentIntegrity,
            'HC Domain Capabilities - Claims Management': data.hcDomainCapabilitiesClaimsManagement,
            'HC Domain Capabilities - PBM': data.hcDomainCapabilitiesPBM,
            'HC Domain Capabilities - Clinical Trials': data.hcDomainCapabilitiesClinicalTrials
          };
        });
        const columns = ['Cycle', 'BU', 'Account Name', 'Program / Project Name (multiple project selection)', 'Client Respondent', 'Client Respondent Email',
          'Management Level (CEO/Senior/Operational)', 'Managing Partner', 'Client Partner / Account Manager', 'Delivery Head',
          'Delivery Manager', 'Project Manager', 'Studio Leader', 'Studio', 'Sub Studio', 'Project Type (A/B/C)', 'Engagement Type (Solution Based/IEP/ICP/Capacity Infusion)',
          'Focus Ac (Y/N)', 'NPS Score (Numeric)', 'NPS Category (Text)', 'Expectation 1 (Numeric)', 'Exp 1 rating (Text)', 'Expectation 2 (Numeric)', 'Exp 2 rating (Text)', 'Expectation 3 (Numeric)', 'Exp 3 rating (Text)',
          'You are very satisfied with your experience with Emids (Numeric)', 'You will definitely choose Emids for your future requirements (Numeric)', 'You believe that Emids delivers the best business value for your money (Numeric)',
          'Relationship management (business understanding, stakeholder mgmt., customer centricity) (Numeric)', 'Resource management (availability of key resources, managing transition, knowledge transfer) (Numeric)',
          'Quality of resources (knowledge, personnel, technical expertise) (Numeric)', 'Execution excellence (program/project management, governance, coordination of multiple groups) (Numeric)',
          'Delivering on project/program KPIs (SLA, Scope, Budget, Timelines) (Numeric)', 'Automation efforts to increase productivity/ efficiencies (Numeric)', 'Quality of deliverables (Numeric)',
          'Leveraging agile/ DevOps to increase pace of deployment (Numeric)', 'Emids has a strong understanding of your industry / domain (Numeric)',
          'Emids showcases the right technology solutions that are contextual to your business needs (Numeric)', 'Emids demonstrates the ability to own & deliver end to end programs (Numeric)', 'Emids adopts a consultative approach in crafting the right solutions for your needs (Numeric)', 'Emids actively brings ideas / suggestions to enhance your program outcomes (Numeric)',
          'Emids proactively engages in discussions beyond the contract ( on strategic inputs, future roadmap, and thought leadership) (Numeric)', 'Comp1 (Text)', 'Reason1 (Text)', 'Comp2 (Text)',
          'Reason2 (Text)', 'Comp3 (Text)', 'Reason3 (Text)', 'What in your opinion differentiates Emids from other similar service providers? (Text)', 'What are the areas you wish Emids could strengthen further? (Text)',
          'BusinessPriorities1 (Text)', 'BusinessPriorities2 (Text)', 'BusinessPriorities3 (Text)', 'EmidsHelp1 (Text)', 'EmidsHelp2 (Text)', 'EmidsHelp3 (Text)',
          'OrgWide Capabilities - Generative AI', 'OrgWide Capabilities - Product Strategy, Design & Engineering', 'OrgWide Capabilities - Design-Led engineering', 'OrgWide Capabilities - Modernization (Cloud migration and optimization)', 'OrgWide Capabilities - Data Engineering (DI, DQ, DS)', 'OrgWide Capabilities - Interoperability',
          'OrgWide Capabilities - Automation', 'Platform implementation - Healthcare core platforms, Emids data platforms', 'HC Domain Capabilities - Care Management', 'HC Domain Capabilities - Population Health', 'HC Domain Capabilities - Member Experience', 'HC Domain Capabilities - Revenue Cycle Management', 'HC Domain Capabilities - Payment Integrity',
          'HC Domain Capabilities - Claims Management', 'HC Domain Capabilities - PBM', 'HC Domain Capabilities - Clinical Trials'
        ]
        this.excelservice.exportAsExcelFile('CSAT', '', columns, Data, 'CSAT', 'CSAT');
      });
    } catch (error) {
      console.error('Error downloading Excel file:', error);
    }
  }

  openViewDialog(rowData: any): void {
    const dialogConfig = {
      position: { top: '70px' },
      data: {
        ViewData: rowData
      }
    };

    // Open the dialog with the specified configuration and pass data
    const dialogRef = this.dialog.open(ViewDetailsComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {

    });
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

  openDownloadTemplateDialog(): void {
    const dialogConfig = {
      position: { top: '70px' },
      data: {
        CycleData: this.CycleList
      }
    };

    // Open the dialog with the specified configuration and pass data
    const dialogRef = this.dialog.open(DownloadTemplateComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {

    });
  }

  formatWithSpaces(value: string): string {
    return value ? value.replace(/,/g, ', ') : value;
  }

  GetTemplateDetails() {
    // Subscribe to the observable returned by your API service to get the data
    const userData = JSON.parse(sessionStorage.getItem('userDetail'));
    const empEmidsId = userData.EmployeeId;
    const cycle = "";
    this.customerSatisfactionScoreService.GetTemplateDetails(empEmidsId, cycle).subscribe((response: any) => {
      if (response) {
        this.filterTemplateData = response;
      }
    }, (error: any) => {
      this.toastService.showError(error, 'Error');
    })
  }

  get projectDropdownList() {
    return this.filteredProjectList.length > 0 ? this.filteredProjectList : this.ProjectList;
  }

  openViewRespondentDialog(): void {
    // const dialogConfig = {
    //   position: { top: '70px' },     
    // };

    // // Open the dialog with the specified configuration and pass data
    // const dialogRef = this.dialog.open(ViewRespondentComponent, dialogConfig);
    // dialogRef.afterClosed().subscribe(result => {

    // });
    this.router.navigate(['add-edit-CSAT']);
  }

  onTableDataChange(event: any) {
    this.offset = event;
    this.page = this.offset;
    this.isPageChanged = this.page === 1 ? false : true;
    this.configureRequest();
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
    this.GetCSATUploadData();
  }

  onTableSizeChange(event: any): void {
    this.limit = event;
    this.offset = 1;
    this.page = this.offset;
    this.isPageChanged = this.page === 1 ? false : true;
    this.configureRequest();
  }
}

