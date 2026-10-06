import { Component, OnInit, ElementRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, AbstractControl, FormArrayName, FormControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
// import { AllowanceModuleService } from '../allowance-module/allowance-module.service';
import { ToastService } from 'src/app/common/toast/toast.service';
// import { ALLOWANCE_URLS } from '../allowance.module/allowance-module.url-config';
import { HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import {
  CONFIRM_VALUES, PLACEMENT_TYPE, CURRENCY_TYPE, BILLING_TYPE, EMPLOYMENT_TYPE, BILLING_FREQUENCY,
  EDUCATION_TYPE, SERVICE_TYPE, AUTHORIZATION_STATUS, PAYMENT_TYPE, SKILLS_LIST
} from 'src/app/common/configuration.settings';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { formatDate } from '@angular/common';
import { AllowanceModuleService } from '../allowance-module.service';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'add-allowance',
  templateUrl: './add-allowance.component.html',
  styleUrls: ['./add-allowance.component.scss']
})

export class AddAllowanceComponent implements OnInit {
  addAllowanceForm: FormGroup;
  ProjId: number = 0;
  EmployeeId: string;
  EmployeeName: string;  
  EmpDesignation: string = "";
  Billability: string = "";
  Year: number;
  Month: number;
  NoOfDays: number;
  ShiftTypeId: number = 0;
  ShiftType: string;  
  FoodAllowancecontrol = new FormControl();
  hasFoodAllowance: boolean = false;

  yesNoValues: any = CONFIRM_VALUES;
  ShiftAllowancePerMonth: number = 0;  
  FoodAllowancePerMonth: number = 0;
  
  isAddAllowance: any;
  isEdit: any;
  resourceAction: any;
  allowanceId: number;
  selectedEmployeeId: string;
  isSubmitting: boolean = false;
  ProjectList: any = [];
  EmployeeList: any = [];
  ProjectWiseEmployeeList: any = [];
  ShiftTypeList: any = [];
  public yearOptions: { value: number; label: string }[] = [];
  yearFormControl = new FormControl();
  filteredYearOptions: Observable<{ value: number; label: string }[]>;
  AllowanceDetailsList: any;
  FilteredAllowanceDetailsList: any;
  
  constructor(private formBuilder: FormBuilder, private allowanceservice: AllowanceModuleService, private toastService: ToastService,
    private router: Router, private activatedRoute: ActivatedRoute,private sanitizer: DomSanitizer,private datepipe: DatePipe,public dialog: MatDialog) { 
      

    }

  ngOnInit(): void {
    console.log("checkbox list", this.yesNoValues);
    this.formInitialization();
    const userData = JSON.parse(sessionStorage.getItem('userDetail'));
    const empEmidsId = userData.EmployeeId;
    const currentYear = new Date().getFullYear();
    this.yearOptions.push({ value: currentYear, label: currentYear.toString() });
    this.yearOptions.push({ value: currentYear - 1, label: (currentYear - 1).toString() });
    this.yearFormControl.setValue(currentYear);
    this.filteredYearOptions = this.yearFormControl.valueChanges.pipe(
      startWith(''),
      map(value => this._yearFilter(value))
    );
    
    // this.addAllowanceForm.get('ProjId')?.valueChanges.subscribe(projectId => {
    //   if (projectId) {
    //     this.onProjectChangeById(projectId);
    //     this.addAllowanceForm.get('EmployeeId')?.reset();
    //   }
    // });


    this.activatedRoute.queryParams.subscribe((params) => {
      debugger;
      this.resourceAction = params.isAdd === "true" ? 'New ' : 'Edit ';
      this.isAddAllowance = params.isAdd;
      this.isEdit = params.isEdit;
      if (params.isAdd !== "true" && params.isEdit == 1) {
        this.allowanceId = parseInt(params.allowanceId);
        this.getAllowanceDetailsById(this.allowanceId);
        this.addAllowanceForm.get('ProjId')?.disable();
        this.addAllowanceForm.get('EmployeeId')?.disable();
      }
      else if (params.isAdd !== "true" && params.isEdit == 0){
       
        this.allowanceId = parseInt(params.allowanceId);
        this.getAllowanceDetailsById(this.allowanceId);
        this.addAllowanceForm.get('ProjId')?.enable();
        this.addAllowanceForm.get('EmployeeId')?.enable();
      }
    });
 
    this.getProjectList();
    this.getEmployeeList();
    this.getShiftTypeList();
    this.addAllowanceForm.get('hasFoodAllowance')?.valueChanges.subscribe(value => {
      if (value === true) {
        this.calculateTotalAllowance();
      } else {
        this.resetFoodAllowance();
      }
    });
    this.addAllowanceForm.get('NoOfDays')?.valueChanges.subscribe(value => {
      const days = Number(value);

      if (!days || isNaN(days)) {
        this.resetFoodAllowance();
        this.resetShiftAllowance();
        return;
      }
      this.calculateTotalAllowance(days);
    });
  }
  
