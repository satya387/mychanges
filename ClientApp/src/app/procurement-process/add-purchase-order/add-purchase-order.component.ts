import { Component, OnInit, ElementRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, AbstractControl, FormArrayName, FormControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PurchaseOrderService } from '../purchase-order/purchase-order.service';
import { ToastService } from 'src/app/common/toast/toast.service';
import { PO_URLS } from '../purchase-order/purchase-order.url-config';
import { HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import {
  CONFIRM_VALUES, PLACEMENT_TYPE, CURRENCY_TYPE, BILLING_TYPE, EMPLOYMENT_TYPE, BILLING_FREQUENCY,
  EDUCATION_TYPE, SERVICE_TYPE, AUTHORIZATION_STATUS, PAYMENT_TYPE, SKILLS_LIST
} from 'src/app/common/configuration.settings';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmPurchaseOrderComponent } from 'src/app/confirm-purchase-order/confirm-purchase-order.component';
import { RejectpoComponent } from './rejectpo/rejectpo.component';
import { DatePipe } from '@angular/common';
import { formatDate } from '@angular/common';
import {PoTermsconditionsComponent} from '../add-purchase-order/po-termsconditions/po-termsconditions.component'

@Component({
  selector: 'app-add-purchase-order',
  templateUrl: './add-purchase-order.component.html',
  styleUrls: ['./add-purchase-order.component.scss']
})

export class AddPurchaseOrderComponent implements OnInit {
  addPOForm: FormGroup;
  POAction: string;
  isAddPO: any;
  POId: number;
  EditPOList: any;
  PRList: any = [];
  EditPRList: any = [];
  showField: boolean = false;
  PO_Id: number;
  total: number = 0;
  PONumber: string;
  selectedFiles: File[] = [];
  files: File[] = [];
  savedFileNamesString: string = "";
  savedFiles: { name: string }[] = [];
  PRFiles: { name: string }[] = [];
  @Output() onSelectFiles: EventEmitter<File[]> = new EventEmitter<File[]>();
  private isUploadInProgress: boolean = false;
  PR_ID : any;
  POUserRoles: any;
  status: boolean = false;
  status1: boolean = false;
  rejectStatus:boolean=false;
  isDisabled:boolean=false;
  isPRConsent: boolean=false;
  isDuration: boolean = false;
  hiddenField:boolean=true;
  today: Date = new Date();
  buttonText: string = 'SAVE';
  PurchaseRequestDate: any;
  requestDeliveryDate: any;
  hasReadTerms: boolean = false
  yesNoValues: any = [];
  button: any;
  LocationId: any;
  addressSuggestions: string[] = [
    'Golden Tower - #18/18/17/18/12, Rupena Agrahara,Begur Hobli, Bommanahalli, Bangalore,Karnataka, India – 560068 GST # 29AAACE6345B1ZW',
    'D-9, Sector 3, Gautam Buddha Nagar,Noida, Uttar Pradesh – 201301',
    'Level – 7, Unit – 06, SLN Terminus, Gachibowli, Miyapur Main Road, Gachibowli, Hyderabad, Telangana – 500 032',
    '343 Preston St, 11th Floor, Ottawa, ON, K1S 1N4, Canada',
    '318 Seaboard Lane, Suite 110, Franklin TN 37067',
    '10 F Arthaland Century Pacific Tower, 5th Avenue corner 4th Avenue corner 30th Street, E-Square, Bonifacio Global City, 1634 Philippines',
    '8130 Lakewood Main Street Suite 103 #322, Lakewood Ranch, FL 34202',
    '10F, Arthaland Century Pacific Tower, 30th Street corner 5TH Avenue, BGC, Taguig City, Metro Manila, 1630 Philippines'
  ];
  
