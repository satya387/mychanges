import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastService } from 'src/app/common/toast/toast.service';
import { DatePipe } from '@angular/common';
import { DateAdapter } from '@angular/material/core';
import { FormControl } from '@angular/forms'; // If using moment.js
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as XLSX from 'xlsx';
import { Inject, Input } from '@angular/core';
import { OpportunityRlsExpenseService } from '../opportunity-rls-expense.service';
import { id } from '@swimlane/ngx-charts';
import { MatDialog } from '@angular/material/dialog';
import { ValidationDialogComponent } from '../validation-dialog-modal/validation-dialog-modal.component';

@Component({
  selector: 'app-import-rls',
  templateUrl: './import-rls.component.html',
  styleUrls: ['./import-rls.component.scss']
})
export class ImportRlsComponent implements OnInit {

  uploadRLSForm: FormGroup;
  accountList: any;
  ProjectList: any;
  CycleList: any;
  Userlist: any;
  itemId: any;
  EditList: any;
  isEditMode: boolean = false;
  roleType: any;
  accounId: any = -1;
  StatusList: any;
  samplelist: any;
  submitted: boolean = false;
  dateSelected: boolean = false;
  fileUploaded: File;
  fileName: any;
  worksheet: any;
  worksheet_1: any;
  inputData: any;
  inputData_1: any;
  jsonData: any;
  jsonData_1: any;
  selectedObject: any;
  cycleName: any;
  validationErrorMessages: string[] = [];
  inputElement : any;
  formSubmitted: boolean = false;
  excelCycleName: any;
  opportunityId: any;
  Id: any;
  isSubmitDisabled: boolean = false;
  debounceTimer: any = null;
  versionName : any;

  @Input() cycleData: any;
  @ViewChild('fileInput') fileInput: ElementRef;
  constructor(
    public dialogRef: MatDialogRef<ImportRlsComponent>, 
    private formBuilder: FormBuilder, 
    private oppRlsExpService: OpportunityRlsExpenseService,  
    private toastService: ToastService, 
    private cdr: ChangeDetectorRef,
    private dateAdapter: DateAdapter<Date>, 
    private router: Router, 
    private datepipe: DatePipe,
    private dialog: MatDialog, 
  ) { }

  accountName = new FormControl();
  
  ngOnInit(): void {
    this.uploadRLSForm = this.formBuilder.group({
      uploadFileName :  ['',Validators.required]
    });
    this.oppRlsExpService.opportunityData$.subscribe((data) => {
      this.opportunityId = data.opportunityId,
      this.Id = data.id
    });
    let editOpportunityObject = {
      opportunityId: this.opportunityId,
      id: this.Id ?? 0
    }
    this.oppRlsExpService
      .getOpportunityAndRLSDetails(editOpportunityObject)
      .subscribe((res: any) => {
        this.versionName = res.opportunity?.versionName ?? this.opportunityId + '_V1' ?? '';
      });
  }

  onCloseClick(): void {
    this.dialogRef.close();
  }

  get f() { return this.uploadRLSForm.controls; }

  openDialog(EditId: number) {
   // this.uploadRLSForm.controls['cycleName'].disable();
  }

  generateRequestBody(inputJsonData, inputJsonData_1) {
    const formData = new FormData();
    const userData = JSON.parse(sessionStorage.getItem('userDetail'));
    let loggedInUser = userData.EmployeeId;
    const object = {
      FileData_RLS: inputJsonData,
      FileData_General: inputJsonData_1,
      UploadedBy: loggedInUser,
      UploadedFileName: this.versionName,
      OpportunityID: this.opportunityId,
      Id: this.Id,
      UploadedFile : this.fileUploaded
    }
    formData.append('additionalData', JSON.stringify(object));
    formData.append('file', this.fileUploaded);
    return formData;
  }

