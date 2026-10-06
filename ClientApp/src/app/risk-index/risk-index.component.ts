import { Component, OnInit,ElementRef } from '@angular/core';
import { Injectable } from '@angular/core';
import {RiskIndexService} from './risk-index.service'
import {CustomerValueAddService} from '../customer-value-add/customer-value-add.service'
import { ToastService } from 'src/app/common/toast/toast.service';



interface TableData {
 riskFactorId: string;
 parameterId: number;
 params: string;
 name?: string;
 status?: number;
 choosenParameterScore?: number;
 parameterExplanation: string;
 Applicability?: string;
 score?: number;
}
enum RiskFactorId {
 Contract = 1,
 ScopeAndRequirements = 2,
 Complexity = 3,
 Capacity = 4,
 Customer = 5,
 DeliveryProcess = 6,
}

@Component({
 selector: 'app-risk-index',
 templateUrl: './risk-index.component.html',
 styleUrls: ['./risk-index.component.scss']
})

export class RiskIndexComponent implements OnInit {

 accountList: any;
 ProjectList: any;
 selectedObject: any = { "AccountId": -1, "ProjectId": -1, "Studio": "-1", "serviceArea": -1, "statusId": -1 };
 selectedAccount: any;
 isDropdownOpen: boolean = false;
 showSearchButtonHighlight: boolean = false;
 activeIndex: number = 0;


 tab1Data: TableData[] = [];
 tab2Data: TableData[] = [];
 tab3Data: TableData[] = [];
 tab4Data: TableData[] = [];
 tab5Data: TableData[] = [];
 tab6Data: TableData[] = [];

 applicabilitydropDown = [
 { label: 'No', value: '0' },
 { label: 'Yes', value: '1' },
 { label: 'NA', value: '-1' }
 ];

 constructor(
  private riskIndexService: RiskIndexService,
  public customervalueaddservice: CustomerValueAddService,
  private toastService: ToastService,
  private el: ElementRef
 ) { }


 ngOnInit(): void {
  this.getAllAccountList();
 }

 fetchRiskIndexDetails(): void {
  const requestBody = {
   accountId: this.selectedObject.AccountId,
   projectId: this.selectedObject.ProjectId
   };
   console.log("RequestBody",requestBody)
  this.riskIndexService.getProjectRiskIndexDetails(requestBody).subscribe((data: any[]) => {
   this.groupDataByRiskFactor(data);
  });
 }
 private clearTableData(): void {
  this.tab1Data = [];
  this.tab2Data = [];
  this.tab3Data = [];
  this.tab4Data = [];
  this.tab5Data = [];
  this.tab6Data = [];
}
 private groupDataByRiskFactor(data: any[]): void {
  this.tab1Data = [];
  this.tab2Data = [];
  this.tab3Data = [];
  this.tab4Data = [];
  this.tab5Data = [];
  this.tab6Data = [];

  data.forEach(item => {
    const initialApplicability = item.applicability ? item.applicability.toString() : null;
   const formattedItem = {
    parameterId: item.parameterId,
    params: item.parameterText,
    Applicability: initialApplicability,
    score: item.choosenParameterScore,
    parameterExplanation: item.parameterExplanation,
    riskFactorId: item.riskFactorId
   };

   switch (item.riskFactorId) {
    case RiskFactorId.Contract:
     this.tab1Data.push(formattedItem);
     break;
    case RiskFactorId.ScopeAndRequirements:
     this.tab2Data.push(formattedItem);
     break;
    case RiskFactorId.Complexity:
     this.tab3Data.push(formattedItem);
     break;
    case RiskFactorId.Capacity:
     this.tab4Data.push(formattedItem);
     break;
    case RiskFactorId.Customer:
     this.tab5Data.push(formattedItem);
     break;
    case RiskFactorId.DeliveryProcess:
     this.tab6Data.push(formattedItem);
     break;
   }
  });
 }

 getAllAccountList() {
  const userData = JSON.parse(sessionStorage.getItem('userDetail'));
  const empEmidsId = userData.EmployeeId
  this.customervalueaddservice.GetAccountsList(empEmidsId).subscribe((response: any) => {
   if (response) {
    this.accountList = response;
    if (this.accountList.length > 0) {
     this.selectedObject.AccountId = this.accountList[0].mastCustID;
     this.getAllProjectList();
    }
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
    if (this.ProjectList.length > 0) {
     this.selectedObject.ProjectId = this.ProjectList[0].projectId;
     this.fetchRiskIndexDetails();
    }
   }
  }, (error: any) => {
   this.toastService.showError(error, 'Error');
  })
 }
 clearSelection() {
  this.selectedAccount = null;
 }
 onSelectDropdown(event: any,dropdownType: string): void {
  const target = event.target as HTMLSelectElement;
  const value = target.value;
  this.selectedObject.AccountId = parseInt(value);
  this.getProjectList();
  this.clearTableData()
  this.showSearchButtonHighlight = true; 
 }
 onSelectProject(event: any,dropdownType: string): void{
  const target = event.target as HTMLSelectElement;
  const value = target.value;
  this.selectedObject.ProjectId = parseInt(value);
  this.clearTableData()
  this.showSearchButtonHighlight = true;
 }
 searchData(): void {
  if (this.showSearchButtonHighlight) {
    this.fetchRiskIndexDetails();
    this.showSearchButtonHighlight = false; 
  }
 }
 getProjectList() {
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
 submitData(): void {
  const allTableData = [
    ...this.tab1Data,
    ...this.tab2Data,
    ...this.tab3Data,
    ...this.tab4Data,
    ...this.tab5Data,
    ...this.tab6Data
  ];


  const requestBody = allTableData.map(item => ({
    accountId: this.selectedObject.AccountId,
    projectId: this.selectedObject.ProjectId,
    parameterId: item.parameterId,
    riskFactorId:item.riskFactorId,
    applicability: parseInt(item.Applicability, 10) 
  }));

  console.log("Submitting data:", requestBody);
  this.riskIndexService.addRiskIndexDetails(requestBody).subscribe(
    (response: any) => {
      this.toastService.showSuccess('Data submitted successfully!', 'Success');
      console.log('Submission successful:', response);
    },
    (error: any) => {
      this.toastService.showError('Failed to submit data.', 'Error');
      console.error('Submission failed:', error);
    }
  );
}
onDropdownChange(item: TableData): void {
  if (item.Applicability === '1') {
    item.score = 1;
  } else if (item.Applicability === '-1') {
    item.score = 0;
  } else {
    item.score = 0;
  }
  console.log(`Dropdown for parameter ${item.parameterId} changed. New score: ${item.score}`);
}
prevTab(): void {
    if (this.activeIndex > 0) {
      this.activeIndex--;
      this.scrollToTop();
    }
  }
  
  nextTab(): void {
    const totalTabs = 6;
    if (this.activeIndex < totalTabs - 1) {
      this.activeIndex++;
      this.scrollToTop();
    }
  }
  
  isBackDisabled(): boolean {
    return this.activeIndex === 0;
  }
  
  isNextDisabled(): boolean {
    const totalTabs = 6;
    return this.activeIndex === totalTabs - 1;
  }
  
  scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

}


