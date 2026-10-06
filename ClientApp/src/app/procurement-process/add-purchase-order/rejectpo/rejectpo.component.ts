import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PurchaseOrderService } from '../../purchase-order/purchase-order.service';
import { ToastService } from '../../purchase-request/common-helper/toast-alert/toast-alert.service';
import { ActivatedRoute, Router } from '@angular/router';

// Define an interface for the dialog data
interface DialogData {
  POID: number;
  Reason?: string; // Optional, since it's not provided in the original data type
}

@Component({
  selector: 'app-rejectpo',
  templateUrl: './rejectpo.component.html',
})
export class RejectpoComponent implements OnInit {

  PORejectform: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<RejectpoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: FormBuilder,private purchaseorderservice: PurchaseOrderService,private toastService: ToastService,private router: Router, private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.formInitialization();
  }

  formInitialization(): void {
    // Initialize the form with data if available
    this.PORejectform = this.fb.group({
      Reason: [this.data.Reason || '', [Validators.required]],
    });
  }
  onNoClick(): void {
    this.dialogRef.close('no');
  }

  onYesClick(): void {
    debugger;
    if (this.PORejectform.valid) {
    const comments=this.PORejectform.get('Reason').value
        const object = {
          "Id": this.data,
          "Reason": comments
        };
        this.purchaseorderservice.rejectPurchaseOrder(object).subscribe((response: any) => {
          if (response.data) {
            this.toastService.showSuccess(response.data + ' ' + response.message, 'Success');
            this.router.navigate(['/purchase-order']);
          }
        }, (error: any) => {
          this.toastService.showError(error, 'Error');
        });
        this.dialogRef.close('yes');
      }
      else {
        this.PORejectform.markAllAsTouched();
      }
  }
   
  onCloseClick(): void {
    this.dialogRef.close();
  }
}
