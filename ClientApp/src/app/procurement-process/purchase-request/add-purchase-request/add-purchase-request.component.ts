import { Component, OnInit, ElementRef, Renderer2, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { formatDate } from '@angular/common';
import { FormGroup, FormBuilder, Validators, FormArray, AbstractControl, ValidatorFn } from '@angular/forms';
import { filter, map } from 'lodash';
import { ToastService } from '../common-helper/toast-alert/toast-alert.service';
import { PurchaseRequestService } from '../purchase-request.service';
import {
  CONFIRM_VALUES, PLACEMENT_TYPE, CURRENCY_TYPE, BILLING_TYPE, EMPLOYMENT_TYPE, BILLING_FREQUENCY,
  EDUCATION_TYPE, SERVICE_TYPE, AUTHORIZATION_STATUS, PAYMENT_TYPE, SKILLS_LIST
} from 'src/app/common/configuration.settings';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-add-purchase-request',
  templateUrl: './add-purchase-request.component.html',
  styleUrls: ['./add-purchase-request.component.scss']
})
export class AddPurchaseRequestComponent implements OnInit {

  addPRForm: FormGroup;
  projectList: any;
  resourceAction: any;
  isAddPR: any;
  purchaseRequestId: any;
  prDate: any;
  yesNoValues: any = CONFIRM_VALUES;
  currencyValues: any;
  requestBody: any;
  PRData: any;
  PRStatus: any;
  PRLocation: any;
  PurchaseRequestDetails: any;
  PRItems: any;
  PurchaseRequestDate: any;
  hiddenField: boolean = true;
  isApprover: boolean;
  isDuration: boolean = false;
  today: Date = new Date();
  RequisitionType: any;
  AccountName: any;
  CityList: any;
  requestDeliveryDate: any;
  isDisableItemValue: boolean = true;
  isRadioDisabled = false;
  totalPrice: any;
  isValidPrice: boolean = true;
  isSubmitting: boolean = false;
  totalValue : any;
  priceLabel: string = 'Price Per Unit (Approx per days)';
  selectedFiles: File[] = [];
  savedFileNamesString: string = "";
  savedFiles: { name: string }[] = [];
  isEdit: any;
  button:any;
  BuyersList: any;
  @Output() onSelectFiles: EventEmitter<File[]> = new EventEmitter<File[]>();
  constructor(private purchaseRequestService: PurchaseRequestService, private toastService: ToastService, private datepipe: DatePipe,
    private activatedRoute: ActivatedRoute, private formBuilder: FormBuilder, private router: Router,
    private renderer: Renderer2, private elementRef: ElementRef) {
    this.PurchaseRequestDate = undefined;
    this.requestDeliveryDate = undefined;
    this.prDate = undefined;
    this.isApprover = false;
  }