  UploadRLSDocument() {
    const requestBody = this.generateRequestBody(this.inputData, this.inputData_1);
    this.oppRlsExpService.UploadRLSDocument(requestBody).subscribe((response: any) => {
      console.log(response);
      if (response && !response.isError) {
        this.toastService.showSuccess(response.message, 'Success', 30000);
        this.worksheet = "";
        this.worksheet_1= "";
        this.dialogRef.close();

          let opportunityObject = {
            opportunityId: this.opportunityId,
            id: response.data ?? this.Id
          }
          this.oppRlsExpService
          .getOpportunityAndRLSDetails(opportunityObject)
          .subscribe((res: any) => {
            this.oppRlsExpService.setRLSData(res);
            this.oppRlsExpService.setExpenseData(res);
            this.oppRlsExpService.updateOpportunityWiseMarginData(
              res?.opportunityWiseMargin
            );
            this.oppRlsExpService.updateOpportunityData(res.opportunity);
          });
        
      } else {
        if(response.data == 1 && response.isError){
          this.dialogRef.close();
          const errorMessages = response.message ? response.message.split('|') : [];

          this.dialog.open(ValidationDialogComponent, {
            width: 'auto',
            height: 'auto',
            maxHeight: '90vh',
            panelClass: 'validation-dialog-popup-container',
            autoFocus: false,
            disableClose: false,
            data: {
              messages: errorMessages
            }
          });
        }
        else{
          this.toastService.showError(response.message, 'Error', 50000);
          this.worksheet = "";
          this.worksheet_1= "";
          this.dialogRef.close();
          return;
        }
      }
    })
  }


  readAsJson() {
    console.log(this.isSubmitDisabled);

    this.validationErrorMessages = []; // Clear previous validation error messages
    this.jsonData = XLSX.utils.sheet_to_json(this.worksheet, {
      raw: false,
      defval: '',
    });

    this.jsonData_1 = XLSX.utils.sheet_to_json(this.worksheet_1, {
      raw: false,
      defval: '',
    });

    if (this.jsonData.length > 0) {
      const headers = this.extractHeaders(this.jsonData);
  
      let allRowsValid = true;
      const uniqueErrorMessages = new Set<string>(); // To store unique error messages
  
      this.jsonData.forEach(row => {
        headers.forEach(header => {
          if (!(header in row)) {
            row[header] = '';
          }
          const expectedType = headerDataTypeMap[header];
          const validationError = this.validateDataType(row[header], expectedType, header);
          if (validationError) {
            allRowsValid = false;
            uniqueErrorMessages.add(validationError); // Add error message to set
          }
        });
      });
  
      this.validationErrorMessages = Array.from(uniqueErrorMessages); // Convert set to array for display
      
      if (allRowsValid) {
        this.inputData = JSON.stringify(this.jsonData);
        this.inputData = this.inputData.replace(/\*/g, '');
        const data: Blob = new Blob([this.inputData], { type: "application/json" });
        this.inputData_1 = JSON.stringify(this.jsonData_1);
        this.inputData_1 = this.inputData_1.replace(/\*/g, '');
        const data_1: Blob = new Blob([this.inputData_1], { type: "application/json" });
        this.UploadRLSDocument();
      } 
    } else {
      this.validationErrorMessages.push('Please choose a file to upload');
    }
  }  

  private extractHeaders(data: any[]): string[] {
    let headers: string[] = [];
    data.forEach(row => {
      Object.keys(row).forEach(key => {
        if (!headers.includes(key)) {
          headers.push(key);
        }
      });
    });
    return headers;
  }

  validateDataType(value: any, expectedType: string, header: string): string | null {
    
    // Skip validation for empty fields
    if (value === null || value === undefined || value === '') {
      return null;
    }
    if (expectedType === 'Numeric') {
      if (isNaN(value) || isNaN(parseFloat(value))) {
        this.inputElement.value = '';
        return `Invalid data type for column ${header}. Expected numeric value.`;
      }
    } else if (expectedType === 'Text') {
      if (typeof value !== 'string' || !isNaN(Number(value))) {
        this.inputElement.value = '';
        return `Invalid data type for column ${header}. Expected text value.`;
      }
    }
    return null;
  }

  closeAlert() {
    this.validationErrorMessages = [];
  }

