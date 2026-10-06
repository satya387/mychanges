import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { OpportunityRlsExpenseService } from '../opportunity-rls-expense.service';
import {
  IdValue,
  OpportunityData,
  OpportunityWiseBusiness,
} from '../opportunity-rls-expense-model';
import { Console } from 'console';

@Component({
  selector: 'app-opportunity',
  templateUrl: './opportunity.component.html',
  styleUrls: ['./opportunity.component.scss'],
})
export class OpportunityComponent implements OnInit {
  selectedOpportunity: any | undefined;
  searchText = '';
  selectedOpportunityId: string;
  selectedOpportunityValue: string;
  discountEnabled: boolean = false;
  opportunityWiseBusiness: OpportunityWiseBusiness = {
    revenue: null,
    expense: null,
    margin: null,
    marginPercentage: null,
    discountAmount: null,
    discountPercentage: null,
    discountedRevenue: null,
    discountedMargin: null,
    discountedMarginPercentage: null,
    contingencyPercentage: null
  };
  opportunities = [];
  opportunityData: OpportunityData = {
    CP: '',
    BU: '',
    clientName: '',
    clientMarginPlan: '',
    engagementType: '',
    projectType: '',
    pricingMethodology: '',
    projectStart: '',
    projectEnd: '',
    termInMonths: '',
    creditRating: '',
    opportunityId: '',
    name: '',
    id: null,
    DP: '',
    CPMailId: '',
    DPMailId: '',
    status: null,
    accountId: '',
    amountTCV: null,
    nextYearACV: null,
    nextYearWACV: null,
    thisYearACV: null,
    thisYearWacv: null,
    resourcesOffShore: null,
    resourcesOnsite: null,
    revisedStartDate: '',
    revisedTCV: null,
    RejectedBy: '',
    RejectedComments: '',
    parentOpportunityId: '',
    practice: '',
    probability: null,
    projectID: null,
    projectName: '',
    opportunityStage: null,
    ApprovedBy: '',
    ApprovedComments: '',
    confidenceLevel: '',
    entity: '',
    IsBillable : '',
    IsPartialAllocation : '',
    ironcladId:'',
    versionNumber:''
  };
  editData: any;
  isDisabled: boolean = false;
  opportunitiesToBefilter: any;
  discountRevenue: any;
  discountedMargin: any;
  disountedMarginPercentage: any;
  isDiscountAvailable: boolean = false;
  isAdmin: boolean = false;
  public versionName: string = '';
  userAccess : any;
  ICDLEdit: any;
  ironcladError: boolean = false;
  isSubmitActive:boolean = false;
  selected:boolean = true;
  isEditable:boolean = true;

  constructor(private oppRlsExpService: OpportunityRlsExpenseService) { }

  ngOnInit(): void {
    this.oppRlsExpService.getRLSAccessByEmpemidsId().subscribe((res) => {
      this.userAccess = res?.accessType;
      console.log(this.userAccess);
      this.oppRlsExpService.setUserAccess(this.userAccess);
    });
    this.oppRlsExpService.isSubmitActive$.subscribe(value => {
      this.isSubmitActive = value;
    });
    let empMailId = JSON.parse(
      sessionStorage.getItem('userDetail')
    ).EmpFullEmailId;
    this.oppRlsExpService.userAccessData$.subscribe((data) => {
      this.isAdmin = data == 'Admin';
    })
    this.oppRlsExpService.editOpportunityData$.subscribe((data) => {
      this.editData = { id: data?.opportunityId, value: data?.opportunityName, idForEdit: data?.id, displayLabel: `${data?.opportunityName} || ${data?.opportunityId}`};
      if (this.editData?.id) {
        this.opportunities = [this.editData];
        this.selectedOpportunity = this.opportunities[0];
        this.isDisabled = true;
        this.onSelect(this.opportunities[0]);
      }
    });
    this.oppRlsExpService.opportunitiesToBeFilteredData$.subscribe(
      (data) => (this.opportunitiesToBefilter = data)
    );

    this.oppRlsExpService.opportunityWiseMarginData$.subscribe((data) => {
      if (data) {
        this.isDiscountAvailable = data.discountPercentage > 0 ? true : false;
        this.opportunityWiseBusiness = {
          revenue: this.convertToMillions(data?.revenue),
          expense: this.convertToMillions(data?.expense),
          margin: this.convertToMillions(data?.revenue - data?.expense),
          marginPercentage: data?.marginPercentage,
          discountAmount: data?.discountAmount ?? 0,
          discountPercentage: data?.discountPercentage,
          discountedMargin: this.convertToMillions(data?.discountedMargin),
          discountedMarginPercentage: data?.discountedMarginPercentage,
          discountedRevenue: this.convertToMillions(data?.discountedRevenue),
          contingencyPercentage: data?.contingencyPercentage
        };
      } else {
        this.opportunityWiseBusiness = {
          revenue: '0M',
          expense: '0M',
          margin: '0M',
          marginPercentage: 0,
          discountAmount: 0,
          discountPercentage: 0,
          discountedMargin: '0M',
          discountedMarginPercentage: 0,
          discountedRevenue: '0M',
          contingencyPercentage: 0
        };
      }
    });
    if (!this.editData?.id) {
      this.oppRlsExpService
        .getAllOpportunity(empMailId, this.isAdmin)
        .subscribe((res: any) => {
          this.opportunities = res;
          if (this.opportunitiesToBefilter != undefined) {
            this.opportunitiesToBefilter.forEach((filterItem: any) => {
              this.opportunities = this.opportunities.filter(
                (opportunity) => opportunity.id !== filterItem.opportunityId
              ).map(opportunity => ({
                ...opportunity,
                displayLabel: `${opportunity.value} || ${opportunity.id}`
              }));
            });
          }
          else{
            this.opportunities = this.opportunities.map(opportunity => ({
              ...opportunity,
              displayLabel: `${opportunity.value} || ${opportunity.id}`
            }));
          }
        });
    }
  }