  ngOnInit(): void {
    this.formInitialization();
    this.getProjectListByEmpId();
    this.getPRStatus();
    this.getPRLocation();
    this.getRequisitionType();
    this.getCurrencyType();
    const userData = JSON.parse(sessionStorage.getItem('userDetail'));
    this.addPRForm.patchValue({
      requestor: userData.UserName
    });
    this.button = 1
    this.addPRForm.controls['requestor'].disable();
    this.addPRForm.controls['accountName'].disable();
    this.addPRForm.controls['deliveryHeadName'].disable();
    this.addPRForm.controls['prDate'].disable();
    this.addPRForm.controls['approvedBy'].disable();
    this.addPRForm.controls['rejectedComments'].disable();
    this.activatedRoute.queryParams.subscribe((params) => {
      this.resourceAction = params.isAdd === "true" ? 'New ' : 'Edit ';
      this.isAddPR = params.isAdd;
      this.isEdit = params.isEdit;
      if (params.isAdd !== "true" && params.isEdit == 1) {
        this.purchaseRequestId = parseInt(params.id);
        this.button = 1
        this.getPRDetails(this.purchaseRequestId);
      }
      else if (params.isAdd !== "true" && params.isEdit == 0){
        this.button = 0
        
        this.purchaseRequestId = parseInt(params.id);
        this.getPRDetails(this.purchaseRequestId);
        this.addPRForm.disable();
        this.disableFormControls();
      }
    });
    if(this.isAddPR !== "true" && this.isEdit == 1){
      this.button = 1
      this.purchaseRequestService.getPurchaseRequestById(this.requestBody).subscribe((response: any) => {
        debugger;
        if (response) {
          this.PurchaseRequestDetails = response.prDetails;
          console.log("Buyer",this.PurchaseRequestDetails)
          if(this.PurchaseRequestDetails.isSupport){
            this.addPRForm.controls['isBillableToClient'].disable();
            this.addPRForm.controls['IncludedinRLS'].disable(); 
            //this.addPRForm.controls['HasApprovedratecard'].disable();
          }
        }
      }, (error: any) => {
        this.toastService.showError(error, 'Error');
      });
    }
    else if (this.isAddPR !== "true" && this.isEdit == 0){
      this.button = 0
      
      this.purchaseRequestService.getPurchaseRequestById(this.requestBody).subscribe((response: any) => {
        debugger;
        if (response) {
          this.PurchaseRequestDetails = response.prDetails;
          if(this.PurchaseRequestDetails.isSupport){
            this.addPRForm.controls['isBillableToClient'].disable();
            this.addPRForm.controls['IncludedinRLS'].disable(); 
            this.addPRForm.controls['HasApprovedratecard'].disable();
          }
        }
      }, (error: any) => {
        this.toastService.showError(error, 'Error');
      });
      this.addPRForm.disable();
      this.disableFormControls();
    }
   
  }
  disableFormControls() {
    this.addPRForm.disable();
    for (const i in this.lineItems.controls) {
      const index = Number(i);
      const itemGroup = this.lineItems.at(index) as FormGroup;
  
      ['duration', 'prFor', 'quantity', 'durationNo', 'pricePerUnit', 'prValue'].forEach(controlName => {
        if (itemGroup.get(controlName)) itemGroup.get(controlName).disable();
      });
    }
  }
  formInitialization(data?) {
    debugger;
    this.addPRForm = this.formBuilder.group({
      'prId': [data ? data.id : 0, [Validators.required]],
      'accessType': [data ? data.isApprover : 0],
      'prRoleName': [data ? data.pR_RoleName : ''],
      'requestor': [data ? data.requestorName : 0, [Validators.required]],
      'prDate': [data ? this.datepipe.transform(data.pR_Date, 'MM/dd/yyyy') : formatDate(this.today, 'MM/dd/yyyy', 'en'), [Validators.required]],
      'prDeliveryDate': [data ? this.datepipe.transform(data.requestDeliveryDate, 'MM/dd/yyyy') : null, [Validators.required]],
      'projectName': [data ? data.projectId : null, [Validators.required]],
      'accountName': [data ? data.accountName : null, ''],
      'deliveryHeadName': [data ? data.deliveryHeadName : null, ''],
      'deliveryHeadId': [data ? data.deliveryHeadId : null, ''],
      'requisitionType': [data ? data.requisitionType : null, [Validators.required]],
      'businessRationale': [data ? data.businessRationale.trim() : '',[Validators.required]],
      'currencyType': [data ? data.currencyType : null, [Validators.required]],
      'isBudgeted': [data ? data.isBudgeted : null, [Validators.required]],
      'isBillableToClient': [data ? data.isBillableToClient : null, [Validators.required]],
      'IncludedinRLS': [data ? data. includedinRLS: null, [Validators.required]],
      'HasApprovedratecard': [data ? data.hasApprovedratecard : null, [Validators.required]],
      'prStatus': [data ? data.pR_StatusId : 1, [Validators.required]],
      'prLocation': [data ? data.prLocationId : null, [Validators.required]],
      'prCity': [data ? data.city : null, [Validators.required]],
      'approvedBy': [data ? data.approverName : ''],
      'rejectedComments': [data ? data.rejectComments : ''],
      'recommendedVendor': [data ? data.recommendedVendor : ''],
      // lineItems: data ? this.formBuilder.array([this.createLineItem(this.PRItems)]) : this.formBuilder.array([this.createLineItem(data)]),
      lineItems: data ? this.appendLineItem(this.PRItems) : this.formBuilder.array([]),
      'totalValue': [data ? data.totalPrice : 0],
      'files': [[]],
      'prBuyer': [data ? data.buyers : null, [Validators.required]],
    })
  }

