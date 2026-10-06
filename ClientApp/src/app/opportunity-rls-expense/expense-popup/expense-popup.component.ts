import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { OpportunityRlsExpenseService } from '../opportunity-rls-expense.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  ExpenseDetail,
  IdValue,
  OpportunityData,
} from '../opportunity-rls-expense-model';
import { ToastService } from 'src/app/common/toast/toast.service';

@Component({
  selector: 'app-expense-popup',
  templateUrl: './expense-popup.component.html',
  styleUrls: ['./expense-popup.component.scss'],
})
export class ExpensePopupComponent implements OnInit {
  expenseType: IdValue[];
  selectedExpense: any;
  selectedBillType: any;
  selectedLocation: any;
  expenseForm: FormGroup;
  opportunityData: OpportunityData;
  resourcesAvailable: boolean = false;
  expenseDetails: ExpenseDetail[] = [];
  actualExpenseDetails: ExpenseDetail[] = [];
  expenseDetailsData: any;
  expenseData: any;
  locationType: IdValue[];
  isBillable: boolean = false;
  isAlreadyExistExpense: boolean = false;
  formSubmitted: boolean = false;
  isExpenseEdit: boolean = false;

  constructor(
    private dialog: MatDialog,
    private oppRlsExpService: OpportunityRlsExpenseService,
    private fb: FormBuilder,
    private toastService: ToastService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.expenseDetailsData = data?.expense;
  }

  ngOnInit(): void {
    this.oppRlsExpService.opportunityData$.subscribe((data) => {
      this.opportunityData = data;
      this.isExpenseEdit = data?.status == 1 || data?.status == 4 ? true: false;
      if (data?.status == 1 || data?.status == 4) {
        this.isExpenseEdit = false;
      }
      else{
        this.isExpenseEdit = true;
      }
    });

    this.oppRlsExpService.expenseData$.subscribe(
      (data) => (this.expenseData = data)
    );

    this.oppRlsExpService
      .getAllRLSExpenseCategory()
      .subscribe((res: any) => (this.expenseType = res));
    this.oppRlsExpService
      .getAllSFLocation()
      .subscribe((res: any) => (this.locationType = res));

    this.expenseForm = this.fb.group({
      expenseType: ['', Validators.required],
      billType: ['', Validators.required],
      location: ['', Validators.required],
    });
    if (this.expenseDetailsData) {
      this.populateFormWithExpenseDetailsData();
    }
  }

  populateFormWithExpenseDetailsData() {
    this.isBillable = this.expenseDetailsData.billType == 1;
    this.expenseForm.patchValue({
      expenseType: this.expenseDetailsData.expense ?? '',
      billType:
        this.expenseDetailsData?.billType >= 0
          ? this.expenseDetailsData?.billType
          : -1,
      location: this.expenseDetailsData.location ?? '',
    });

    this.generateDynamicInputs();
  }

  cancel() {
    this.dialog.closeAll();
  }

  onSubmit() {
    this.formSubmitted = true;
    if (this.expenseForm.valid) {
      let expense: any;
      if (!this.selectedExpense?.id) {
        expense = this.expenseType.filter(
          (expense) => expense.value == this.expenseDetailsData.expense
        )[0];
      }
      const combinedData = {
        id: this.expenseData?.id ?? 0,
        opportunity_Details_Id:
          this.expenseData.opportunity?.id ?? this.opportunityData.id,
        expenseType: this.selectedExpense?.id ?? expense.id,
        location: this.selectedLocation ?? this.expenseDetailsData.location,
        rLSExpenseDtos: this.actualExpenseDetails,
        billType: this.selectedBillType ?? this.expenseDetailsData.billType,
      };
      this.oppRlsExpService
        .saveRLSExpenseData(combinedData)
        .subscribe((res: any) => {
          this.dialog.closeAll();
          let editOpportunityObject = {
            opportunityId: this.opportunityData.opportunityId,
            id: this.expenseData.opportunity?.id ?? 0
          }
          this.oppRlsExpService
            .getOpportunityAndRLSDetails(editOpportunityObject)
            .subscribe((res: any) => {
              this.oppRlsExpService.setExpenseData(res);
              this.oppRlsExpService.updateOpportunityWiseMarginData(
                res?.opportunityWiseMargin
              );
              this.oppRlsExpService.updateOpportunityData(res.opportunity);
            });
        });
    } else {
      this.toastService.showError(
        'Please fill out all required fields',
        'Form Invalid'
      );
    }
  }
  onexpenseTypeChange(event: any) {
    this.selectedExpense = event.target.value;
    this.selectedExpense = this.expenseType.filter(
      (expense) => expense.value == this.selectedExpense
    )[0];
    if (
      this.selectedBillType != undefined &&
      this.selectedLocation &&
      this.selectedLocation != ''
    ) {
      this.isAlreadyExistExpense = this.expenseData.rLSExpenses.some(
        (x) =>
          x.expenseCategory == this.selectedExpense.value &&
          x.location == this.selectedLocation &&
          x.billType == this.selectedBillType
      );
      if (this.isAlreadyExistExpense)
        this.toastService.showWarning(
          'Please try editing the existing one',
          'Data already exist'
        );
    }
  }