  compareOpportunities(opportunity1: any, opportunity2: any): boolean {
    return opportunity1 && opportunity2
      ? opportunity1.id === opportunity2.opportunityId
      : opportunity1 === opportunity2;
  }

  onSelect(selectedOpportunityId: any) {
    this.selected == true;
    this.oppRlsExpService.updateSelectedOpportunity(this.selectedOpportunity);
    this.selectedOpportunityId = selectedOpportunityId?.id;
    this.selectedOpportunityValue = selectedOpportunityId?.value;

    if (!selectedOpportunityId) {
      this.oppRlsExpService.setRLSData(null);
      this.oppRlsExpService.setExpenseData(null);
    } else {
      if (!this.editData?.id) {
        this.oppRlsExpService
          .getOpportunityById(selectedOpportunityId.id)
          .subscribe((res: any) => {
            this.selectedOpportunity = res;
            this.updateOpportunityData();
            this.versionName = this.selectedOpportunity?.name + '_V1';
            
          });
      }
      else {
        let editOpportunityObject = {
          opportunityId: selectedOpportunityId.id,
          id: selectedOpportunityId?.idForEdit ?? 0
        }
        this.oppRlsExpService
          .getOpportunityAndRLSDetails(editOpportunityObject)
          .subscribe((res: any) => {
            console.log('resonedit',res)
            if (this.editData?.id) {
              this.selectedOpportunity = res.opportunity;
              this.updateOpportunityData();
            }
            this.oppRlsExpService.setRLSData(res);
            this.oppRlsExpService.setExpenseData(res);
            this.oppRlsExpService.updateOpportunityWiseMarginData(
              res?.opportunityWiseMargin
            );
            this.versionName = res.opportunity?.versionName ?? this.selectedOpportunity?.name + '_V1' ?? '';
            if (
              res?.opportunity?.status == 3 ||
              this.userAccess == 'FP_and_A' ||
              (this.userAccess == 'CP_DP' && res?.opportunity?.status == 2) ||
              (this.userAccess == 'CP_DP' && res?.opportunity?.status == 3)
            ) {
              this.isEditable = false;
            } else this.isEditable = true;
            if (this.userAccess == 'Admin') this.isEditable = true;
          });
      }
    }
    if (this.selectedOpportunity == null)
      this.versionName = '';

  }

  convertToMillions(value: number): string {
    if (value) return (value / 1000000).toFixed(2) + 'M';
    else if (value == 0) return value + 'M';
  }

  updateOpportunityData() {
    if (this.selectedOpportunity) {
      this.opportunityData = {
        CP: this.selectedOpportunity.cp,
        BU: this.selectedOpportunity.bu,
        clientName: this.selectedOpportunity.clientName,
        clientMarginPlan: this.selectedOpportunity.clientMarginPlan,
        engagementType: this.selectedOpportunity.engagementType,
        projectType: this.selectedOpportunity.projectType,
        pricingMethodology: this.selectedOpportunity.pricingMethodology,
        projectStart: this.selectedOpportunity.projectStart,
        projectEnd: this.selectedOpportunity.projectEnd,
        termInMonths: this.selectedOpportunity.termsInMonths,
        creditRating: this.selectedOpportunity.creditRating,
        opportunityId: this.selectedOpportunityId,
        name: this.selectedOpportunityValue,
        id: this.selectedOpportunity.id,
        DP: this.selectedOpportunity.dp,
        DPMailId: this.selectedOpportunity.dpMailId,
        accountId: this.selectedOpportunity.accountId,
        amountTCV: this.selectedOpportunity.amountTCV,
        ApprovedBy: this.selectedOpportunity.approvedBy,
        ApprovedComments: this.selectedOpportunity.approvedComments,
        confidenceLevel: this.selectedOpportunity.confidenceLevel,
        CPMailId: this.selectedOpportunity.cpMailId,
        entity: this.selectedOpportunity.entity,
        nextYearACV: this.selectedOpportunity.nextYearACV,
        nextYearWACV: this.selectedOpportunity.nextYearWACV,
        opportunityStage: this.selectedOpportunity.opportunityStage,
        parentOpportunityId: this.selectedOpportunity.parentOpportunityId,
        practice: this.selectedOpportunity.practice,
        probability: this.selectedOpportunity.probability,
        projectName: this.selectedOpportunity.projectName,
        projectID: this.selectedOpportunity.projectID,
        RejectedBy: this.selectedOpportunity.rejectedBy,
        RejectedComments: this.selectedOpportunity.rejectedComments,
        resourcesOffShore: this.selectedOpportunity.resourcesOffShore,
        resourcesOnsite: this.selectedOpportunity.resourcesOnsite,
        revisedStartDate: this.selectedOpportunity.revisedStartDate,
        revisedTCV: this.selectedOpportunity.revisedTCV,
        status: this.selectedOpportunity.status,
        thisYearACV: this.selectedOpportunity.thisYearACV,
        thisYearWacv: this.selectedOpportunity.thisYearWacv,
        IsBillable : this.selectedOpportunity.isBillable,
        IsPartialAllocation : this.selectedOpportunity.isPartialAllocation,
        ironcladId:this.selectedOpportunity.ironcladId,
        versionNumber:''
      };
      this.oppRlsExpService.updateOpportunityData(this.opportunityData);
    }
  }
  updateIronclad(value: string) {
    this.opportunityData.ironcladId = value;
    
    this.oppRlsExpService.updateOpportunityData(this.opportunityData);
  }
}