  get lineItems(): FormArray {
    return this.addPRForm.get('lineItems') as FormArray;
  }

 
  createLineItem(data?): FormGroup {
    return this.formBuilder.group({
      'prFor': [data ? data.itemDescription : '', Validators.required],
      'quantity': [data ? data.quantity : null, Validators.required],
      'durationNo': [data ? data.durationNo : null, Validators.required],
      'duration': [data ? data.serviceDuration : null, Validators.required],
      'pricePerUnit': [data ? data.pricePerUnit : null, Validators.required],
      'prValue': [data ? data.prValue : null, Validators.required]
    });
  }
   updateLabel(index:any) {
    const dropdown = document.getElementById("timeUnitDropdown");
    const label = document.getElementById("priceLabel");
    label.innerText = `Price Per Unit (Approx per ${dropdown})`;
}
getPriceLabel(duration: string): string {
  switch (duration) {
    case 'Months':
      return 'Price Per Month';
    case 'Years':
      return 'Price Per Year';
    case 'Days':
      return 'Price Per Days';
    default:
      return 'Price Per Unit'; // Default label for days
  }
}
  addLineItem() {
    if (this.lineItems.length < 100) {
      this.lineItems.push(this.createLineItem());
    }

    if (this.addPRForm.get('requisitionType').value == '1') {
      this.disableServiceDuration('1');
      this.disableDurationNo('1');
    }
  }

  appendLineItem(data?) {
    if (data) {
      this.removeLineItem(0);
      data.forEach(element => {
        var result = this.createLineItem(element);
        this.lineItems.push(result);
      });
    }
    return this.lineItems;
  }

  removeLineItem(index: number) {
    if (this.lineItems.length > 1) {
      this.lineItems.removeAt(index);
      this.updateTotalValue();
    }
  }

  getInputClass(index: number): string {
    return `disable-quantity-${index}`;
  }

  disableServiceDuration(serviceDurationValue) {
    if (this.lineItems.controls.length > 0) {
      for (const i in this.lineItems.controls) {
        var index = Number(i);
        const itemGroup = this.lineItems.at(index);
        const isDisabled = itemGroup.get('duration').disabled; // Check current disabled state

        if (serviceDurationValue == '1') {
          itemGroup.get('duration').setValue(0);
          itemGroup.get('duration').disable();
        }
        else {
          itemGroup.get('duration').enable();
          itemGroup.get('duration').setValue(null);
        }
      }
    }
  }
  disableDurationNo(durationValue) {
    if (this.lineItems.controls.length > 0) {
      for (const i in this.lineItems.controls) {
        var index = Number(i);
        const itemGroup = this.lineItems.at(index);
        const isDisabled = itemGroup.get('durationNo').disabled; // Check current disabled state

        if (durationValue == '1') {
          itemGroup.get('durationNo').setValue(0);
          itemGroup.get('durationNo').disable();
        }
        else {
          itemGroup.get('durationNo').enable();
          itemGroup.get('durationNo').setValue("");
        }
      }
    }
  }

  onSelectRequisition(event) {
    debugger;
    if (event.target.value != null && event.target.value != undefined && event.target.value != 'null') {
      if (event.target.value == '1') {
        this.disableServiceDuration('1');
        this.disableDurationNo('1');
        this.isDuration= true;
      }
      else {
        this.disableServiceDuration('2');
        this.disableDurationNo('2');
        this.isDuration = false;

      }
    }
    else {
      this.disableServiceDuration('2');
      this.disableDurationNo('2');
    }
  }

  getProjectListByEmpId() {
    const userData = JSON.parse(sessionStorage.getItem('userDetail'));
    const empEmidsId = userData.EmployeeId; //'INEMP019';
    this.purchaseRequestService.getProjectListByEmpEmidsId(empEmidsId).subscribe((response: any) => {
      if (response) {
        this.projectList = response;
      }
    }, (error: any) => {
      this.toastService.showError(error, 'Error');
    })
  }

  // Custom validator function for date format MM/DD/YYYY
  dateValidator(control) {
    const inputValue = control.value;
    if (inputValue) {
      const datePattern = /^\d{2}\/\d{2}\/\d{4}$/;
      if (!datePattern.test(inputValue)) {
        return { invalidDate: true };
      }
    }
    return null;
  }