  onBillTypeChange(event: any) {
    this.selectedBillType = event.target.value;
    if (this.selectedBillType != '')
      this.selectedBillType = parseInt(event.target.value, 10);
    this.isBillable = this.selectedBillType == 1;
    if (
      this.selectedExpense?.value != '' &&
      this.selectedLocation &&
      this.selectedLocation != ''
    ) {
      this.isAlreadyExistExpense = this.expenseData.rLSExpenses.some(
        (x) =>
          x.expenseCategory == this.selectedExpense.value &&
          x.location == this.selectedLocation &&
          x.billType == this.selectedBillType
      );
      if (this.isAlreadyExistExpense)
        this.toastService.showWarning(
          'Please try editing the existing one',
          'Data already exist'
        );
    }
    this.generateDynamicInputs();
  }

  onLocationChange(event: any) {
    this.selectedLocation = event.target.value;
    if (
      this.selectedExpense?.value != '' &&
      this.selectedBillType != undefined
    ) {
      this.isAlreadyExistExpense = this.expenseData.rLSExpenses.some(
        (x) =>
          x.expenseCategory == this.selectedExpense.value &&
          x.location == this.selectedLocation &&
          x.billType == this.selectedBillType
      );
      if (this.isAlreadyExistExpense)
        this.toastService.showWarning(
          'Please try editing the existing one',
          'Data already exist'
        );
    }
  }

