import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { OpportunityRlsExpenseService } from '../opportunity-rls-expense.service';
import {
  ExpenseInputBindingModel,
  OpportunityData,
} from '../opportunity-rls-expense-model';
import { ExpensePopupComponent } from '../expense-popup/expense-popup.component';
import { ToastService } from 'src/app/common/toast/toast.service';

@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.scss'],
})
export class ExpenseComponent implements OnInit {
  opportunityData: OpportunityData;
  expenseData: any;
  expenseDetailsData: any;
  isEditable: boolean = true;
  userAccess: any;
  showDeleteConfirm: boolean = false;
  expenseToDelete: any = null;
  isAddDisabled: any;
  showExpenseData: any;

  constructor(
    private dialog: MatDialog,
    private oppRlsExpService: OpportunityRlsExpenseService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.oppRlsExpService.userAccessData$.subscribe(
      (data) => (this.userAccess = data)
    );

    this.oppRlsExpService.opportunityData$.subscribe(
      (data) => (this.opportunityData = data)
    );
    this.oppRlsExpService.expenseData$.subscribe((data) => {
      this.expenseData = data;
      if(this.expenseData?.rLSExpenses?.length > 0)
        this.showExpenseData = true;
      else
      this.showExpenseData = false;

       if (data?.opportunity == null || data?.rLSDetails?.length == 0)
          this.isAddDisabled = true;
        else
        this.isAddDisabled = false
      if (
        data?.opportunity?.status == 3 ||
        this.userAccess == 'FP_and_A' ||
        (this.userAccess == 'CP_DP' && data?.opportunity?.status == 2) ||
        (this.userAccess == 'CP_DP' && data?.opportunity?.status == 3)
      ) {
        this.isEditable = false;
      } else this.isEditable = true;
      if (this.userAccess == 'Admin') this.isEditable = true;
      if (data?.opportunity?.status == 1 || data?.opportunity?.status == 4) {
        this.isEditable = true;
      }
      else{
        this.isEditable = false;
      }
    });
  }

  openExpensePopup(expense?: any): void {
    let selectionObject: ExpenseInputBindingModel = {
      startDate: null,
      endDate: null,
      shiftType: '',
      location: '',
      role: '',
      technology: '',
      experience: '',
      opportunityId: null,
      expenseCatogory: '',
      billType: null,
    };
    if (expense) {
      selectionObject.expenseCatogory = expense?.expenseCategory;
      selectionObject.opportunityId = expense?.opportunity_Details_Id;
      selectionObject.billType = expense?.billType;
      selectionObject.location = expense?.location;
      this.oppRlsExpService
        .getRLSExpensesById(selectionObject)
        .subscribe((res: any) => {
          if (this.opportunityData.opportunityId) {
            this.expenseDetailsData = {
              expense: expense?.expenseCategory,
              billType: expense?.billType,
              monthlyExpense: res,
              location: expense?.location,
            };
            this.dialog.open(ExpensePopupComponent, {
              width: '95vw',
              data: { expense: this.expenseDetailsData },
              maxWidth: '95vw',
              maxHeight: '90vh',
              panelClass: 'dialog-container',
            });
          }
        });
    } else {
      if (!this.isAddDisabled) {
        this.dialog.open(ExpensePopupComponent, {
          width: '95vw',
          data: { expense: null },
          maxWidth: '95vw',
          maxHeight: '90vh',
          panelClass: 'dialog-container',
        });
      }
    }
  }

  deleteExpense(event: any): void {
    this.expenseToDelete = event; // Store the role to delete
    this.showDeleteConfirm = true; // Open the confirmation modal
    // this.oppRlsExpService.deleteRLSExpenseById(event).subscribe((res) => {
    //   this.toastService.showSuccess(res.message, 'Success');
    //   this.oppRlsExpService
    //     .getOpportunityAndRLSDetails(this.opportunityData.opportunityId)
    //     .subscribe((res: any) => {
    //       this.oppRlsExpService.setExpenseData(res);
    //       this.oppRlsExpService.updateOpportunityWiseMarginData(
    //         res?.opportunityWiseMargin
    //       );
    //     });
    // });
  }

  confirmDelete() {
    if (this.expenseToDelete) {
      this.oppRlsExpService
        .deleteRLSExpenseById(this.expenseToDelete)
        .subscribe((res) => {
          this.toastService.showSuccess(res.message, 'Success');
          let editOpportunityObject = {
            opportunityId: this.opportunityData.opportunityId,
            id: this.expenseData.opportunity.id ?? 0
          }
          this.oppRlsExpService
            .getOpportunityAndRLSDetails(editOpportunityObject)
            .subscribe((res: any) => {
              this.oppRlsExpService.setExpenseData(res);
              this.oppRlsExpService.setRLSData(res);
              this.oppRlsExpService.updateOpportunityWiseMarginData(
                res?.opportunityWiseMargin
              );
            });
        });
    }
    this.showDeleteConfirm = false;
    this.expenseToDelete = null;
  }

  cancelDelete() {
    this.showDeleteConfirm = false;
    this.expenseToDelete = null;
  }
}