  onSelectProject(event) {
    if (event != undefined) {
      this.getAccountByProjectId(event.id);
      this.addPRForm.controls['isBillableToClient'].reset('');
      this.addPRForm.controls['IncludedinRLS'].reset('');
      this.addPRForm.controls['HasApprovedratecard'].reset('');
      this.addPRForm.controls['isBudgeted'].reset('');
      console.log('Issupport',event.isSupport)
      debugger;
      if (event.isSupport) {
        this.addPRForm.controls['isBillableToClient'].disable();
        this.addPRForm.controls['IncludedinRLS'].disable();
       // this.addPRForm.controls['HasApprovedratecard'].disable();
        this.addPRForm.controls['isBillableToClient']?.clearValidators();
        this.addPRForm.controls['IncludedinRLS']?.clearValidators();
        //this.addPRForm.controls['HasApprovedratecard']?.clearValidators();
      }
      else{
        this.addPRForm.controls['isBillableToClient'].enable();
        this.addPRForm.controls['IncludedinRLS'].enable();
        this.addPRForm.controls['HasApprovedratecard'].enable();
        this.addPRForm.controls['isBillableToClient']?.setValidators([Validators.required]);
        this.addPRForm.controls['IncludedinRLS']?.setValidators([Validators.required]);
        this.addPRForm.controls['HasApprovedratecard']?.setValidators([Validators.required]);
        this.addPRForm.controls['isBillableToClient']?.updateValueAndValidity();
        this.addPRForm.controls['IncludedinRLS']?.updateValueAndValidity();
        this.addPRForm.controls['HasApprovedratecard']?.updateValueAndValidity();
       
      }
    }
    else{
      this.addPRForm.patchValue({
        accountName: '',
        deliveryHeadName : ''
      });
    }
  }

  getAccountByProjectId(projectId) {
    if (projectId == "null") {
      this.addPRForm.patchValue({
        accountName: '',
        deliveryHeadName : '',
        deliveryHeadId : ''
      });
    }
    else {
      // To get Account Name
      this.purchaseRequestService.getAccountByProjectId(projectId).subscribe((response: any) => {
        if (response) {
          //this.AccountName = response[0].accountName;
          this.addPRForm.patchValue({
            accountName: response[0].accountName
          });
        }
      }, (error: any) => {
        this.toastService.showError(error, 'Error');
      });

      // To get Delivery Head Name
      this.purchaseRequestService.getDHByProjectId(projectId).subscribe((response: any) => {
        if (response) {
          this.addPRForm.patchValue({
            deliveryHeadName: response[0].name,
            deliveryHeadId : response[0].empEmidsId
          });
        }
      }, (error: any) => {
        this.toastService.showError(error, 'Error');
      });
    }
  }

  onSelectLocation(event) {
    this.addPRForm.controls['prCity'].reset('null');
    this.addPRForm.controls['prBuyer'].reset('null');

    this.CityList = null;
    this.BuyersList = null;
    if (event.target.value != null && event.target.value != undefined && event.target.value != 'null')
      this.getCitiesByLocationId(event.target.value);
     this.getBuyersByLocationId(event.target.value);
  }

  getCitiesByLocationId(locationId) {
    this.purchaseRequestService.getCitiesByLocationId(locationId).subscribe((response: any) => {
      if (response) {
        this.CityList = response;
      }
    }, (error: any) => {
      this.toastService.showError(error, 'Error');
    })
  }
  getBuyersByLocationId(locationId) {
    const buyerControl = this.addPRForm.get('prBuyer');
    this.purchaseRequestService.getBuyersByLocationId(locationId).subscribe((response: any) => {
      if (response) {
        this.BuyersList = response;
        if (this.BuyersList?.length === 1) {
          buyerControl?.setValue(this.BuyersList[0].value);
          buyerControl?.disable();
      } else {
          buyerControl?.enable();
      }
      }
    }, (error: any) => {
      this.toastService.showError(error, 'Error');
    })
  }

  preventKeys(event: any) {
    if (event.keyCode === 69 || event.keyCode === 107 || event.keyCode === 109 || event.keyCode === 189) {
      console.log(event.keyCode);
      event.stopPropagation();
      return false;
    }
  }

  preventStatusKeys(event: any) {
    if (event.keyCode === 33 || event.keyCode === 34 || event.keyCode === 37 || event.keyCode === 38 || event.keyCode === 39 || event.keyCode === 40) {
      console.log(event.keyCode);
      event.stopPropagation();
      return false;
    }
  }

