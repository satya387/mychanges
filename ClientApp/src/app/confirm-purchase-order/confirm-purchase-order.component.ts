import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';

@Component({
  selector: 'app-confirm-purchase-order',
  templateUrl: './confirm-purchase-order.component.html',
})
export class ConfirmPurchaseOrderComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmPurchaseOrderComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string }
  ) {
   }
   
  
  onNoClick(): void {
    this.dialogRef.close('no');
  }

  onYesClick(): void {
    this.dialogRef.close('yes');
  }
  onCloseClick(): void {
    this.dialogRef.close();
  }
}