  private _yearFilter(value: any): { value: number; label: string }[] {
    const filterValue = value;
    return this.yearOptions.filter(year => year.label.includes(filterValue));
  }

  formInitialization() {
    debugger;
      this.addAllowanceForm = this.formBuilder.group({
        ProjId: [null, Validators.required],
        EmployeeId: [null, Validators.required],
        EmployeeName: [null],
        EmpDesignation: [null],
        Billability: [null],
        Year: [null, Validators.required],
        Month: [null, Validators.required],
        NoOfDays: [null, Validators.required],
        ShiftTypeId: [null, Validators.required],
        ShiftType: [null],
        hasFoodAllowance: [null, Validators.required],
        ShiftAllowancePerMonth: [null, Validators.required],
        FoodAllowancePerMonth: [null],
      });
  }

  async bindFormData(data: any[]) {
    if (!data?.length) return;
  
    const d = data[0];
    this.selectedEmployeeId = d.employeeId;

    this.addAllowanceForm.patchValue({
      ProjId: Number(d.projId)
    });

    await this.onProjectChangeById(Number(d.projId));

    this.addAllowanceForm.patchValue({
      EmployeeName: d.employeeName,
      EmpDesignation: d.empDesignation,
      Billability: d.billability,
      Year: Number(d.year),
      Month: Number(d.month),
      NoOfDays: d.noOfDays,
      ShiftTypeId: Number(d.shiftTypeId),
      ShiftType: d.shiftType,
      hasFoodAllowance: d.hasFoodAllowance,
      ShiftAllowancePerMonth: d.shiftAllowancePerMonth,
      FoodAllowancePerMonth: d.foodAllowancePerMonth
    });
    this.addAllowanceForm.get('EmployeeId')?.setValue(d.employeeId);
  }

  getProjectList() {
    this.allowanceservice.GetProjectList().subscribe((response: any) => {
      if (response) {
        this.ProjectList = response;
      }
    }, (error: any) => {
      this.toastService.showError(error, 'Error');
    })
  }
  
  getEmployeeList() {
    this.allowanceservice.GetEmployeeList().subscribe((response: any) => {
      if (response) {
        this.EmployeeList = response;
        this.ProjectWiseEmployeeList = response;
      }
    }, (error: any) => {
      this.toastService.showError(error, 'Error');
    })
  }
  getEmployeeListByProjId(ProjId) {
    this.allowanceservice.getEmployeeListByProjId(ProjId).subscribe((response: any) => {
      if (response) {
        this.ProjectWiseEmployeeList = response;
      }
    }, (error: any) => {
      this.toastService.showError(error, 'Error');
    })
  }
  getShiftTypeList() {
    this.allowanceservice.GetShiftTypeList().subscribe((response: any) => {
      if (response) {
        this.ShiftTypeList = response;
      }
    }, (error: any) => {
      this.toastService.showError(error, 'Error');
    })
  }