  extractNumbers(inputString) {
    // Split the string by the start character '@'
    const parts = inputString.split('_');

    if (parts.length > 1) {
      const numberString = parts[1].trim();
      if (!isNaN(Number(numberString))) {
        return Number(numberString);
      }
    }
  }
  // whitespaceValidator(): ValidatorFn {
  //   return (control: AbstractControl): { [key: string]: any } | null => {
  //     const isWhitespace = (control.value || '').trim().length === 0;
  //     return isWhitespace ? { 'whitespace': true } : null;
  //   };
  // }
  onSubmitPRForm() {
  debugger;
    //  if (this.isSubmitting) {return; }
    this.isSubmitting = true;
    this.checkValueSelected();
    this.addPRForm.markAllAsTouched();
    if (!this.addPRForm.valid) {
    this.isSubmitting = false;
      return;
    }
    
    const businessRationale = this.addPRForm.get('businessRationale')?.value;
    const lineItemsArray = this.addPRForm.get('lineItems') as FormArray;
    // const formData = new FormData();
    // const files = this.addPRForm.get('files').value;
    // for (let i = 0; i < this.selectedFiles.length; i++) {
    //   formData.append('files', this.selectedFiles[i]);
    // }
    // this.selectedFiles.forEach((file) => {
    //   formData.append('files', file, file.name);
    // });
    if(businessRationale.trim() == '' ){
      this.addPRForm.get('businessRationale')?.setErrors({ whitespace: true });
      let hasWhitespace = false;
     lineItemsArray.controls.forEach((lineItem) => {
     const itemName = lineItem.get('prFor')?.value.trim();

    if (itemName === '') {
      lineItem.get('prFor')?.setErrors({ whitespace: true });
      hasWhitespace = true;
    }
  });

  if (hasWhitespace) {
    this.addPRForm.markAllAsTouched();
    return; // Prevent submission
  }
      return;
    }

  
    const requestBody = this.generateRequestBody();
   if (requestBody.HasApprovedratecard == null || requestBody.IsBillableToClient == null || requestBody.IncludedinRLS == null) {
      //requestBody.HasApprovedratecard = false;
      requestBody.IsBillableToClient = false;
      requestBody.IncludedinRLS = false;
   }
   console.log('requestbody',requestBody)
    const formData = new FormData();
    formData.append('purchaseRequestSave', JSON.stringify(requestBody));

    const files = this.addPRForm.get('files').value;
    for (let i = 0; i < this.selectedFiles.length; i++) {
    formData.append('files', this.selectedFiles[i]);
    }
    

    this.purchaseRequestService.savePurchaseRequest(formData).pipe(take(1)).subscribe((response: any) => {
      if (response && !response.isError) {
        // Trigger email 
        if (requestBody.Action.trim() == "New") {
          const id = response.id;
          console.log('addresponse',id)
          this.purchaseRequestService.triggerMail(id).subscribe((response: any) => {
          }, (error: any) => {
            this.toastService.showError(error, 'Error');
          });
        }
        // Trigger email
        if((requestBody.Action.trim() == "Edit" && requestBody.IsBillableToClient == true) || requestBody.PR_Status == 5 || 
          (requestBody.Action.trim() == "Edit" && requestBody.TotalPrice != this.totalValue)){
          const id = requestBody.Id;
          this.purchaseRequestService.triggerMail(id).subscribe((response: any) => {
          },(error: any) => {
            this.toastService.showError(error, 'Error');
          });
        }
        this.toastService.showSuccess(response.data + ' ' + response.message, 'Success');
        this.addPRForm.reset();
        this.router.navigate(['/purchase-request']);
      } else {
        this.toastService.showError(response.message, 'Error');
        return;
      }
    }, (error: any) => {
      this.toastService.showError(error, 'Error');
    },
    () => {
      this.isSubmitting = false; // Enable the submit button again after completion
    });
  }

