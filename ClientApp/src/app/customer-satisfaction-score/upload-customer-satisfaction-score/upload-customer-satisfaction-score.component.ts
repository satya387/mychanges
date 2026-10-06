import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomerSatisfactionScoreService } from '../customer-satisfaction-score.service';
import { ToastService } from 'src/app/common/toast/toast.service';
import { DatePipe } from '@angular/common';
import { DateAdapter } from '@angular/material/core';
import { FormControl } from '@angular/forms'; // If using moment.js
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as XLSX from 'xlsx';
import { Inject, Input } from '@angular/core';

@Component({
  selector: 'customer-satisfaction-score-upload-customer-satisfaction-score',
  templateUrl: './upload-customer-satisfaction-score.component.html',
  styleUrls: ['./upload-customer-satisfaction-score.component.scss'],
})

export class UploadCustomerSatisfactionScoreComponent implements OnInit {

  uploadCSATForm: FormGroup;
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
  inputData: any;
  jsonData: any;
  selectedObject: any;
  cycleName: any;
  validationErrorMessages: string[] = [];
  inputElement : any;
  formSubmitted: boolean = false;
  excelCycleName: any;

  @Input() cycleData: any;
  @ViewChild('fileInput') fileInput: ElementRef;
  constructor(
    public dialogRef: MatDialogRef<UploadCustomerSatisfactionScoreComponent>, 
    private formBuilder: FormBuilder, 
    private customerSatisfactionScoreService: CustomerSatisfactionScoreService,
    private toastService: ToastService, 
    private dateAdapter: DateAdapter<Date>, 
    private router: Router, 
    private datepipe: DatePipe, 
    @Inject(MAT_DIALOG_DATA) public cData: any,
    @Inject(MAT_DIALOG_DATA) public uploadData: any
  ) {
    this.cycleData = cData.CycleData.map(item => {
      return {
        id: item.id,
        cycleName: item.cycleName
      };
    });
  }

  accountName = new FormControl();
  
  ngOnInit(): void {
    this.uploadCSATForm = this.formBuilder.group({
      cycleName: [null, Validators.required],
    });
  }

  onCloseClick(): void {
    this.dialogRef.close();
  }

  get f() { return this.uploadCSATForm.controls; }

  openDialog(EditId: number) {
    this.uploadCSATForm.controls['cycleName'].disable();
  }



  getAllAccountList() {
    const userData = JSON.parse(sessionStorage.getItem('userDetail'));
    const empEmidsId = userData.EmployeeId;
    this.customerSatisfactionScoreService.GetAccountsList(empEmidsId).subscribe((response: any) => {
      if (response) {
        this.accountList = response;
      }
    }, (error: any) => {
      this.toastService.showError(error, 'Error');
    })
  }

  generateRequestBody(inputJsonData) {
    const userData = JSON.parse(sessionStorage.getItem('userDetail'));
    let loggedInUser = userData.EmployeeId;
    const object = {
      FileData: inputJsonData,
      UploadedBy: loggedInUser,
      UploadedFileName: this.fileName
    }
    return object;
  }