  getAllowanceDetailsById(Id){
    debugger;
    this.allowanceservice.GetAllowanceDetails().subscribe((response: any) => {
      if (response) {
        this.AllowanceDetailsList = response;
        this.FilteredAllowanceDetailsList = this.AllowanceDetailsList.filter(
          a => a.allowanceId === Id
        );
        // this.totalRecord = response.totalCount;
        // this.isPageChanged = false;
        if (this.FilteredAllowanceDetailsList) {
          this.bindFormData(this.FilteredAllowanceDetailsList);
        }
      }
    }, (error: any) => {
      this.toastService.showError(error, 'Error');
    })
  }

  onProjectChange(event: Event){
    const projectId = +(event.target as HTMLSelectElement).value;

    this.addAllowanceForm.get('EmployeeId')?.reset();    
    this.addAllowanceForm.get('EmpDesignation')?.reset();
    this.addAllowanceForm.get('Billability')?.reset();
    this.ProjectWiseEmployeeList = this.EmployeeList.filter(
      emp => emp.projectId === projectId
    );

    this.addAllowanceForm.get('EmployeeId')?.reset();
  }

  // onProjectChangeById(projectId: number) {
    
  //   this.ProjectWiseEmployeeList = this.EmployeeList.filter(
  //     emp => emp.projectId === projectId
  //   );
  //   this.addAllowanceForm.get('EmployeeId')?.reset();

  //   setTimeout(() => {
  //     this.addAllowanceForm.get('EmployeeId')?.setValue(this.selectedEmployeeId);
  //   });
  // }

  onProjectChangeById(projectId: number): Promise<void> {
    return new Promise(resolve => {
      this.getEmployeeListByProjId(projectId);
      // this.ProjectWiseEmployeeList = this.EmployeeList.filter(
      //   emp => emp.projectId === projectId
      // );
  
      // Allow Angular to render options
      setTimeout(() => resolve());
    });
  }

  onEmployeeChange(event: Event){
    debugger;
    const select = event.target as HTMLSelectElement;
    let empId = select.value;
    // this.addAllowanceForm.get('EmployeeId')
    empId = this.addAllowanceForm.value.EmployeeId;
    if (!empId) return;

    const emp = this.ProjectWiseEmployeeList?.find(
      e => e.employeeId === empId
    );
    console.log('emp- ',emp);
    this.EmpDesignation = emp?.designation;
    this.Billability = emp?.billability;
    this.addAllowanceForm.patchValue({
      EmpDesignation:  emp?.designation
    });
    this.addAllowanceForm.patchValue({
      Billability:  emp?.billability
    });
    this.addAllowanceForm.patchValue({
      EmployeeName:  emp?.employeeName
    });
  }

  onShiftChange(event: Event){
    const shiftId = +(event.target as HTMLSelectElement).value;

    const selectedShift = this.ShiftTypeList.find(
      s => s.shiftTypeId === shiftId
    );
    const NoOfDays =  Number(this.addAllowanceForm.get('NoOfDays')?.value);
    const totalShiftAllowance = NoOfDays * Number(selectedShift?.shiftAllowance?? 0);
    this.addAllowanceForm.patchValue({
      ShiftAllowancePerMonth:  totalShiftAllowance
    });
    this.addAllowanceForm.patchValue({
      ShiftType:  selectedShift?.shiftType
    });
  }
  calculateTotalAllowance(days?) {
    const shiftId = Number(this.addAllowanceForm.get('ShiftTypeId')?.value);
    const hasFoodAllowance = this.addAllowanceForm.get('hasFoodAllowance')?.value;
    const selectedShift = this.ShiftTypeList.find(
      s => s.shiftTypeId === shiftId
    );
    const NoOfDays =  days ?? Number(this.addAllowanceForm.get('NoOfDays')?.value);
    const totalShiftAllowance = NoOfDays * Number(selectedShift?.shiftAllowance ?? 0);
    this.addAllowanceForm.patchValue({
      ShiftAllowancePerMonth:  totalShiftAllowance
    },
    { emitEvent: false }
    );
  if(hasFoodAllowance){
    const totalFoodAllowance = NoOfDays * Number(selectedShift?.foodAllowance ?? 0);
    this.addAllowanceForm.patchValue(
      {
      FoodAllowancePerMonth:  totalFoodAllowance
    },
    { emitEvent: false }
    );
  }
  }