  generateRequestBody() {
    const lineItems = this.addPRForm.controls['lineItems'].value.map(item => ({
      ItemDescription: item.prFor,
      Quantity: item.quantity,
      ServiceDuration: item.duration,
      PricePerUnit: item.pricePerUnit,
      PRValue: item.prValue,
      DurationNo: item.durationNo
    }));
    const formValue = this.addPRForm.getRawValue();
    const object = {
      "Id": parseInt(this.addPRForm.controls['prId'].value),
      "PR_Date": this.datepipe.transform(this.addPRForm.controls['prDate'].value, 'yyyy-MM-dd', 'es-ES') || null,
      "PR_DeliveryDate": this.datepipe.transform(this.addPRForm.controls['prDeliveryDate'].value, 'yyyy-MM-dd', 'es-ES') || null,
      "ProjectId": parseInt(this.addPRForm.controls['projectName'].value),
      "AccountName": this.addPRForm.controls['accountName'].value,
      "BusinessRationale": this.addPRForm.value.businessRationale || '',
      //"CurrencyType": this.addPRForm.value.currencyType ? parseInt(JSON.parse(this.addPRForm.value.currencyType)) : 0,
      "CurrencyType": this.addPRForm.controls['currencyType'].value,
      "IsBudgeted": this.addPRForm.value.isBudgeted == null ? null : (Boolean(JSON.parse(this.addPRForm.value.isBudgeted))),
      "IsBillableToClient": this.addPRForm.value.isBillableToClient == null ? null : (Boolean(JSON.parse(this.addPRForm.value.isBillableToClient))),
      "HasApprovedratecard": this.addPRForm.value.HasApprovedratecard == null ? null : (Boolean(JSON.parse(this.addPRForm.value.HasApprovedratecard))),
      "IncludedinRLS": this.addPRForm.value.IncludedinRLS == null ? null : (Boolean(JSON.parse(this.addPRForm.value.IncludedinRLS))),
      "PR_Status": parseInt(this.addPRForm.value.prStatus),
      "RequisitionType": parseInt(this.addPRForm.value.requisitionType),
      "PRLocation": parseInt(this.addPRForm.value.prLocation),
      "City": this.addPRForm.value.prCity,
      "TotalPrice": this.addPRForm.value.totalValue,
      "RecommendedVendor": this.addPRForm.value.recommendedVendor,
      "DH_Name" : this.addPRForm.controls['deliveryHeadName'].value,
      "DH_EmpEmidsId" : this.addPRForm.value.deliveryHeadId,
      "Action" : this.resourceAction,
      "LineItems": lineItems,
      "Buyers" : formValue.prBuyer
    }     
    return object;
  }

  fetchSavedFiles(namesString: string): { name: string }[] {
    // Split the namesString into an array of names
    let namesArray = namesString.split(':').map(name => ({ name: name.trim() }));
    return namesArray;
  }
  getPRDetails(Id) {
    const userData = JSON.parse(sessionStorage.getItem('userDetail'));
    const empEmidsId = userData.EmployeeId; //'INEMP019';
    this.requestBody = {
      "EmpEmidsId": empEmidsId,
      "Id": Id
    }
    this.purchaseRequestService.getPurchaseRequestById(this.requestBody).subscribe((response: any) => {
      debugger;
      if (response) {
        this.PurchaseRequestDetails = response.prDetails;  
        // Check if PurchaseRequestDetails is an object and has the fileNames property
        if (this.PurchaseRequestDetails && this.PurchaseRequestDetails.fileNames) {
          this.savedFileNamesString = this.PurchaseRequestDetails.fileNames; // Replace with your actual big string
          this.savedFiles = this.fetchSavedFiles(this.savedFileNamesString);
          console.log('filenames', this.savedFiles);
        }
          
        
        this.PRItems = response.prLineItems;
        this.totalValue = response.prDetails.totalPrice;
        this.getCitiesByLocationId(response.prDetails.prLocationId); 
        this.getBuyersByLocationId(response.prDetails.prLocationId); 
      this.formInitialization(this.PurchaseRequestDetails);
        this.getTotalValue();
        
        if(this.PurchaseRequestDetails.isSupport){
          // this.updateFieldsBasedOnResponse();  
          
          this.addPRForm.controls['isBillableToClient']?.clearValidators();
          this.addPRForm.controls['IncludedinRLS']?.clearValidators();
          //this.addPRForm.controls['HasApprovedratecard']?.clearValidators();
          this.addPRForm.controls['isBillableToClient'].reset('');
          this.addPRForm.controls['IncludedinRLS'].reset('');
          //this.addPRForm.controls['HasApprovedratecard'].reset('');
          this.addPRForm.controls['isBillableToClient'].disable();
        this.addPRForm.controls['IncludedinRLS'].disable();
        //this.addPRForm.controls['HasApprovedratecard'].disable();
        // this.addPRForm.controls['isBillableToClient']?.updateValueAndValidity();
        // this.addPRForm.controls['IncludedinRLS']?.updateValueAndValidity();
        // this.addPRForm.controls['HasApprovedratecard']?.updateValueAndValidity();
         
        }

        if (response.prDetails.requisitionType == '1') {
          this.disableServiceDuration('1');
          this.disableDurationNo('1');
        }
      }
    }, (error: any) => {
      this.toastService.showError(error, 'Error');
    });
  }