  UploadCSATDocument() {
    const requestBody = this.generateRequestBody(this.inputData);
    this.customerSatisfactionScoreService.UploadCSATDocument(requestBody).subscribe((response: any) => {
      if (response && !response.isError) {
        this.toastService.showSuccess(response.message, 'Success', 30000);
        this.worksheet = "";
        this.dialogRef.close();
        setTimeout(() => {
          window.location.reload();
          this.router.navigate(['/CSAT']);
        }, 3000);
        
      } else {
        this.toastService.showError(response.message, 'Error', 30000);
        this.worksheet = "";
        this.dialogRef.close();
        return;
      }
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

  onSelect(event: any): void {
    var cycleName = event.target.value;
    this.cycleName = cycleName;
  }

  readAsJson() {
    this.validationErrorMessages = []; // Clear previous validation error messages
    this.jsonData = XLSX.utils.sheet_to_json(this.worksheet, {
      raw: false,
      defval: '',
    });
  debugger;
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
        this.UploadCSATDocument();
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
    if(this.cycleName !== this.excelCycleName){
      return `Invalid file, please choose the file with the selected cycle ${this.cycleName}`;
    }
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
    this.inputElement = event.target as HTMLInputElement;
    this.validationErrorMessages = [];
  
    if (this.inputElement.files && this.inputElement.files.length > 0) {
      this.fileUploaded = this.inputElement.files[0];
      this.fileName = this.inputElement.files[0].name;
      this.readExcel();
    } else {
      this.fileUploaded = null;
      this.fileName = null;
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
  this.formSubmitted = true; // Set formSubmitted to true when form is submitted
   debugger;
  if (this.uploadCSATForm.valid) {
    this.readAsJson();
    // this.formSubmitted = false; // Set formSubmitted to true when form is submitted

  } else {
    this.uploadCSATForm.markAllAsTouched();
  }
}

readExcel() {
  const reader: FileReader = new FileReader();
  reader.onload = (e: any) => {
    const bstr: string = e.target.result;
    const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
    const wsname: string = wb.SheetNames[0];
    const ws: XLSX.WorkSheet = wb.Sheets[wsname];
    this.worksheet = ws;

    // Fetch the cycle value from the worksheet
    const jsonData = XLSX.utils.sheet_to_json(ws, { header: 1 });
    if (jsonData.length > 1 && jsonData[0] instanceof Array) {
      const headers = jsonData[0];
      const cycleIndex = headers.indexOf('Cycle');
      if (cycleIndex !== -1) {
        this.excelCycleName = jsonData[1][cycleIndex];
      } else {
        this.validationErrorMessages.push('Cycle column not found in the uploaded file.');
      }
    } else {
      this.validationErrorMessages.push('Invalid file structure or empty file.');
    }
  };
  console.log(this.excelCycleName, "excelCycleName")
  reader.readAsArrayBuffer(this.fileUploaded);
}

 
}

const headerDataTypeMap = {
  "NPS Score (Numeric)": "Numeric",
  "NPS Category (Text)": "Text",
  "Expectation 1 (Numeric)": "Numeric",
  "Exp 1 rating (Text)": "Text",
  "Expectation 2 (Numeric)": "Numeric",
  "Exp 2 rating (Text)": "Text",
  "Expectation 3 (Numeric)": "Numeric",
  "Exp 3 rating (Text)": "Text",
  "You are very satisfied with your experience with Emids (Numeric)": "Numeric",
  "You will definitely choose Emids for your future requirements (Numeric)": "Numeric",
  "You believe that Emids delivers the best business value for your money (Numeric)": "Numeric",
  "Relationship management (business understanding, stakeholder mgmt., customer centricity) (Numeric)": "Numeric",
  "Resource management (availability of key resources, managing transition, knowledge transfer) (Numeric)": "Numeric",
  "Quality of resources (knowledge, personnel, technical expertise) (Numeric)": "Numeric",
  "Execution excellence (program/project management, governance, coordination of multiple groups) (Numeric)": "Numeric",
  "Delivering on project/program KPIs (SLA, Scope, Budget, Timelines) (Numeric)": "Numeric",
  "Automation efforts to increase productivity/ efficiencies (Numeric)": "Numeric",
  "Quality of deliverables (Numeric)": "Numeric",
  "Leveraging agile/ DevOps to increase pace of deployment (Numeric)": "Numeric",
  "Emids has a strong understanding of your industry / domain (Numeric)": "Numeric",
  "Emids showcases the right technology solutions that are contextual to your business needs (Numeric)": "Numeric",
  "Emids demonstrates the ability to own & deliver end to end programs (Numeric)": "Numeric",
  "Emids adopts a consultative approach in crafting the right solutions for your needs (Numeric)": "Numeric",
  "Emids actively brings ideas / suggestions to enhance your program outcomes (Numeric)": "Numeric",
  "Emids proactively engages in discussions beyond the contract (on strategic inputs, future roadmap, and thought leadership) (Numeric)": "Numeric",
  "Comp1 (Text)": "Text",
  "Reason1 (Text)": "Text",
  "Comp2 (Text)": "Text",
  "Reason2 (Text)": "Text",
  "Comp3 (Text)": "Text",
  "Reason3 (Text)": "Text",
  "What in your opinion differentiates Emids from other similar service providers? (Text)": "Text",
  "What are the areas you wish Emids could strengthen further? (Text)": "Text",
  "BusinessPriorities1 (Text)": "Text",
  "BusinessPriorities2 (Text)": "Text",
  "BusinessPriorities3 (Text)": "Text",
  "EmidsHelp1 (Text)": "Text",
  "EmidsHelp2 (Text)": "Text",
  "EmidsHelp3 (Text)": "Text"
};
