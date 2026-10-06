import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PurchaseOrderService } from '../purchase-order/purchase-order.service';
import { ToastService } from 'src/app/common/toast/toast.service';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-reject-message',
  templateUrl: './reject-message.component.html',
  styleUrls: ['./reject-message.component.scss']
})
export class RejectMessageComponent {
  PORejectShowform: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<RejectMessageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string }, private fb: FormBuilder,private purchaseorderservice: PurchaseOrderService,private toastService: ToastService,private router: Router, private activatedRoute: ActivatedRoute
  ) {
   }
   ngOnInit(): void {
    this.formInitialization();
    this.PORejectShowform.get('Reason')?.setValue(this.data.message);
    this.PORejectShowform.get('Reason')?.disable();
  }

  formInitialization(): void {
    // Initialize the form with data if available
    this.PORejectShowform = this.fb.group({
      Reason: [this.data.message || '', [Validators.required]],
    });
  }
  onNoClick(): void {
    this.dialogRef.close('no');
  }

  onCloseClick(): void {
    this.dialogRef.close();
  }
}
