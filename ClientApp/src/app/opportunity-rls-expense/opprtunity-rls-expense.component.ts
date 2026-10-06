import { Component, OnInit } from '@angular/core';
import { OpportunityRlsExpenseService } from './opportunity-rls-expense.service';
import { ToastService } from '../common/toast/toast.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-opprtunity-rls-expense',
  templateUrl: './opprtunity-rls-expense.component.html',
  styleUrls: ['./opprtunity-rls-expense.component.scss'],
})
export class OpprtunityRlsExpenseComponent implements OnInit {
  createPageValue: boolean = false;
  opportunityValue: any;
  isSubmitActive: boolean = false;
  userAccess: any;
  showSubmitConfirm: boolean = false;
  isDiscountModalOpen = false;
  selectedDiscountType: string = 'Flat';
  selectedDiscountPercentage: number;
  opportunityId: number;
  isDiscountFresh: boolean = true;
  showTooltip = false;
  isDiscountEditable: boolean = false;
  showGraphDashboard: boolean = false;
  rlsDataOpportunity: any;
  selectedContingencyPercentage: any;
  isContingencySaveEnabled: boolean = true;
  contingencyEnabled: boolean = false;
  isDiscountActive: boolean = false;
  isContingencyModalOpen: boolean = false;
  contingencyDataObject: any;
  ironcladError: boolean = false;

  constructor(
    private oppRlsExpService: OpportunityRlsExpenseService,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    this.oppRlsExpService.getRLSAccessByEmpemidsId().subscribe((res) => {
      this.userAccess = res?.accessType;
      console.log(this.userAccess);
      this.oppRlsExpService.setUserAccess(this.userAccess);
    });
    this.oppRlsExpService.isGraphDashboardUpData$.subscribe(
      (data) => (this.showGraphDashboard = data)
    );

    this.oppRlsExpService.createPageValue$.subscribe((data) => {
      this.createPageValue = data;
    });

    this.oppRlsExpService.rlsData$.subscribe((data: any) => {
      this.rlsDataOpportunity = data;
      this.isDiscountEditable =
        data?.opportunity?.status == 1 ||
        data?.opportunity?.status == 4 ||
        this.userAccess == 'Admin';
      if (data?.opportunity?.status == 4 && this.userAccess == 'FP_and_A')
        this.isDiscountEditable = false;
      if (data?.opportunityWiseMargin?.discountPercentage > 0) {
        this.isDiscountFresh = false;
        this.selectedDiscountPercentage =
          data.opportunityWiseMargin.discountPercentage;
        this.selectedDiscountType = data.opportunityWiseMargin.discountType;
      } else {
        this.isDiscountFresh = true;
        this.selectedDiscountPercentage = 0;
      }
      this.selectedContingencyPercentage = data?.opportunityWiseMargin?.contingencyPercentage;
      if (data?.rLSDetails?.length > 0)
        this.contingencyEnabled = true;
      else
        this.contingencyEnabled = false;
      this.opportunityId = data?.opportunity?.id;
      if (
        data?.opportunity?.status == 7 ||
        data?.opportunity?.status == 6 ||
        data?.opportunity?.status == 5 ||
        data?.opportunity?.status == 3 ||
        data?.opportunity?.status == 2 ||
        this.userAccess == 'FP_and_A'
      )
        this.isSubmitActive = false;
      else if (
        data?.opportunity != null &&
        (data?.rLSDetails.length > 0)
      )
        this.oppRlsExpService.updateIsSubmitActive(this.isSubmitActive),
        this.isSubmitActive = true;
      else this.isSubmitActive = false;

      if (
        data?.opportunity?.status == 7 ||
        data?.opportunity?.status == 6 ||
        data?.opportunity?.status == 5 ||
        data?.opportunity?.status == 3 ||
        data?.opportunity?.status == 2 ||
        this.userAccess == 'FP_and_A' ||
        (this.userAccess == 'CP_DP' && data?.opportunity?.status == 2) ||
        (this.userAccess == 'CP_DP' && data?.opportunity?.status == 3)
      ) {
        this.isContingencySaveEnabled = false;
      } else this.isContingencySaveEnabled = true;
      if (this.userAccess == 'Admin') { this.isContingencySaveEnabled = true; }
      if (this.userAccess == 'Admin' && data?.rLSDetails.length > 0) { this.isDiscountActive = true; }
      else if (this.userAccess == 'CP_DP' && data?.rLSDetails.length > 0 && (data?.opportunity?.status == 1 || data?.opportunity?.status == 4)) { this.isDiscountActive = true; }
      else this.isDiscountActive = false;

      if(data?.opportunity?.status == 7 ||
        data?.opportunity?.status == 6 ||
        data?.opportunity?.status == 5 ||
        data?.opportunity?.status == 3 ||
        data?.opportunity?.status == 2) {
        this.isDiscountEditable = false;
      }
    });
    this.oppRlsExpService.opportunityData$.subscribe((data) => {
      this.opportunityValue = data;
    });

    this.oppRlsExpService.getContingencyData$.subscribe(data => this.contingencyDataObject = data);
    // this.oppRlsExpService.rlsData$.subscribe((data: any) => this.opportunityValue = data.opportunity);
  }