  updateFieldsBasedOnResponse() {
    //this.isApprover = true;
    // this.addPRForm.controls['duration'].disable();
    this.addPRForm.controls['isBillableToClient'].disable();
    this.addPRForm.controls['IncludedinRLS'].disable();
    //this.addPRForm.controls['HasApprovedratecard'].disable();
  }

  getPRStatus() {
    this.purchaseRequestService.getPurchaseRequestStatus().subscribe((response: any) => {
      if (response) {
        this.PRStatus = response;
      }
    }, (error: any) => {
      this.toastService.showError(error, 'Error');
    });
  }

  getRequisitionType() {
    this.purchaseRequestService.getRequisitionType().subscribe((response: any) => {
      if (response) {
        this.RequisitionType = response;
      }
    }, (error: any) => {
      this.toastService.showError(error, 'Error');
    });
  }

  getCurrencyType() {
    this.purchaseRequestService.getCurrencyType().subscribe((response: any) => {
      if (response) {
        this.currencyValues = response;
      }
    }, (error: any) => {
      this.toastService.showError(error, 'Error');
    });
  }

  getPRLocation() {
    this.purchaseRequestService.getPurchaseRequestLocation().subscribe((response: any) => {
      if (response) {
        this.PRLocation = response;
      }
    }, (error: any) => {
      this.toastService.showError(error, 'Error');
    });
  }

  onSelectQuantity(event, index) {
    const quantity_data = event.target.value;
    const price_per_unit_data = this.lineItems.at(index).get('pricePerUnit').value;
    if (this.addPRForm.get('requisitionType').value == '1') {
      if (quantity_data && price_per_unit_data) {
        const pr_value_data = quantity_data * price_per_unit_data;
        this.lineItems.at(index).patchValue({
          prValue: pr_value_data
        });
        this.updateTotalValue();
      }
    }
    else {
      const durationNo_data = this.lineItems.at(index).get('durationNo').value;
      if (quantity_data && durationNo_data && price_per_unit_data) {
        const pr_value_data = quantity_data * durationNo_data * price_per_unit_data;
        this.lineItems.at(index).patchValue({
          prValue: pr_value_data
        });
        this.updateTotalValue();
      }
    }
  }

  onSelectDurationNo(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    let value = input.value;

    if (value.includes('.')) {
        const parts = value.split('.');
        if (parts[1].length > 2) {
            input.value = parts[0] + '.' + parts[1].slice(0, 2);
        }
    }
    const durationNo_data = parseFloat(input.value);
    const quantity_data = parseFloat(this.lineItems.at(index).get('quantity').value);
    const price_per_unit_data = parseFloat(this.lineItems.at(index).get('pricePerUnit').value);

    if (
      !isNaN(durationNo_data) &&
      !isNaN(quantity_data) &&
      !isNaN(price_per_unit_data) &&
      durationNo_data >= 0 && 
      quantity_data >= 0 && 
      price_per_unit_data >= 0
    ) {
      const pr_value_data = quantity_data * durationNo_data * price_per_unit_data;
      this.lineItems.at(index).patchValue({
        prValue: pr_value_data
      });
      this.updateTotalValue();
    } else {
      console.error('Invalid input values detected.');
    }
}

  onSelectPricePerUnit(event, index) {
    const price_per_unit_data = event.target.value;
    const quantity_data = this.lineItems.at(index).get('quantity').value;

    if (this.addPRForm.get('requisitionType').value == '1') {
      if (quantity_data && price_per_unit_data) {
        const pr_value_data = quantity_data * price_per_unit_data;
        this.lineItems.at(index).patchValue({
          prValue: pr_value_data
        });
        this.updateTotalValue();
      }
    }
    else {
      const durationNo_data = this.lineItems.at(index).get('durationNo').value;
      if (quantity_data && durationNo_data && price_per_unit_data) {
        const pr_value_data = quantity_data * durationNo_data * price_per_unit_data;
        this.lineItems.at(index).patchValue({
          prValue: pr_value_data
        });
        this.updateTotalValue();
      }
    }
  }