  resetShiftAllowance() {  
    this.addAllowanceForm.patchValue(
      { ShiftAllowancePerMonth: 0 },
      { emitEvent: false }
    );
  }

  resetFoodAllowance() {  
    this.addAllowanceForm.patchValue(
      { FoodAllowancePerMonth: 0 },
      { emitEvent: false }
    );
  }

  preventKeys(event: any) {
    if (event.keyCode === 69 || event.keyCode === 107 || event.keyCode === 109 || event.keyCode === 189) {
      console.log(event.keyCode);
      event.stopPropagation();
      return false;
    }
  }

  generateFormBody() {
  debugger;
    const object = {
      "ProjId": this.addAllowanceForm.value.ProjId,
      "EmployeeId": this.addAllowanceForm.value.EmployeeId || null,
      "EmployeeName": this.addAllowanceForm.value.EmployeeName|| null,
      "EmpDesignation": this.addAllowanceForm.value.EmpDesignation || null,
      "Billability": this.addAllowanceForm.value.Billability || null,
      "Year": this.addAllowanceForm.value.Year || 0,
      "Month": this.addAllowanceForm.value.Month || 0,
      "NoOfDays": this.addAllowanceForm.value.NoOfDays || 0,
      "ShiftTypeId": this.addAllowanceForm.value.ShiftTypeId || 0,
      'ShiftType': this.addAllowanceForm.value.ShiftType || null,
      "hasFoodAllowance": this.addAllowanceForm.value.hasFoodAllowance || false,
      "ShiftAllowancePerMonth": this.addAllowanceForm.value.ShiftAllowancePerMonth || 0,
      "FoodAllowancePerMonth": this.addAllowanceForm.value.FoodAllowancePerMonth || 0,
    }
    console.log('formData generated - ',object)
    return object;
  }

  checkValueSelected() {
    for (const field in this.addAllowanceForm.controls) {
        const validator = this.addAllowanceForm.get(field).validator && this.addAllowanceForm.get(field).validator({} as AbstractControl);
        if (validator?.required && (this.addAllowanceForm.controls[field].value === 'null' || this.addAllowanceForm.controls[field].value === 'Select' || this.addAllowanceForm.controls[field].value === '0')) {
          console.log(field);
          if (field === 'ProjId') {
            this.addAllowanceForm.controls[field].reset('null');
          } else if (field === 'EmployeeId') {
            this.addAllowanceForm.controls[field].reset('null');
          } else if (field === 'Year') {            
            this.addAllowanceForm.controls[field].reset('null');
          } else if (field === 'Month') {            
            this.addAllowanceForm.controls[field].reset('null');
          } else if (field === 'ShiftTypeId') {            
            this.addAllowanceForm.controls[field].reset('null');
          } else {
            this.addAllowanceForm.controls[field].reset();
          }
          this.addAllowanceForm.controls[field].setErrors({ 'invalid': true });
          this.addAllowanceForm.setErrors({ 'invalid': true });
        }
    }
  }


  async onSubmitAllowanceForm():Promise<void> {
    debugger;
    this.isSubmitting = true;
    this.checkValueSelected();
    this.addAllowanceForm.markAllAsTouched();
    if (!this.addAllowanceForm.valid) {
    this.isSubmitting = false;
      return;
    }
    const requestBody = this.generateFormBody();
    const formData = new FormData();
    formData.append('allowanceId', (this.allowanceId ?? 0).toString());
    formData.append('formData', JSON.stringify(requestBody));
    if (requestBody.hasFoodAllowance == null ) {
      requestBody.hasFoodAllowance = false;
   }
    this.allowanceservice.saveAllowanceDetails(formData).subscribe((response: any) => {
      debugger;
      if (response && !response.isError) {
        this.toastService.showSuccess(response.message, 'Success');
        this.addAllowanceForm.reset();
        this.router.navigate(['/allowance-module']);
       // this.updateLineItems()
      }
      else {
        this.toastService.showError(response.message, 'Error');
        return;
      }
    }, (error: any) => {
      this.toastService.showError(error, 'Error');
    });
}
    

}