  // handleDiscountChange(isDiscountEnabled: string) {
  //   console.log('isdiscount ',isDiscountEnabled);
  //  this.isDiscountEnabled = isDiscountEnabled;
  //  if(this.isDiscountEnabled == 'open')
  //  this.openDiscountModal();
  // }
  toggleTooltip() {
    this.showTooltip = !this.showTooltip;
  }

  goBack() {
    this.oppRlsExpService.updateOpportunityData(null);
    this.oppRlsExpService.updategoToCreatePageValue(false);
    this.oppRlsExpService.updateEditOpportunityData(null);
    this.oppRlsExpService.setRLSData(null);
    this.oppRlsExpService.setExpenseData(null);
    this.oppRlsExpService.setisGraphDashboardUpValue(false);
  }

  submitForApproval() {
    this.showSubmitConfirm = true;
  }

  openDiscountModal() {
    this.isDiscountModalOpen = true;
  }

  openContingencyModal(){
    this.isContingencyModalOpen = true;
  }

  preventKeys(event: any) {
    if (event.keyCode === 69 || event.keyCode === 107 || event.keyCode === 109 || event.keyCode === 189 || this.selectedDiscountPercentage < 0) {
      this.selectedDiscountPercentage = 0;
      event.stopPropagation();
      return false;
    }
    if (event.keyCode === 69 || event.keyCode === 107 || event.keyCode === 109 || event.keyCode === 189 || this.selectedContingencyPercentage < 0) {
      this.selectedContingencyPercentage = 0;
      event.stopPropagation();
      return false;
    }
  }

  preventPaste(event: ClipboardEvent) {
    event.preventDefault();
  }

  closeDiscountModal() {
    this.isDiscountModalOpen = false;
    let editOpportunityObject = {
      opportunityId: this.opportunityValue.opportunityId,
      id: this.opportunityId ?? 0
    }
    this.oppRlsExpService
      .getOpportunityAndRLSDetails(editOpportunityObject)
      .subscribe((res: any) => {
        this.oppRlsExpService.setRLSData(res);
        this.oppRlsExpService.setExpenseData(res);
        this.oppRlsExpService.updateOpportunityWiseMarginData(
          res?.opportunityWiseMargin
        );
      });
  }

  closeContingencyModal(): void {
    let editOpportunityObject = {
      opportunityId: this.opportunityValue.opportunityId,
      id: this.opportunityId ?? 0
    }
    this.oppRlsExpService
      .getOpportunityAndRLSDetails(editOpportunityObject)
      .subscribe((res: any) => {
        this.oppRlsExpService.setRLSData(res);
        this.oppRlsExpService.setExpenseData(res);
        this.oppRlsExpService.updateOpportunityWiseMarginData(
          res?.opportunityWiseMargin
        );
      });
    this.isContingencyModalOpen = false;
  }

