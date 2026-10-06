import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PurchaseRequestService } from '../purchase-request.service';
import { ToastService } from '../common-helper/toast-alert/toast-alert.service';
import { FormBuilder, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-prpo-details',
  templateUrl: './prpo-details.component.html',
  styleUrls: ['./prpo-details.component.scss']
})
export class PrpoDetailsComponent implements OnInit {
  PurchaseRequestDetails: any;
  requestBody: any;
  PRItems: any;
  detailsForm: FormGroup;
  POId: any;
  EditPOList: any;
  PR_Id: any;
  EditPRList: any;
  constructor(private purchaseRequestService: PurchaseRequestService,private fb: FormBuilder,private toastService: ToastService,public dialogRef: MatDialogRef<PrpoDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { 
      const userData = JSON.parse(sessionStorage.getItem('userDetail'));
    const empEmidsId = userData.EmployeeId; 
    this.requestBody = {
      EmpEmidsId: empEmidsId,
      Id: this.data.id 
    };
    }

  ngOnInit(): void {
    if (this.data.title == 'PR'){
      this.purchaseRequestService.getPurchaseRequestById(this.requestBody).subscribe(
        (response: any) => {
          if (response) {
            this.PurchaseRequestDetails = response.prDetails;
            this.PRItems = response.prLineItems;    
            console.log(this.PurchaseRequestDetails)    
          }
        },
        (error: any) => {
          this.toastService.showError(error, 'Error');
        }
      );
    }
    else {
      this.POId = this.data.id
      var PR_Id = this.data.pR_Id
      this.purchaseRequestService.GetPOEditDetails(this.POId).subscribe((res: any) => {
        if (res) {
          this.EditPOList = res[0];
        }
      }, (error: any) => {
        this.toastService.showError(error, 'Error');
      })  
      this.getPRDetails(PR_Id);
  }
    
  } 
  getPRDetails(Id){
  this.purchaseRequestService.GetPRDetails(Id).subscribe((response: any) => {
    debugger;
    if (response) {
      this.EditPRList = response;
    }
  }, (error: any) => {
    this.toastService.showError(error, 'Error');
  })
}
  onClose(): void {
    this.dialogRef.close();
  }
}