  billingAddressValue: string = '';
  showSuggestions: boolean = false;
  cursorPosition: number = 0;
  shippingAddressValue: string = '';
  activeField: 'billing' | 'shipping' | null = null;
  getFormula(): string {
    return 'Total = (Quantity * Price Per Unit) + % of (Quantity * Price Per Unit)';
  }
  constructor(private formBuilder: FormBuilder, private purchaseorderservice: PurchaseOrderService, private toastService: ToastService,
    private router: Router, private activatedRoute: ActivatedRoute,private sanitizer: DomSanitizer,private datepipe: DatePipe,public dialog: MatDialog) { 
      
      this.PurchaseRequestDate = undefined;
      this.requestDeliveryDate = undefined;
    }

    
    setActiveField(field: 'billing' | 'shipping') {
      this.activeField = field;
      this.showSuggestions = true;
    }
  ngOnInit(): void {
    this.formInitialization();
    const userData = JSON.parse(sessionStorage.getItem('userDetail'));
    const empEmidsId = userData.EmployeeId;
    this.activatedRoute.queryParams.subscribe((params) => {
      //this.POAction = params.isAdd === "true" ? 'New ' : 'Edit ';
     
      this.isAddPO = params.isAdd;
      if (params.isAdd !== "true" && params.isEdit == 1) {
        debugger;
        this.button = 1
        console.log('button',this.button)
        this.POAction = 'Edit '
        this.POId = parseInt(params.id);
        this.getPOEditDetails(this.POId);
        this.getPRNumbers(1, empEmidsId);
        this.addPOForm.controls['PRNumber'].disable();
        this.addvalidation();
          this.purchaseorderservice.GetPOEditDetails(this.POId).subscribe((res: any) => {
            if (res) {
              this.EditPOList = res;
           if(this.EditPOList[0].prStatus==8){
               this.status=false;
               this.status1=false;
               this.rejectStatus= false
               }

            }
          }, (error: any) => {
            this.toastService.showError(error, 'Error');
          })  
          this.getPRDetails(params.PR_Id);
      }
      else if (params.isAdd !== "true" && params.isEdit == 0){
        this.button = 0
        console.log('button',this.button)
       this.POAction = ''
       this.addPOForm.disable();
       this.addPOForm.controls['Tax'].disable();
       debugger;
       this.POId = parseInt(params.id);
       this.getPOEditDetails(this.POId);
       this.getPRNumbers(1, empEmidsId);
       this.addPOForm.controls['PRNumber'].disable();
       this.addvalidation();
         this.purchaseorderservice.GetPOEditDetails(this.POId).subscribe((res: any) => {
           if (res) {
             this.EditPOList = res;
          if(this.EditPOList[0].prStatus==8){
              this.status=false;
              this.status1=false;
              this.rejectStatus= false
              }

           }
         }, (error: any) => {
           this.toastService.showError(error, 'Error');
         })  
         this.getPRDetails(params.PR_Id);
      }
      else if (params.isAdd == "true" && params.id != 0) {
        debugger;
        this.button = 1
        console.log('button',this.button)
         this.POAction = 'Edit'
        var values = this.getPRDetails(params.id)
        
        this.getPRNumbers(0, empEmidsId);
        this.getPRDetails(params.PR_Id)
        this.addPOForm.patchValue({
           PRNumber: parseInt(params.id),
        })
      }
      else if (params.isAdd == "true") {
        debugger;
        this.button = 1
        console.log('button',this.button)
        this.POAction = 'Add'
        this.getPRNumbers(0, empEmidsId);
      }
      this.loadYesNoValues();
    });
    // this.addPOForm.get('Tax').valueChanges.subscribe(() => {
    //   debugger
    //   this.updateResult();
    // });
    // this.addPOForm.get('isPRConsent').valueChanges.subscribe(value => {
    //   debugger;
    //   this.isPRConsent = value;
    // });
    this.addPOForm.controls['Quantity'].disable();
    this.addPOForm.controls['Duration'].disable();
    this.addPOForm.controls['PricePerUnit'].disable();
    this.addPOForm.controls['Total'].disable();
    this.addPOForm.controls['PRFOR'].disable();
    this.addPOForm.controls['currencyType'].disable();
    this.addPOForm.get('BillingAddress').valueChanges.subscribe(value => {
      const isChecked = this.addPOForm.get('flowEnabled').value;
      if (isChecked) {
        this.addPOForm.get('ShippingAddress').setValue(value);
      }
    });
    this.addPOForm.controls['RejectionReason'].disable();

  }
  loadYesNoValues() {
    this.yesNoValues = [
      { Id: 1, Name: 'Yes', Value: 1 },
      { Id: 0, Name: 'No', Value: 0 }
    ];
  }
  generatePOBody() {
    const object = {
      "Pr_Id": parseInt(this.addPOForm.value.PRNumber),
      "VendorReferedBy": this.addPOForm.value.VendorReferedBy || null,
      "VendorName": this.addPOForm.value.VendorName || null,
      "ContactName": this.addPOForm.value.ContactName || null,
      "Phone": this.addPOForm.value.Phone || null,
      "EmailId": this.addPOForm.value.EmailId || null,
      "Tax": parseFloat(this.addPOForm.value.Tax) || 0,
      "GSTIN": this.addPOForm.value.GSTIN || null,
      "PAN": this.addPOForm.value.PAN || null,
      'VendorAddress': this.addPOForm.value.VendorAddress || null,
      "ShippingAddress": this.addPOForm.value.ShippingAddress || null,
      "BillingAddress": this.addPOForm.value.BillingAddress || null,
      "CreditTerms": this.addPOForm.value.CreditTerms || null,
      "TerminationClause": this.addPOForm.value.TerminationClause || null,
      "Comments": this.addPOForm.value.Comments || null,
      "ISLegal": this.addPOForm.value.isLegal == null ? null : (Boolean(JSON.parse(this.addPOForm.value.isLegal))),
      "ISPRProcurement": this.addPOForm.value.isPRConsent == null ? null : (Boolean(JSON.parse(this.addPOForm.value.isPRConsent))),
       "RejectionReason":this.addPOForm.value.RejectionReason || null,
       "DeliveryDate": this.datepipe.transform(this.addPOForm.controls['DeliveryDate'].value, 'yyyy-MM-dd', 'es-ES') || null,
       "Conditions": 0,
       "Tin_Tan": this.addPOForm.value.Tin_Tan || null,
       "ShippingCharges": parseFloat(this.addPOForm.value.ShippingCharges) || 0,
    }
    return object;

  }
  formInitialization(data?) {
    this.addPOForm = this.formBuilder.group({
      'PRNumber': [data ? data.PRNumber : null, [Validators.required]],
      'VendorReferedBy': [data ? data.VendorReferedBy : null,],
      'VendorName': [data ? data.VendorName : null, [Validators.required]],
      'ContactName': [data ? data.ContactName : null, [Validators.required]],
      'Phone': [data ? data.Phone : null, Validators.required],
      'EmailId': [data ? data.EmailId : null, [Validators.required, Validators.email]],
      'Tax': [data ? data.Tax : 0, [Validators.required]],
      'GSTIN': [data ? data.GSTIN : null, ],
      'PAN': [data ? data.PAN : null, ],
      'VendorAddress': [data ? data.VendorAddress : null, [Validators.required]],
      'ShippingAddress': [data ? data.ShippingAddress : null,],
      'Comments': [data ? data.Comments : null,],
      'BillingAddress': [data ? data.BillingAddress : null, [Validators.required]],
      'CreditTerms': [data ? data.CreditTerms : null, [Validators.required]],
      'TerminationClause': [data ? data.TerminationClause : null, [Validators.required]],
      'PRFOR': [data ? data.PRFOR : null,],
      'Quantity': [data ? data.Quantity : null,],
      'Duration': [data ? data.Duration : null,],
      'PricePerUnit': [data ? data.PricePerUnit : null,],
      'Total': [data ? data.Total : null,],
      'LocationId': [data ? data.LocationId : null,],
      'files': [[]],
      'flowEnabled': [false],
      'isLegal': [false,],
      'isPRConsent':[false,],
      'RejectionReason': [data ? data.RejectionReason : null,],
      'DeliveryDate': [data ? this.datepipe.transform(data.requestDeliveryDate, 'MM/dd/yyyy') : null, [Validators.required]],
      'currencyType': [data ? data.currencyType : null,],
      'Conditions': [ 0],
      //'LoactionId': [data ? data.LoactionId : 0],
      'Tin_Tan': [data ? data.Tin_Tan : null, ],
      'ShippingCharges': [data ? data.ShippingCharges : 0],
    });
  }
  addvalidation(){
    const userData = JSON.parse(sessionStorage.getItem('userDetail'));
    const empEmidsId = userData.EmployeeId;
    this.purchaseorderservice.GetPOUserDetails(empEmidsId).subscribe((response: any) => {
      if (response) {
        this.POUserRoles = response;
        if(this.POUserRoles[0].isprLegal == true ){
          this.status=true;
          this.rejectStatus=true;
        }
        if(this.POUserRoles[0].isprProcurement == true){
          this.status=true;
          this.status1=true;
          this.rejectStatus=true
         
        }
      }
    }, (error: any) => {
      this.toastService.showError(error, 'Error');
    })
      

  }
  openAddDialog(note: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const dialogRef = this.dialog.open(ConfirmPurchaseOrderComponent, {
        width: '800px',
        height: '100px',
        position: { top: '170px' },
        data: {
          message: note ,
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        // Handle the result here based on 'yes' or 'no'
        if (result === 'yes') {
          resolve(result); // Resolve with the result if needed
        } else {
          reject('User chose not to proceed.'); // Optionally reject with a reason
        }
      });
    });
  }
  onSubmitRejectForm(){
    const POID=this.POId
    this.EditRejectForm(POID);
  }
  EditRejectForm(POID: Number): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const dialogRef = this.dialog.open(RejectpoComponent, {
        width: '600px',
        height: '200px',
        position: { top: '170px' },
        data: POID
      });

      dialogRef.afterClosed().subscribe(result => {
        // Handle the result here based on 'yes' or 'no'
        if (result === 'yes') {
          resolve(result); // Resolve with the result if needed
        } else {
          reject('User chose not to proceed.'); // Optionally reject with a reason
        }
      });
    });
  }
  onFileSelected(event: any): void {
    let totalSize = 0;

    for (let i = 0; i < event.target.files.length; i++) {
      totalSize += event.target.files[i].size;
    }
    if (totalSize > 14680064) { // 14 MB
      this.toastService.showError('File is too large.', 'Error');
      return;
    }
    const newFiles: File[] = Array.from(event.target.files); 
    this.selectedFiles = [...this.selectedFiles, ...newFiles];
    this.addPOForm.get('files').setValue(this.selectedFiles); 
    this.onSelectFiles.emit(this.selectedFiles);
  }

  openFile(file: File): void {
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    a.click();
    event.preventDefault();

  }
  

  removeFile(index: number): void {
    if (index > -1 && index < this.selectedFiles.length) {
      this.selectedFiles.splice(index, 1);
      this.addPOForm.get('files').setValue(this.selectedFiles); // Update form control value
      this.onSelectFiles.emit(this.selectedFiles);
    }
  }
  onFlowCheckboxChange(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      const firstTextBoxValue = this.addPOForm.get('BillingAddress').value;
      this.addPOForm.get('ShippingAddress').setValue(firstTextBoxValue);
    } else {
      this.addPOForm.get('ShippingAddress').setValue('');
    }
  }
  async onSubmitPOForm():Promise<void> {
    debugger;
    const requestBody = this.generatePOBody();
    const formData = new FormData();
    const files = this.addPOForm.get('files').value;
    for (let i = 0; i < this.selectedFiles.length; i++) {
      formData.append('files', this.selectedFiles[i]);
    }
    requestBody['Id'] = this.isAddPO === 'true' ? 0 : this.POId;
    if(this.isAddPO == 'false'){
      var isLegal = this.addPOForm.controls['isLegal'].value;
      var isPRConsent = this.addPOForm.controls['isPRConsent'].value;
      if((isLegal && this.POUserRoles[0].isprLegal== true) ||(this.POUserRoles[0].isadmin==true && isLegal!=this.EditPOList[0].isLegal) ){
        await this.openAddDialog("Please note that Legal consent is set as checked and clicking Yes will mark PO as legal approved")
      }
      if(isPRConsent && (this.POUserRoles[0].isprProcurement== true || this.POUserRoles[0].isadmin==true)){
        await this.openAddDialog("Please note that PR Team Consent is set as checked and clicking Yes will mark PO as PR Team approved")
      }
      requestBody['ISLegal']=isLegal;
    }
    console.log('Conditions value:', requestBody);
    requestBody['Pr_Id']=this.addPOForm.get('PRNumber').value
      // Append additional data as JSON string
      formData.append('additionalData', JSON.stringify(requestBody));
      // Append files to FormData
      this.selectedFiles.forEach((file) => {
        formData.append('files', file, file.name);
      });
      const updatedItems = this.EditPRList.map((_, index) => ({
        Tax: (document.getElementById(`tax_${index}`) as HTMLInputElement).value,
        LineItemId: (document.getElementById(`lineItemId_${index}`) as HTMLInputElement).value
      }));
      formData.append('TaxData', JSON.stringify(updatedItems));
    debugger;
    if (this.addPOForm.valid) {
      if (requestBody['Id'] != 0) {
        
        debugger;
        this.purchaseorderservice.UpdatePurchaseOrder(formData).subscribe((response: any) => {
          debugger;
          if (response && !response.isError) {
            this.toastService.showSuccess(response.message, 'Success');
            this.addPOForm.reset();
            this.router.navigate(['/purchase-order']);
            this.PO_Id = this.POId;
           // this.updateLineItems()
            if(requestBody['ISLegal']== true && requestBody['ISPRProcurement']== true ){
              this.UploadPurchaseOrderReporttoSharepoint();
            }
          }
          else {
            this.toastService.showError(response.message, 'Error');
            return;
          }
        }, (error: any) => {
          this.toastService.showError(error, 'Error');
        });
      }
      else {
        this.purchaseorderservice.savePurchaseOrder(formData).subscribe((response: any) => {
          debugger;
          if (response && !response.isError) {
            this.toastService.showSuccess(response.message, 'Success');
            this.addPOForm.reset();
            this.router.navigate(['/purchase-order']);
            this.PO_Id = response.data;
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
    else {
      this.addPOForm.markAllAsTouched();
    }
  }
  
  convertFileArrayToFileList(files: File[]): FileList {
    const fileArray = Array.from(files);
    const fileUpload = new DataTransfer();
    fileArray.forEach((file: File) => {
      fileUpload.items.add(file);
    });
    return fileUpload.files;
  }
  getPRNumbers(Id, empEmidsId) {
    this.purchaseorderservice.GetPRNumbers(Id, empEmidsId).subscribe((response: any) => {
      if (response) {
        this.PRList = response;
      }
    }, (error: any) => {
      this.toastService.showError(error, 'Error');
    })
  }
  handleFileInput(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    for (let i = 0; i < files.length; i++) {
      this.files.push(files[i]);
    }
  }
  onFileChange(event) {
    debugger;
    const files = (event.target as HTMLInputElement).files;
    if (files && files.length > 0) {
      const filesArray: File[] = Array.from(files);
      this.selectedFiles.push(...filesArray);
    }
  }
  
  UploadPurchaseOrderReporttoSharepoint() {
    debugger;
    var Filename;
    var LocationId;
    this.purchaseorderservice.GetPOEditDetails(this.PO_Id).subscribe((response: any) => {
      if (response) {
        this.EditPOList = response;
        const object = {
          Id: this.PO_Id,
          url: PO_URLS.UPLOAD_PDF,
          fileName: this.EditPOList[0].poNumber + ".pdf",
          LocationId: this.EditPOList[0].locationId,
          PO_Number:this.EditPOList[0].poNumber
        }
   
        this.purchaseorderservice.UploadPdf(object).subscribe((data: HttpResponse<any>) => {
          if (data.status === 200 || data.status === 202) {
            this.toastService.showSuccess("File uploaded successfully.", 'Success');
            const blob = new Blob([data.body], { type: "application/pdf" });
            var downloadURL = window.URL.createObjectURL(blob);
            var link = document.createElement('a');
            link.href = downloadURL;
            link.download = "PurchaseOrder_Opex_Capex.pdf";
            window.open(downloadURL);
            //link.click();    
            link.href = "";
            window.URL.revokeObjectURL(downloadURL);
          }
        },
          (err: HttpErrorResponse) => {
            this.toastService.showError("Error occured while Uploading File! Please try again.", 'Error');  //err.message
            if (err.status === 403) {
              console.error('403 status code caught');
            }
          }
        );
      }
    }, (error: any) => {
      this.toastService.showError(error, 'Error');
    })
   
  }


  onKeyPress(event: KeyboardEvent) {
    const keyCode = event.which || event.keyCode; 

    if ((keyCode >= 48 && keyCode <= 57) || keyCode === 8) {
    } else {
      if ((event.target as HTMLInputElement).value === '' && keyCode !== 8) {
        event.preventDefault();
      }
      event.preventDefault();
    }
  }
  onPress(event: KeyboardEvent) {
    const keyCode = event.which || event.keyCode;
    const currentValue = (event.target as HTMLInputElement).value;
  
    // Allow digits (0-9) and dot (.) key, and backspace (8)
    if ((keyCode >= 48 && keyCode <= 57) || keyCode === 46 || keyCode === 8) {
      // Check if dot (.) is already present
      if (keyCode === 46 && currentValue.includes('.')) {
        event.preventDefault();
      }
    } else {
      event.preventDefault(); // Prevent any other key
    }
  }
  
  onInput(event: Event) {
    const inputElement = event.target as HTMLInputElement;
  
    if (inputElement instanceof HTMLInputElement) {
      // Get the value of the input field after the paste
      const pastedText = inputElement.value;
  
      // Remove any non-numeric characters from the pasted text
      const cleanText = pastedText.replace(/[^\d]/g, '');
  
      // Update the input field value with the cleaned text
      inputElement.value = cleanText;
    }
  }
  openEditDialog(){

  }
  onCheckboxChange(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    debugger;
    // Update the button text based on the checkbox state
    this.buttonText = isChecked ? 'APPROVE' : 'SAVE';
  }
  calculateTotal(index: number, taxPercentage: number): void {
    const item = this.EditPRList[index];
    item.tax = taxPercentage;

    // Calculate total amount based on tax percentage
    const total = item.quantity * item.pricePerUnit * (1 + (taxPercentage / 100));
    item.totalAmount = total;
  }

  calculateTotalValue(item: any): number {
    return item.quantity * item.pricePerUnit * (1 + (item.tax / 100));
  }
  
  // onChangeTax(event){
  //   const num2 = this.addPOForm.get('Tax').value;
  //   if(this.isAddPO == "true"){
  //     this.getPRTotalPrice(this.PR_ID);
  //     const taxResult = (this.EditPRList[0].totalPrice)*(num2/100);
  //     if(num2==0){
  //       this.addPOForm.patchValue({
  //         Total: this.EditPRList[0].totalPrice
  //       });
  //     }
  //     else{
  //     this.addPOForm.patchValue({
  //       Total: this.EditPRList[0].totalPrice + taxResult
  //       //Total: num1 + (num1 * result)
  //     });
  //   }
  //   }
  //   else{
  //     const taxResult = (this.EditPOList[0].pR_Value)*(num2/100);
  //     if(num2==0){
  //       this.addPOForm.patchValue({
  //         Total: this.EditPOList[0].pR_Value
  //       });
  //     }
  //     else{
  //     this.addPOForm.patchValue({
  //       Total: this.EditPOList[0].pR_Value + taxResult
  //       //Total: num1 + (num1 * result)
  //     });
  //   }
  //   }
  // }

  // updateResult(): void {
  //   debugger;
    
  //   const num2 = this.addPOForm.get('Tax').value;
  //   if(this.isAddPO){
  //     this.getPRTotalPrice(this.PR_ID);
  //     const taxResult = (this.EditPRList[0].totalPrice)*(num2/100);
  //     if(num2==0){
  //       this.addPOForm.patchValue({
  //         Total: this.EditPRList[0].totalPrice
  //       });
  //     }
  //     else{
  //     this.addPOForm.patchValue({
  //       Total: this.EditPRList[0].totalPrice + taxResult
  //       //Total: num1 + (num1 * result)
  //     });
  //   }
  //   }
  //   else{
  //     const taxResult = (this.EditPRList[0].totalPrice)*(num2/100);
  //     if(num2==0){
  //       this.addPOForm.patchValue({
  //         Total: this.EditPRList[0].totalPrice
  //       });
  //     }
  //     else{
  //     this.addPOForm.patchValue({
  //       Total: this.EditPRList[0].totalPrice + taxResult
  //       //Total: num1 + (num1 * result)
  //     });
  //   }
  //   }
  // }

  onSelect(event: any): void {
    debugger;
    var PRId = event.target.value;
    this.PRFiles = [];
    if (PRId.includes("0: null")) {
      this.EditPRList= []
      this.addPOForm.reset();
    }
    else {
      this.getPRDetails(PRId)
    }
  }
  openPRDocumnet(prNumber: string, fileName: string) {
    debugger;
    var FileName = fileName
    var POId = prNumber
    const object = {
        FileName: fileName,
        POId: prNumber
    };

    this.purchaseorderservice.getUploadFIle(object).subscribe((response: any) => {
      // var fileName = response.headers.get('x-file-name');
      // console.log(fileName);
      const contentType = this.getContentTypeFromExtension(fileName);

      debugger;
      const blob = new Blob([response.body], { type: contentType });
      var downloadURL = window.URL.createObjectURL(blob);
      var link = document.createElement('a');
      link.href = downloadURL;
      link.name = FileName;
      link.title = FileName;
      link.download = FileName;
      //window.open(downloadURL);
      link.click();
      link.href = "";
      window.URL.revokeObjectURL(downloadURL);
    });
  }
  openuploadDocumnet(fileName) {
    const POId = this.POId;
    var FileName = fileName;
    debugger;
    var Id;
    this.purchaseorderservice.GetPOEditDetails(this.POId).subscribe((response: any) => {
      if (response) {
        this.EditPOList = response;
        Id=this.EditPOList[0].poNumber
        // console.log(this.EditPOList[0])
      }
    }, (error: any) => {
      this.toastService.showError(error, 'Error');
    })
    const object = {
      FileName: FileName,
      POId: this.EditPOList[0].poNumber
    }
    this.purchaseorderservice.getUploadFIle(object).subscribe((response: any) => {
      // var fileName = response.headers.get('x-file-name');
      // console.log(fileName);
      const contentType = this.getContentTypeFromExtension(fileName);

      debugger;
      const blob = new Blob([response.body], { type: contentType });
      var downloadURL = window.URL.createObjectURL(blob);
      var link = document.createElement('a');
      link.href = downloadURL;
      link.name = FileName;
      link.title = FileName;
      link.download = FileName;
      //window.open(downloadURL);
      link.click();
      link.href = "";
      window.URL.revokeObjectURL(downloadURL);
    });
  }
  getContentTypeFromExtension(fileName: string): string {
    const fileExtension = this.getFileExtension(fileName);

    switch (fileExtension.toLowerCase()) {
      case 'pdf':
        return 'application/pdf';
      case 'doc':
      case 'docx':
        return 'application/msword';
      case 'txt':
        return 'text/plain';
      default:
        return null; // Default content type for unknown types
    }
  }
  private getFileExtension(fileName: string): string {
    return fileName.split('.').pop();
  }
  truncateFileName(name: string): string {
    const maxLength = 45; // Max length before truncation
    if (name.length > maxLength) {
      return name.substring(0, maxLength) + '...'; // Append ellipsis (...) if truncated
    } else {
      return name;
    }
  }
  getPRDetails(Id) {
    this.PR_ID = Id;
    debugger;
    this.purchaseorderservice.GetPRDetails(Id).subscribe((response: any) => {
      if (response) {
        debugger;
        this.EditPRList = response;
        console.log('editprlist',this.EditPRList)
        
        this.LocationId = this.EditPRList[0].prLocationId
        console.log(' this.LocationId', this.LocationId)
        if(this.EditPRList[0].requisitionType==1){
          this.isDuration=true;
        }
        else{
          this.isDuration=false;
        }
        // const totalTaxValue = this.EditPRList.reduce((sum, item) => {
        //   return sum + (item.get('tax').value || 0);
        // }, 0);
        
        const totalTaxValue = this.EditPRList.reduce((sum, item) => sum + item.tax, 0);
        
        if(this.isAddPO == "true"){
          this.addPOForm.patchValue({
            Total: this.EditPRList[0].totalPrice
          });
      }else{

        if(totalTaxValue==0){
          this.addPOForm.patchValue({
            Total: this.EditPRList[0].totalPrice
          });
        }
        else{          
          // const taxResult = (this.EditPRList[0].totalPrice)*(this.EditPRList[0].tax/100);
          // const taxResult = (this.EditPRList[0].totalPrice)*(totalTaxValue/100);
          // const totalSumValue = this.EditPRList.controls.reduce((sum, item) => {
          //   return sum + ((item.get('linePRValue').value)*(item.get('tax').value/100) || 0);
          // }, 0);
          const totalSumValue = this.EditPRList.reduce((sum, item) => {
            return sum + (((item.linePRValue)*(item.tax/100) + item.linePRValue) || 0);
          }, 0);
          //console.log("totalSumValue",totalSumValue);
          this.addPOForm.patchValue({
            //Total: this.EditPRList[0].totalPrice 
             Total:  totalSumValue 
            //this.EditPRList[0].totalPrice + taxResult
            //Total: num1 + (num1 * result)
          });
      }
      }
      this.savedFileNamesString = response[0].fileNames; 
        this.PRFiles = this.fetchSavedFiles(this.savedFileNamesString);
      }
    }, (error: any) => {
      this.toastService.showError(error, 'Error');
      console.log(error);
    })
  }

  getPRTotalPrice(Id) {
    this.PR_ID = Id;
    this.purchaseorderservice.GetPRDetails(Id).subscribe((response: any) => {
      debugger;
      if (response) {
        this.EditPRList = response;
      }
    }, (error: any) => {
      this.toastService.showError(error, 'Error');
      console.log(error);
    })
  }
  updateTotal(): void {
    debugger;
    let sum = 0;
    const editListLength = this.EditPRList.length;
    let sumPRValue = 0;
    let sumTaxContribution = 0;
    for (let i = 0; i < this.EditPRList.length; i++) {
      const tax = parseFloat((document.getElementById(`tax_${i}`) as HTMLInputElement).value) || 0;
      const linePRValue = parseFloat((document.getElementById(`linePRValue_${i}`) as HTMLInputElement).value) || 0;

      // Sum of PRValue
      sumPRValue += linePRValue;

      // Tax contribution (Tax is assumed to be a percentage, so divide by 100 to convert to decimal)
      sumTaxContribution += (linePRValue * (tax / 100.0));
  }

  // Total sum = Sum of PRValue + Sum of Tax Contribution
  const total = sumPRValue + sumTaxContribution;
    this.addPOForm.get('Total').setValue(total);

    // (document.getElementById('lname') as HTMLInputElement).value = this.total.toFixed(2);
  }
  // _keyUp(event: any) {
  //   console.log('Key up event triggered');
  //   const pattern = /[0-9]/; // Removed \s
  //   let inputChar = String.fromCharCode(event.key);
  //   console.log('Input character:', inputChar);

  //   if (!pattern.test(inputChar)) {
  //     console.log('Invalid character detected. Preventing input.');
  //     event.preventDefault();
  //   }
  // }
  fetchSavedFiles(namesString: string): { name: string }[] {
    debugger;
    // Split the namesString into an array of names
    let namesArray = namesString.split(':').map(name => ({ name: name.trim() }));
    return namesArray;
  }
  getPOEditDetails(Id) {
    this.purchaseorderservice.GetPOEditDetails(Id).subscribe((response: any) => {
      debugger;
      if (response) {
        this.EditPOList = response;
        console.log('API Conditions:', this.EditPOList[0].conditions); // Verify API data
        console.log('response',this.EditPOList)
        //this.EditPRList=response;
        if(this.EditPOList[0].prStatus == 8){
          this.status=false;
          this.status1=false;
         }
        if(this.EditPOList[0].isLegal){
        this.addPOForm.controls['isLegal'].disable();
        }
        this.isDisabled=true;
        if (this.EditPOList[0].fileNames != '' && this.EditPOList[0].fileNames != null) {
          debugger;
          this.savedFileNamesString = this.EditPOList[0].fileNames; // Replace with your actual big string

          this.savedFiles = this.fetchSavedFiles(this.savedFileNamesString);
        }
        this.addPOForm.get('isLegal').setValue(this.EditPOList[0].isLegal); // Update form control value
        // const result = this.EditPOList[0].tax / 100
        // const total = this.EditPOList[0].pR_Value + (this.EditPOList[0].pR_Value) * result
        this.addPOForm.patchValue({
          Conditions: Number(this.EditPOList[0].conditions) // Force number type
        });
  
        // Debug after patching
        setTimeout(() => {
          console.log('Form Conditions:', 
            this.addPOForm.get('Conditions')?.value,
            'Type:', 
            typeof this.addPOForm.get('Conditions')?.value
          );
        }, 0);
      }
        debugger;
        this.addPOForm.patchValue({
          PRNumber: this.EditPOList[0].pR_Id,
          VendorReferedBy: this.EditPOList[0].vendorReferedBy,
          VendorName: this.EditPOList[0].vendorName,
          ContactName: this.EditPOList[0].contactName,
          Phone: this.EditPOList[0].phone,
          EmailId: this.EditPOList[0].emailId,
          Tax: this.EditPOList[0].tax,
          GSTIN: this.EditPOList[0].gstin,
          PAN: this.EditPOList[0].pan,
          VendorAddress: this.EditPOList[0].vendorAddress,
          ShippingAddress: this.EditPOList[0].shippingAddress,
          BillingAddress: this.EditPOList[0].billingAddress,
          CreditTerms: this.EditPOList[0].creditTerms,
          TerminationClause: this.EditPOList[0].terminationClause,
          islegal:this.EditPOList[0].isLegal,
          Comments:this.EditPOList[0].comments,
          Total: this.EditPOList[0].pR_Value,
          RejectionReason:this.EditPOList[0].reason,
          DeliveryDate:this.datepipe.transform(this.EditPOList[0].deliveryDate, 'MM/dd/yyyy'),
          Conditions:this.EditPOList[0].conditions,
          //LocationId: this.EditPOList[0].LocationId,
          Tin_Tan: this.EditPOList[0].tin_Tan,
          ShippingCharges: this.EditPOList[0].shippingCharges
        });

    }, (error: any) => {
      this.toastService.showError(error, 'Error');
    })
  }
//   updateLineItems() {
//     // Collect the `tax` and `lineItemId` values
    

//     // Send the collected data to the backend
//     this.purchaseorderservice.updateTaxDetails(updatedItems).subscribe((response: any) => {
//       debugger;
//       if (response && !response.isError) {
//         this.toastService.showSuccess(response.message, 'Success');
//         console.log(updatedItems);
//         this.addPOForm.reset();
//         this.router.navigate(['/purchase-order']);
//         this.PO_Id = response.data;
//       }
//       else {
//         this.toastService.showError(response.message, 'Error');
//         return;
//       }
//     }, (error: any) => {
//       this.toastService.showError(error, 'Error');
//     });
// }
openterms(LocationId?): void {
  this.dialog.open(PoTermsconditionsComponent, {
    data: { LocationId: LocationId}
  });
}
@ViewChild('billingRef') billingRef!: ElementRef;
@ViewChild('shippingRef') shippingRef!: ElementRef;

onTextChange(event: any) {
  this.updateCursorPosition(event);
  this.showSuggestions = true;
}

updateCursorPosition(event: any) {
  this.cursorPosition = event.target.selectionStart;
}
onSuggestionClick(event: MouseEvent, suggestion: string) {
  event.preventDefault(); // Prevent blur from firing before this
  if (this.activeField === 'billing') {
    this.insertBillingSuggestion(suggestion);
  } else if (this.activeField === 'shipping') {
    this.insertShippingSuggestion(suggestion);
  }
}

insertBillingSuggestion(suggestion: string) {
  this.insertSuggestionHelper('billing', suggestion);
}

insertShippingSuggestion(suggestion: string) {
  this.insertSuggestionHelper('shipping', suggestion);
}

insertSuggestionHelper(field: 'billing' | 'shipping', suggestion: string) {
  const ref = field === 'billing' ? this.billingRef.nativeElement : this.shippingRef.nativeElement;
  const newText = suggestion;

  if (field === 'billing') {
    this.billingAddressValue = newText;
    this.addPOForm.controls['BillingAddress'].setValue(newText);
  } else {
    this.shippingAddressValue = newText;
    this.addPOForm.controls['ShippingAddress'].setValue(newText);
  }

  // Set cursor to end of suggestion
  setTimeout(() => {
    const newCursorPos = newText.length;
    ref.setSelectionRange(newCursorPos, newCursorPos);
    ref.focus();
  }, 0);

  this.showSuggestions = false;
}

hideSuggestionsWithDelay() {
  setTimeout(() => {
    this.showSuggestions = false;
  }, 200);
}
ngAfterViewInit() {
  document.addEventListener('click', this.handleClickOutside.bind(this));
}

handleClickOutside(event: MouseEvent) {
  const target = event.target as HTMLElement;
   
  const billingClicked = this.billingRef?.nativeElement.contains(target);
  const shippingClicked = this.shippingRef?.nativeElement.contains(target);

  if (!billingClicked && !shippingClicked) {
    this.showSuggestions = false;
  }
}

ngOnDestroy() {
  document.removeEventListener('click', this.handleClickOutside.bind(this));
}
}