  updateTotalValue() {
    const totalValue = this.lineItems.controls.reduce((sum, item) => {
      return sum + (item.get('prValue').value || 0);
    }, 0);
    this.totalPrice = totalValue;
    this.addPRForm.patchValue({ totalValue: totalValue });
  }

  getTotalValue() {
    const totalValue = this.lineItems.controls.reduce((sum, item) => {
      return sum + (item.get('prValue').value || 0);
    }, 0);
    this.totalPrice = totalValue;
  }

  // Total Value validation was commented since total value can be any value. so we were not doing any validation.
  // onChangeTotalValue(event) {
  //   const total_Value = event.target.value;
  //   if (total_Value > 0) {
  //     if (this.totalPrice > total_Value) {
  //       this.isValidPrice = false;
  //     }
  //     else {
  //       this.isValidPrice = true;
  //     }
  //   }
  // }

  checkValueSelected() {
    for (const field in this.addPRForm.controls) {
      if (field != 'lineItems') {
        const validator = this.addPRForm.get(field).validator && this.addPRForm.get(field).validator({} as AbstractControl);
        if (validator?.required && (this.addPRForm.controls[field].value === 'null' || this.addPRForm.controls[field].value === 'Select' || this.addPRForm.controls[field].value === '0')) {
          console.log(field);
          if (field === 'projectName') {
            this.addPRForm.controls[field].reset('null');
          } else if (field === 'requisitionType') {
            this.addPRForm.controls[field].reset('null');
          } else if (field === 'prLocation') {
            this.addPRForm.controls['prLocation'].reset('null');
            this.addPRForm.controls['prCity'].reset('null');
          } else {
            this.addPRForm.controls[field].reset();
          }
          this.addPRForm.controls[field].setErrors({ 'invalid': true });
          this.addPRForm.setErrors({ 'invalid': true });
        }
      }
      if (field === 'lineItems') {

        // if (this.lineItems.controls.length > 0) {
        //   for (const i in this.lineItems.controls) {
        //     for (const field in this.lineItems.controls[i]) {
        //       const validator = this.lineItems.get(field).validator && this.lineItems.get(field).validator({} as AbstractControl);
        //       if (validator?.required && (this.lineItems.controls[field].value === 'null' || this.lineItems.controls[field].value === 'Select' || this.lineItems.controls[field].value === '0')) {
        //         this.lineItems.controls[field].setErrors({ 'invalid': true });
        //         this.lineItems.setErrors({ 'invalid': true });
        //       }
        //     }
        //   }
        // }
        if (this.lineItems.controls.length == 0) {
          this.lineItems.setErrors({ 'invalid': true });
        }
      }
    }
  }

  onFilesSelected(event: any) {
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
    this.addPRForm.get('files').setValue(this.selectedFiles); 
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

  removeFile(index: number) {
    if (index > -1 && index < this.selectedFiles.length) {
      this.selectedFiles.splice(index, 1);
      this.addPRForm.get('files').setValue(this.selectedFiles); // Update form control value
      this.onSelectFiles.emit(this.selectedFiles);
    }
  }
  openuploadDocumnet(fileName) {
    const POId = this.PRItems.prNumber;
    var FileName = fileName;
    var Id;
    debugger;
    const userData = JSON.parse(sessionStorage.getItem('userDetail'));
    const empEmidsId = userData.EmployeeId; //'INEMP019';
    this.requestBody = {
      "EmpEmidsId": empEmidsId,
      "Id": this.purchaseRequestId
    }
    this.purchaseRequestService.getPurchaseRequestById(this.requestBody).subscribe((response: any) => {
      debugger;
      if (response) {
        this.PurchaseRequestDetails = response.prDetails;
        const Id = this.PurchaseRequestDetails.prNumber;
      }
    }, (error: any) => {
      this.toastService.showError(error, 'Error');
    })
    const object = {
      FileName: FileName,
      POId: this.PurchaseRequestDetails.prNumber
    }
    this.purchaseRequestService.getUploadFIle(object).subscribe((response: any) => {
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

}