  generateDynamicInputs() {
    this.resourcesAvailable = true;
    const startDate = new Date(this.opportunityData.projectStart);
    const endDate = new Date(this.opportunityData.projectEnd);
    startDate.setDate(1);
    endDate.setDate(1);

    const dynamicInputsMonthlySection = document.getElementById(
      'dynamic-inputs-section'
    );
    dynamicInputsMonthlySection.innerHTML = '';

    const dynamicInputsActualSection = document.getElementById(
      'dynamic-actual-inputs-section'
    );
    dynamicInputsActualSection.innerHTML = '';

    this.expenseDetails = [];
    let expenses: any[] = this.expenseDetailsData
      ? [...this.expenseDetailsData?.monthlyExpense]
      : [];
    let actualExpenses: any[] = this.expenseDetailsData
      ? [...this.expenseDetailsData?.monthlyExpense]
      : [];

    let i = 0;
    let expenseDetail: ExpenseDetail;
    let actualExpenseDetail: ExpenseDetail;

    for (
      let d = new Date(startDate);
      d <= endDate;
      d.setMonth(d.getMonth() + 1)
    ) {
      const monthYear = `${d.toLocaleString('default', { month: 'short' })}'${
        d.getFullYear() % 100
      }:`;

      const labelMonthly = document.createElement('label');
      labelMonthly.textContent = monthYear;
      labelMonthly.className = 'dynamic-label';

      const inputMonthly = document.createElement('input');
      inputMonthly.type = 'number';
      inputMonthly.className = 'dynamic-input';

      const labelActual = document.createElement('label');
      labelActual.textContent = monthYear;
      labelActual.className = 'dynamic-label';

      const inputActual = document.createElement('input');
      inputActual.type = 'number';
      inputActual.className = 'dynamic-input';

      let lastMonthlyValue = expenses[i]?.expenseAmount ?? '0';
      let lastActualValue = actualExpenses[i]?.actualExpenseAmount ?? '0';

      inputMonthly.value = lastMonthlyValue;
      inputActual.value = lastActualValue;

      if (expenses?.length > 0) {
        inputMonthly.value = expenses[i]?.expenseAmount ?? 0;
        inputActual.value = actualExpenses[i]?.actualExpenseAmount ?? 0;
        expenseDetail = {
          ExpenseAmount: parseFloat(inputMonthly.value),
          ActualExpenseAmount: parseFloat(inputActual.value),
          Month: expenses[i]?.month ?? 0,
          Year: expenses[i]?.year ?? 0,
          Id: expenses[i]?.id ?? 0,
        };
      } else {
        inputMonthly.value = '0';
        expenseDetail = {
          ExpenseAmount: parseFloat(inputMonthly.value),
          ActualExpenseAmount: parseFloat(inputActual.value),
          Month: d.getMonth() + 1,
          Year: d.getFullYear(),
          Id: 0,
        };
      }

      if (actualExpenses?.length > 0) {
        inputMonthly.value = expenses[i]?.expenseAmount ?? 0;
        inputActual.value = actualExpenses[i]?.actualExpenseAmount ?? 0;
        actualExpenseDetail = {
          ExpenseAmount: parseFloat(inputMonthly.value),
          ActualExpenseAmount: parseFloat(inputActual.value),
          Month: actualExpenses[i]?.month ?? 0,
          Year: actualExpenses[i]?.year ?? 0,
          Id: actualExpenses[i]?.id ?? 0,
        };
      } else {
        inputActual.value = '0';
        actualExpenseDetail = {
          ExpenseAmount: parseFloat(inputMonthly.value) ?? 0,
          ActualExpenseAmount: parseFloat(inputActual.value),
          Month: d.getMonth() + 1,
          Year: d.getFullYear(),
          Id: 0,
        };
      }

      dynamicInputsMonthlySection.appendChild(labelMonthly);
      dynamicInputsMonthlySection.appendChild(inputMonthly);

      if (this.isBillable) {
        dynamicInputsActualSection?.appendChild(labelActual);
        dynamicInputsActualSection?.appendChild(inputActual);
      }

      this.expenseDetails.push(expenseDetail);
      this.actualExpenseDetails.push(actualExpenseDetail);

      inputMonthly.addEventListener('blur', (event: any) => {
        if (event.target.value.trim() === '') {
          event.target.value = lastMonthlyValue;
          this.expenseDetails[i].ExpenseAmount = parseFloat(lastMonthlyValue);
        }
      });
  
      inputActual.addEventListener('blur', (event: any) => {
        if (event.target.value.trim() === '') {
          event.target.value = lastActualValue;
          this.expenseDetails[i].ActualExpenseAmount = parseFloat(lastActualValue);
        }
      });
  

      inputMonthly.addEventListener(
        'input',
        ((index, month, year) => (event: any) => {
          const newValue = parseFloat(event.target.value);
          if (!isNaN(newValue)) {
            lastMonthlyValue = newValue;
            lastActualValue = newValue;
            this.expenseDetails[index].ExpenseAmount = newValue;

            inputActual.value = newValue.toString();
            this.actualExpenseDetails[index].ExpenseAmount = newValue;
            this.actualExpenseDetails[index].ActualExpenseAmount = newValue;
          }
        })(this.expenseDetails.length - 1, d.getMonth() + 1, d.getFullYear())
      );

      inputActual.addEventListener(
        'input',
        ((index) => (event: any) => {
          const newValue = parseFloat(event.target.value);
          if (!isNaN(newValue)) {
            lastActualValue = newValue;
            this.actualExpenseDetails[index].ActualExpenseAmount = newValue;
          }
        })(this.actualExpenseDetails.length - 1)
      );
      i++;
    }
  }
}