  saveContingencyModal(){
    // console.log(this.contingencyDataObject);
    this.oppRlsExpService.saveCostRateContingencyData(this.contingencyDataObject).subscribe(data=> {
      this.isContingencyModalOpen = false;
      this.toastService.showSuccess('Data Saved', 'Success');
      let editOpportunityObject = {
        opportunityId: this.opportunityValue.opportunityId,
        id: this.opportunityId ?? 0
      }
      this.oppRlsExpService
        .getOpportunityAndRLSDetails(editOpportunityObject)
        .subscribe((res: any) => {
          this.oppRlsExpService.setRLSData(res);
          this.oppRlsExpService.setExpenseData(res);
          this.oppRlsExpService.updateOpportunityWiseMarginData(
            res?.opportunityWiseMargin
          );
        });
    })
  }

  saveContingencyPercent() {
    let contingencyObject = {
      opportunityId: this.opportunityId,
      contingencyPercentage: this.selectedContingencyPercentage
    }
    this.oppRlsExpService.saveContingencyPercentage(contingencyObject).subscribe((data: any) => {
      console.log(data);
      this.toastService.showSuccess('Contingency Percentage Saved', 'Success');
      let editOpportunityObject = {
        opportunityId: this.opportunityValue.opportunityId,
        id: this.opportunityId ?? 0
      }
      this.oppRlsExpService
        .getOpportunityAndRLSDetails(editOpportunityObject)
        .subscribe((res: any) => {
          this.oppRlsExpService.setRLSData(res);
          this.oppRlsExpService.setExpenseData(res);
          this.oppRlsExpService.updateOpportunityWiseMarginData(
            res?.opportunityWiseMargin
          );
        });
    });
  }

  applyDiscount() {
    let discountObject = {
      opportunityId: this.opportunityId,
      discountPercentage: this.selectedDiscountPercentage,
      discountType: this.selectedDiscountType,
    };
    this.oppRlsExpService
      .saveOpportunityDiscount(discountObject)
      .subscribe((data) => {
        this.toastService.showSuccess('Discount Applied', 'Success', 500000);
        this.isDiscountFresh = false;
        this.closeDiscountModal();
        let editOpportunityObject = {
          opportunityId: this.opportunityValue.opportunityId,
          id: this.opportunityId ?? 0
        }
        this.oppRlsExpService
          .getOpportunityAndRLSDetails(editOpportunityObject)
          .subscribe((res: any) => {
            this.oppRlsExpService.updateOpportunityWiseMarginData(
              res?.opportunityWiseMargin
            );
          });
      });
  }

  confirmSubmit() {
    if (!this.opportunityValue?.ironcladId || 
      this.opportunityValue.ironcladId.trim() === '') {

    this.ironcladError = true; 

    this.toastService.showError(
      'Ironclad Id is mandatory before submission',
      'Validation Error'
    );

    return; 
  }
  this.ironcladError = false;
    let editOpportunityObject = {
      opportunityId: this.opportunityValue?.opportunityId,
      id: this.opportunityId ?? 0
    }
    this.oppRlsExpService
      .getOpportunityAndRLSDetails(editOpportunityObject)
      .subscribe((data) => {
        let submitOpportunityObject = {
          id: data.opportunity.id,
          ironcladId: this.opportunityValue?.ironcladId,
          isSubmitForApporval: true,
        };
        this.oppRlsExpService
          .approveRejectOpportunity(submitOpportunityObject)
          .subscribe(
            (response) => {
              console.log('Approved', response);
              this.toastService.showSuccess(response.message, 'Success');
              this.goBack();
            },
            (error) => console.error('Error:', error)
          );
      });
    this.showSubmitConfirm = false;
  }

  cancelSubmit() {
    this.showSubmitConfirm = false;
  }
}
