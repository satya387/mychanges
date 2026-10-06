import { Component, OnInit, Inject, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CustomerSatisfactionScoreService } from '../customer-satisfaction-score.service';
import { ToastService } from 'src/app/common/toast/toast.service';
import { DatePipe } from '@angular/common';
import { DateAdapter } from '@angular/material/core';
import { Router } from '@angular/router';
import { PurchaseOrderService } from 'src/app/procurement-process/purchase-order/purchase-order.service';

@Component({
  selector: 'customer-satisfaction-score-add-client-respondent-details',
  templateUrl: './add-client-respondent-details.component.html',
  styleUrls: ['./add-client-respondent-details.component.scss'],
})
export class AddClientRespondentDetailsComponent implements OnInit {
  addClientRespondentForm: FormGroup;
  projectId: any;
  cycleName: any;
  viewData: any;
  operationalName: any;
  selectedForUploadObject: any = { ProjectName: null, CycleName: null,Level:null };

  @Input() cycleData: any;
  @Input() projectData: any;
  POUserRoles: any;
  itemId: number;
  EditList: any;
  ProjectName: any;
  isUpdating: boolean = false; // Change this based on your logic
  MangerLevelList: any;

  constructor(
    public dialogRef: MatDialogRef<AddClientRespondentDetailsComponent>,
    private formBuilder: FormBuilder,
    private customerSatisfactionScoreService: CustomerSatisfactionScoreService,
    private toastService: ToastService,
    private dateAdapter: DateAdapter<Date>,
    private router: Router,
    private datepipe: DatePipe,
    private purchaseorderservice: PurchaseOrderService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.cycleData = data.CycleData.map((item) => ({
      id: item.id,
      cycleName: item.cycleName,
    }));
    this.projectData = data.ProjectData.map((item) => ({
      id: item.projectId,
      projectName: item.projectName,
    }));

    this.addClientRespondentForm = this.formBuilder.group({
      cycleName: [null, Validators.required],
      ProjectName: [null, Validators.required],
      clientRespondent: ['', Validators.required],
      clientRespondentEmail: ['', [Validators.required, Validators.email]],
      OperationalName: [null, Validators.required],
      CustomerProjectName:['', Validators.required],
      ClientDesignation:['', Validators.required],
    });
    //this.addvalidation()
  }

  ngOnInit(): void {
    this.formInitialization();
    this.GetMangagerLevelDropdownValues();
  }

  onCloseClick(): void {
    this.dialogRef.close();
  }

  onSelect(event: any): void {
    this.operationalName = event.target.value;
  }
  GetMangagerLevelDropdownValues(){
    this.customerSatisfactionScoreService.GetDropDownValues().subscribe((response:any)=>{
      if(response){
        this.MangerLevelList=response
        console.log(this.MangerLevelList);
      }
    }, (error: any) => {
      this.toastService.showError(error, 'Error');
    })
  }
  openDialog( EditId) {
    debugger;
    const labelElement = document.getElementById('Title');
    if (labelElement) {
      labelElement.textContent = 'Edit Client Respondent Details';
    }
    //if()
    this.isUpdating=true;
    this.itemId = EditId.id;
   this.projectId=EditId.projectId;
   this.ProjectName=EditId.projectName;
    this.customerSatisfactionScoreService.GetCSATEditDetails(EditId.id).subscribe((response: any) => {
      if (response) {
        this.EditList = response;
       console.log(this.EditList[0]);
        this.addClientRespondentForm.patchValue({
          cycleName: this.EditList[0].cycle,
          ProjectName: this.EditList[0].projectName,
          clientRespondent: this.EditList[0].clientRespondent,
          clientRespondentEmail: this.EditList[0].clientRespondentEmail,
          CustomerProjectName: this.EditList[0].customerProjectName,
          ClientDesignation: this.EditList[0].clientDesignation ,
          OperationalName: this.EditList[0].managementLevel
        });
   
    }
  }, (error: any) => {
      this.toastService.showError(error, 'Error');
    })
  }
  onSelectDropdown(event: any, dropdownType: string): void {
    const target = event.target as HTMLSelectElement;
    const value = target.value;
    switch (dropdownType) {
      case 'CycleName':
        this.selectedForUploadObject.CycleName = value;
        break;
      case 'ProjectName': {
        this.selectedForUploadObject.ProjectName = value;
        const selectedItem = this.projectData.find(
          (item) => item.projectName === this.selectedForUploadObject.ProjectName
        );
        if (selectedItem) {
          this.projectId = selectedItem.id;
        }
        break;
      }
      case 'Level':
        this.selectedForUploadObject.Level = value;
        break;
      default:
        break;
    }
  }

  AddClientRespondentDeatils(): void {
    if (this.addClientRespondentForm.invalid) {
      this.addClientRespondentForm.markAllAsTouched();
      return;
    }
    const userData = JSON.parse(sessionStorage.getItem('userDetail'));
    const EmployeeId = userData.EmployeeId
     debugger;
    const object = {
      Id: this.itemId ||0,
      ProjectId: this.projectId || null ||0,
      ProjectName: this.addClientRespondentForm.get('ProjectName')?.value || null,
      ClientRespondent: this.addClientRespondentForm.get('clientRespondent')?.value || null,
      ClientRespondentEmail: this.addClientRespondentForm.get('clientRespondentEmail')?.value || null,
      CustomerProjectName: this.addClientRespondentForm.get('CustomerProjectName')?.value || null,
      ClientDesignation: this.addClientRespondentForm.get('ClientDesignation')?.value || null,
      ManagementLevel: this.addClientRespondentForm.get('OperationalName')?.value || null,
      ModifiedBy: EmployeeId,
      Cycle: this.addClientRespondentForm.get('cycleName')?.value || null,
    };

    this.customerSatisfactionScoreService.ClientRespondentData(object).subscribe(
      (response: any) => {
        if (response && !response.isError) {
          this.toastService.showSuccess(response.message, 'Success');
          this.dialogRef.close();
          this.router.navigate(['/add-edit-CSAT']);
          window.location.reload();
        } else {
          this.toastService.showError(response.message, 'Error');
        }
      },
      (error: any) => {
        this.toastService.showError(error, 'Error');
      }
    );
  }

  formInitialization(data?: any): void {
    this.addClientRespondentForm = this.formBuilder.group({
      cycleName: [null, Validators.required],
      ProjectName: [null, Validators.required],
      clientRespondent: ['', Validators.required],
      clientRespondentEmail: ['', [Validators.required, Validators.email]],
      OperationalName: [null, Validators.required],
      CustomerProjectName:['', Validators.required],
      ClientDesignation:['', Validators.required],

    });
  }
  
  get f() {
    return this.addClientRespondentForm.controls;
  }
}
