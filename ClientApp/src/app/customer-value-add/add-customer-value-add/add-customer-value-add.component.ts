import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormArray, AbstractControl } from '@angular/forms';
import { CustomerValueAddService } from '../customer-value-add.service';
import { ToastService } from 'src/app/common/toast/toast.service';
import { DatePipe } from '@angular/common';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { FormControl } from '@angular/forms'; // If using moment.js
import { ActivatedRoute, Router } from '@angular/router';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgbButtonLabel } from '@ng-bootstrap/ng-bootstrap';

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'YYYY/MM/DD',
  },
  display: {
    dateInput: 'ddd, MMM D, YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'ddd, MMMM D, YYYY',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};



@Component({
  selector: 'customer-value-add-add-customer-value-add',
  templateUrl: './add-customer-value-add.component.html',
  styleUrls: ['./add-customer-value-add.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter }, // If using moment.js
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ]
})
export class AddCustomerValueAddComponent implements OnInit {
  
  addCVAForm: FormGroup;
  accountList: any;
  ProjectList: any;
  CategoryList: any;
  Userlist: any;
  itemId: any;
  EditList: any;
  isEditMode: boolean = false;
  roleType: any;
  accounId: any =-1;
  StatusList: any;
  samplelist: any;
  submitted: boolean = false;
  dateSelected: boolean = false;
  dateSelected1: boolean = false;
  ideaTitleTooltipText: any = `A clear, concise title that summarizes the value-add idea. 
  Example: Automated Reporting Solution to Improve Efficiency.`;
  customerNeedTooltipText: any = `Describe the specific customer need, problem, or opportunity that your idea addresses. 
  Example: Customer struggles with manual data reporting, which is time-consuming and prone to errors.`;
  yourIdeaTooltipText: any = `Clearly outline your idea for adding value and how it addresses the customer’s problem.
  Example: Introduce an automated reporting tool that streamlines data collection and report generation.`;
  keyBenefitsTooltipText: any = `List the tangible and intangible benefits the customer will experience from this value-add.
  Example: 
  Tangible: Time savings, reduced errors, faster decision-making. 
  Intangible: Increased employee satisfaction, improved data visibility.`;
  alignmentTooltipText: any = `Explain how the value-add idea aligns with the customer’s strategic goals or initiatives.
  Example: Supports customer digital transformation strategy and goal to increase operational efficiency by 20%.`;
  successMeasuresTooltipText: any = `Identify measurable outcomes to demonstrate the success of the value-add.
  Example: 
  1. Reduction in reporting time by 40%.
  2. Decrease in data errors by 30%.
  3. Improved customer satisfaction score.`;
  customerImpactTooltipText : any = `Outline how the value-add idea will impact the customer in the short and long term.
  Example:
  Short Term: Immediate reduction in manual work effort and errors.
  Long Term: Greater decision-making ability, better resource management, and increased competitiveness.`;
  implementationPlanTooltipText: any = `Briefly describe how the idea will be implemented, including key steps, resources needed, and timelines.
  Example:
  Step 1: Analyze current reporting processes (2 weeks)
  Step 2: Develop customized reporting automation (4 weeks)
  Step 3: Pilot and feedback loop (2 weeks)`;

  constructor(public dialogRef: MatDialogRef<AddCustomerValueAddComponent>,private formBuilder: FormBuilder,private customerValueAddSevice:CustomerValueAddService,
    private toastService: ToastService,private dateAdapter: DateAdapter<Date>,private router:Router,private datepipe: DatePipe
    ) { 
      
    }
    accountName = new FormControl();
  ngOnInit(): void {
    this.getAllAccountList();
    this.getAllProjectList();
    this.getAllCategories();
    this.getAllStatusList();
    this.getUserNames();
    this. formInitialization();
    this.getRoleType();
    const userData = JSON.parse(sessionStorage.getItem('userDetail'));
    this.addCVAForm.patchValue({
      ideaLoggedBy:userData.UserName ,
    });
    this.addCVAForm.controls['ideaLoggedBy'].disable();
    // savings = new FormControl('', [Validators.pattern('^[0-9]*$')]);

  }


  onCloseClick(): void {
    this.dialogRef.close();
  }
  getAllAccountList() {
    const userData = JSON.parse(sessionStorage.getItem('userDetail'));
    const empEmidsId = userData.EmployeeId
    //const empEmidsId='INEMP019'
    this.customerValueAddSevice.GetAccountsList(empEmidsId).subscribe((response: any) => {
      if (response) {
        this.accountList = response;
        // console.log(this.accountList);
      }
    }, (error: any) => {
      this.toastService.showError(error, 'Error');
    })
  }
  getAllProjectList() {
    const userData = JSON.parse(sessionStorage.getItem('userDetail'));
    const empEmidsId = userData.EmployeeId
    //const empEmidsId='INEMP019'
      const object = {
        AccountId:this.accounId,
        empEmidsId: userData.EmployeeId,
      }
    this.customerValueAddSevice.GetProjectsList(object).subscribe((response: any) => {
      if (response) {
        this.ProjectList = response;
        
        // console.log(this.ProjectList);
      }
    }, (error: any) => {
      this.toastService.showError(error, 'Error');
    })
  }

  getAllCategories(){
    this.customerValueAddSevice.GetCategoryList().subscribe((response: any) => {
      if (response) {
        this.CategoryList = response;
      }
    }, (error: any) => {
      this.toastService.showError(error, 'Error');
    })
  }

  dateControl = new FormControl(new Date());
  dateControl1 = new FormControl(new Date());

  

  formatDateWithDay(date: Date): string {
    return this.dateAdapter.format(date, 'ddd, MMM D, YYYY');
  }

  // Event handler for date selection
  handleDateSelection(event: MatDatepickerInputEvent<Date>): void {
    const selectedDate = event.value;
    this.dateControl.setValue(selectedDate);
    this.dateSelected = selectedDate !== null;
  }
  handleActualDateSelection(event: MatDatepickerInputEvent<Date>): void {
    const selectedDate = event.value;
    this.dateControl1.setValue(selectedDate);
    this.dateSelected1 = selectedDate !== null;
  }
  getUserNames(){
    this.customerValueAddSevice.GetEmployeeList().subscribe((response: any) => {
      if (response) {
        this.Userlist = response;
      }
    }, (error: any) => {
      this.toastService.showError(error, 'Error');
    })
  }
  
  getAllStatusList() {
    this.customerValueAddSevice.GetStatusDetails().subscribe((response: any) => {
      if (response) {
        this.StatusList = response;
      }
    }, (error: any) => {
      this.toastService.showError(error, 'Error');
    })
  }
  generateCVABody(){
      const object = {
        "AccountId": parseInt(this.addCVAForm.value.accountName),
        "ProjectId": parseInt(this.addCVAForm.value.projectName),
        "IdeaTitle": this.addCVAForm.value.ideaTitle||'',
        "CvaCategoryId": parseInt(this.addCVAForm.value.cvaCategory),
        "ProblemStatement": this.addCVAForm.value.ideaDescription || null,
        "SolutionProposed": this.addCVAForm.value.solution_Proposed || null,
        "PotentialBenifits": this.addCVAForm.value.potential_Benefits || null,
        "CustomerGoals": this.addCVAForm.value.customerGoals || null,
        "SuccessMeasures": this.addCVAForm.value.successMeasures || null,
        "CustomerImpact": this.addCVAForm.value.customerImpact || null,
        "IdeaLoggedBy": this.addCVAForm.value.ideaLoggedBy||null,
        "ImplementationOwner": this.addCVAForm.value.implemenataion_Owner||null,
        "ProcessCommittedDate": this.addCVAForm.value.pCD?.toString()|| '' ||undefined,
        "ProcessActualCommittedDate": this.addCVAForm.value.pACD?.toString()|| '' ||undefined,
        'IsIdeaApproved': this.addCVAForm.value.ideaQualifiedByDH_DM === 'yes' ? true : false,
        "ProcessStatus": parseInt(this.addCVAForm.value.status)||0,
        "Actionsimplemented": this.addCVAForm.value.actions_implemented || null,
        "Savings": parseInt(this.addCVAForm.value.savings)||null,
        "IsCustomerCommunicationDone": this.addCVAForm.value.ccD_QBR_MSR === 'yes' ? true : false,
        
      }
      return object;
    
  }
  formInitialization(data?) {
    this.addCVAForm = this.formBuilder.group({
      'accountName': [data ? data.accountName : null, [Validators.required]],
      'projectName': [data ? data.projectName : null, [Validators.required]],
      'ideaTitle': [data ? data.ideaTitle : '', [Validators.required]],
      'cvaCategory': [data ? data.cvaCategory : null, [Validators.required]],
      'ideaDescription': [data ? data.ideaDescription : null, [Validators.required]],
      'solution_Proposed': [data ? data.solution_Proposed : null, [Validators.required]],
      'potential_Benefits': [data ? data.potential_Benefits : null, [Validators.required]],
      'customerGoals': [data ? data.customerGoals : null, [Validators.required]],
      'successMeasures': [data ? data.successMeasures : null, [Validators.required]],
      'customerImpact': [data ? data.customerImpact : null, [Validators.required]],
      'ideaLoggedBy': [data ? data.ideaLoggedBy : '0'],
      'implemenataion_Owner': [data ? data.implemenataion_Owner : '0', ],
      'pCD': [data ? data.datepipe.transform(data.pCD).toString() : '', ],
      'pACD': [data ? data.datepipe.transform(data.pACD).toString() : '', ],
      'ideaQualifiedByDH_DM': [data ? data.ideaQualifiedByDH_DM : null, ],
      'status': [data ? data.status : '1', ],
      'actions_implemented': [data ? data.actions_implemented : null, ],
      'savings': [data && data.savings !== null && data.savings !== undefined ? data.savings : '', Validators.pattern('^[0-9]*$')],
      'ccD_QBR_MSR': [data ? data.ccD_QBR_MSR : null, ],
    });
    
  }
  onSelect(event: any): void {
    var acountId=event.target.value;
      if (acountId.includes("0: null")) {
        acountId = -1;
      } 
    
    this.accounId=acountId;
    this.getAllProjectList();
  }
  onSubmitCVAForm(){
    this.submitted = true;
    const requestBody = this.generateCVABody();
    if(requestBody.ProcessCommittedDate== null){
      requestBody.ProcessCommittedDate='';
    }
    else{
      const dateString = requestBody.ProcessCommittedDate;
      const dateWithoutTime = new Date(dateString);
      dateWithoutTime.setHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to zero
      requestBody.ProcessCommittedDate = dateWithoutTime.toLocaleDateString()
    }

    if(requestBody.ProcessActualCommittedDate== null){
      requestBody.ProcessActualCommittedDate='';
    }
    else{
      const dateString = requestBody.ProcessActualCommittedDate;
      const dateWithoutTime = new Date(dateString);
      dateWithoutTime.setHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to zero
      requestBody.ProcessActualCommittedDate = dateWithoutTime.toLocaleDateString()
    }

    if (this.addCVAForm.valid){
    if(this.isEditMode){
      requestBody['Id']= this.itemId;
      requestBody['IdeaLoggedBy']= this.addCVAForm.get('ideaLoggedBy').value
      requestBody['AccountId']=this.addCVAForm.get('accountName').value
      requestBody['ProjectId']= this.addCVAForm.get('projectName').value
      requestBody['CvaCategoryId']= parseInt(this.addCVAForm.get('cvaCategory').value)
      if(requestBody.Savings== null){
        requestBody.Savings=0
      }
      if(requestBody.ImplementationOwner==null){
        const implementationOwner=this.addCVAForm.get('implemenataion_Owner').value
        if(implementationOwner == 0){
          requestBody.ImplementationOwner=null
        }
        else{
          requestBody.ImplementationOwner=implementationOwner
        }
      }
       this.customerValueAddSevice.updateCVADetails(requestBody).subscribe((response: any) => {
      if (response && !response.isError) {
        this.toastService.showSuccess(response.message, 'Success');
        this.addCVAForm.reset();
        this.dialogRef.close();
        window.location.reload()
            } else {
        this.toastService.showError(response.message, 'Error');
        return;
      }
    }, (error: any) => {
      this.toastService.showError(error, 'Error');
    });
    }
    else{
    if(requestBody.Savings== null){
      requestBody.Savings=0
    }
    this.customerValueAddSevice.saveCustomerValueAdd(requestBody).subscribe((response: any) => {
      if (response && !response.isError) {
        this.toastService.showSuccess(response.message, 'Success');
        this.dialogRef.close();
        window.location.reload()
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
  // Mark all fields as touched to trigger validation messages
  this.addCVAForm.markAllAsTouched();
}
  }
  get f() { return this.addCVAForm.controls; }
  openDialog( EditId: number) {
    const labelElement = document.getElementById('Title');
    if (labelElement) {
      labelElement.textContent = 'Edit';
    }
    this.itemId = EditId;
   

    
    this.customerValueAddSevice.GetEditDetails(EditId).subscribe((response: any) => {
      if (response) {
        this.EditList = response;
        const isIdeaApproved = this.EditList[0].isIdeaApproved ? 'yes' : 'no';
        const isCustomerCommunicationDone= this.EditList[0].isCustomerCommunicationDone ? 'yes' : 'no';
        
        if(this.EditList[0].processCommittedDate == null || this.EditList[0].processCommittedDate =='01/01/1900 00:00:00' || 
          (this.EditList[0].processCommittedDate =='01/01/1970 05:30:00' || this.EditList[0].processCommittedDate =='01/01/1970 00:00:00')){
          this.EditList[0].processCommittedDate='';
        }
        else{
          this.EditList[0].processCommittedDate=new Date(this.EditList[0].processCommittedDate);
        }

        if( this.EditList[0].processActualCommittedDate == null || this.EditList[0].processActualCommittedDate =='01/01/1900 00:00:00' || 
        (this.EditList[0].processActualCommittedDate =='01/01/1970 05:30:00' ||this.EditList[0].processActualCommittedDate =='01/01/1970 00:00:00'))
        {
          this.EditList[0].processActualCommittedDate='';
        }
        else{
          this.EditList[0].processActualCommittedDate=new Date(this.EditList[0].processActualCommittedDate);
        }

        if(this.EditList[0].savings==0){
          this.EditList[0].savings=null;
        }
        const userData = JSON.parse(sessionStorage.getItem('userDetail'));
        const EmpEmidsId =userData.EmployeeId;
       
        
        this.addCVAForm.patchValue({
          accountName: this.EditList[0].accountId,
          projectName: this.EditList[0].projectId,
          ideaTitle: this.EditList[0].ideaTitle,
          cvaCategory: this.EditList[0].cvaCategory,
          ideaDescription: this.EditList[0].problemStatement,
          solution_Proposed: this.EditList[0].solutionProposed,
          potential_Benefits: this.EditList[0].potentialBenifits,
          customerGoals: this.EditList[0].customerGoals,
          successMeasures: this.EditList[0].successMeasures,
          customerImpact: this.EditList[0].customerImpact,
          ideaLoggedBy: this.EditList[0].ideaLoggedBy !==null ? this.EditList[0].ideaLoggedBy:0,
          implemenataion_Owner: this.EditList[0].implementationOwner!== null ? this.EditList[0].implementationOwner: 0,
          pCD: this.EditList[0].processCommittedDate,
          pACD: this.EditList[0].processActualCommittedDate,
          ideaQualifiedByDH_DM: isIdeaApproved,
          status: this.EditList[0].processStatus,
          actions_implemented: this.EditList[0].actionsImplemented,
          savings: this.EditList[0].savings,
          ccD_QBR_MSR: isCustomerCommunicationDone
        });
        this.isEditMode= true;
        const ProcessStatus=this.EditList[0].processStatus;
        this.GetRoleID(EmpEmidsId,ProcessStatus)
        // if(this.EditList[0].processStatus== 1 && this.roleType == 1 ){
        //   this.addCVAForm.controls['ideaLoggedBy'].disable();
        //     this.addCVAForm.controls['implemenataion_Owner'].disable();
        //     this.addCVAForm.controls['pCD'].disable();
        //     this.addCVAForm.controls['ideaQualifiedByDH_DM'].disable();
        //     this.addCVAForm.controls['status'].disable();
        //     this.addCVAForm.controls['actions_implemented'].disable();
        //     this.addCVAForm.controls['savings'].disable();
        //     this.addCVAForm.controls['ccD_QBR_MSR'].disable();
        // }
        this.addCVAForm.controls['accountName'].disable();
    this.addCVAForm.controls['projectName'].disable();
      }
    }, (error: any) => {
      this.toastService.showError(error, 'Error');
    })
  }
  GetRoleID(EmpEmidsId,ProcessStatus){
    this.customerValueAddSevice.GetRoleType(EmpEmidsId).subscribe((RoleType: any) => {
        this.roleType = RoleType;
     if(this.roleType==1 && ProcessStatus==1 ){
      this.addCVAForm.controls['ideaLoggedBy'].disable();
      this.addCVAForm.controls['implemenataion_Owner'].disable();
      this.addCVAForm.controls['pCD'].disable();
      this.addCVAForm.controls['pACD'].disable();
      this.addCVAForm.controls['ideaQualifiedByDH_DM'].disable();
      this.addCVAForm.controls['status'].disable();
      this.addCVAForm.controls['actions_implemented'].disable();
      this.addCVAForm.controls['savings'].disable();
      this.addCVAForm.controls['ccD_QBR_MSR'].disable();
     }


  })}
  getRoleType(){
    const userData = JSON.parse(sessionStorage.getItem('userDetail'));
    const EmpEmidsId =userData.EmployeeId;
    this.customerValueAddSevice.GetRoleType(EmpEmidsId).subscribe((response: any) => {
      if (response) {
        this.roleType = response;
        if(this.isEditMode==true){
          if(this.roleType==1 && (EmpEmidsId!= this.EditList[0].implementationOwner)){
            this.addCVAForm.controls['ideaLoggedBy'].disable();
            this.addCVAForm.controls['implemenataion_Owner'].disable();
            this.addCVAForm.controls['pCD'].disable();
            this.addCVAForm.controls['pACD'].disable();
            this.addCVAForm.controls['ideaQualifiedByDH_DM'].disable();
            this.addCVAForm.controls['status'].disable();
            this.addCVAForm.controls['actions_implemented'].disable();
            this.addCVAForm.controls['savings'].disable();
            this.addCVAForm.controls['ccD_QBR_MSR'].disable();
          }
          else if(this.roleType==1 && (EmpEmidsId == this.EditList[0].implementationOwner)){
            this.addCVAForm.controls['implemenataion_Owner'].disable();
          }
        }
        else{
          if(this.roleType==1){
            this.addCVAForm.controls['ideaLoggedBy'].disable();
            this.addCVAForm.controls['implemenataion_Owner'].disable();
            this.addCVAForm.controls['pCD'].disable();
            this.addCVAForm.controls['pACD'].disable();
            this.addCVAForm.controls['ideaQualifiedByDH_DM'].disable();
            this.addCVAForm.controls['status'].disable();
            this.addCVAForm.controls['actions_implemented'].disable();
            this.addCVAForm.controls['savings'].disable();
            this.addCVAForm.controls['ccD_QBR_MSR'].disable();
          }
        }
      }
    }, (error: any) => {
      this.toastService.showError(error, 'Error');
    })

  }
  ngAfterViewInit() {
    const inputElement = document.querySelector('.mat-input-element');
    if (inputElement) {
      inputElement.classList.add('remove-caret-color');
    }
  }
  
}