  uploadedFile(event: Event) {
    this.isSubmitDisabled = true;
    this.inputElement = event.target as HTMLInputElement;
    this.validationErrorMessages = [];
  
    if (this.inputElement.files && this.inputElement.files.length > 0) {
      this.fileUploaded = this.inputElement.files[0];
      this.fileName = this.inputElement.files[0].name;
      this.readExcel();
    } else {
      this.fileUploaded = null;
      this.fileName = null;
      this.isSubmitDisabled = false;
    }
  }

  isValidFileType(): boolean {
    if (!this.fileUploaded) {
      return false;
      
    }
    const allowedExtensions = ['.xlsx'];
    const fileExtension = this.fileUploaded.name.split('.').pop()?.toLowerCase();
    return allowedExtensions.includes(`.${fileExtension}`);
  }

// Update the onUpload method
onUpload(): void {
  if (this.isSubmitDisabled) {
    return; // Prevent multiple clicks while processing
  }

  if (this.debounceTimer) {
    clearTimeout(this.debounceTimer); // Clear any pending timer
  }

  this.debounceTimer = setTimeout(() => {
    this.isSubmitDisabled = true; // Disable the button when the process starts
    this.formSubmitted = true; // Mark form as submitted
    this.readAsJson(); // Process the file
  }, 300); // Debounce delay (300 ms)
}

readExcel() {
  const reader: FileReader = new FileReader();
  reader.onload = (e: any) => {
    const bstr: string = e.target.result;
    const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
    const wsname_rls : string = wb.SheetNames[3];
    const wsname_general : string = wb.SheetNames[2];
    const ws_rls : XLSX.WorkSheet = wb.Sheets[wsname_rls];
    const ws_general : XLSX.WorkSheet = wb.Sheets[wsname_general];
    this.worksheet = ws_rls;
    this.worksheet_1 = ws_general;
    this.isSubmitDisabled = false; 

  };
  reader.readAsArrayBuffer(this.fileUploaded);
}
 
}

const headerDataTypeMap = {
  "Opportunity_Details_Id": "Text",
  "ResourceId": "Text",
  "ResourceName": "Text",
  "Resource": "Text",
  "Role": "Text",
  "PrimarySkill": "Text",
  "SecondarySkill": "Text",
  "Experience": "Text",
  "Location": "Text",
  "Hire": "Text",
  "ResourceType": "Text",
  "WorkSlot": "Text",
  "Phase": "Text",
  "Tracks": "Text",
  "ServiceArea": "Text",
  "IndiaSMR": "Numeric",
  "USSMR": "Numeric",
  "EESMR": "Numeric",
  "ArgentinaSMR": "Numeric",
  "CanadaSMR": "Numeric",
  "ManilaSMR": "Numeric",
  "ArmeniaSMR": "Numeric",
  "RomaniaSMR": "Numeric",
  "StandardMonthlyRate": "Numeric",
  "RateDeviation": "Numeric",
  "ShiftAllowanceBillRate": "Numeric",
  "MonthlyBillRateProposed": "Numeric",
  "MonthlyBillRatePrior": "Numeric",
  "Eff_MonthlyRate": "Numeric",
  "Eff_HourlyRate": "Numeric",
  "Eff_MonthlyRateWithAllowance": "Numeric",
  "StandardCostInUSD": "Numeric",
  "ShiftAllowanceCost": "Numeric",
  "IndiaStandardCostINR": "Numeric",
  "ManualMonthlyCostUSD": "Numeric",
  "CostDeviation": "Numeric",
  "Eff_MonthlyCost": "Numeric",
  "Eff_HourlyCost": "Numeric",
  "Eff_MonthlyCostWithAllowance": "Numeric",
  "Margin": "Numeric",
  "RoleCode": "Text",
  "TechCode": "Text",
  "SecondTechCode": "Text",
  "ExpCode": "Text",
  "ResourceCode": "Text",
  "Geography": "Text",
  "ActualResourceCode": "Text",
  "Remarks": "Text",
  "RoleStartDate": "Date",
  "RoleEndDate": "Date",
};
