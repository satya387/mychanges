import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-approve-reject-allowance-module',
  templateUrl: './approve-reject-allowance-module.component.html',
  styleUrls: ['./approve-reject-allowance-module.component.scss']
})
export class ApproveRejectAllowanceModuleComponent implements OnInit {
  comments: string = '';
  action: any;

  constructor(
    public dialogRef: MatDialogRef<ApproveRejectAllowanceModuleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.action = data.status;
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onApprove(): void {
    this.dialogRef.close(this.comments);
  }

  ngOnInit(): void {
  }

  onReject(){
    this.dialogRef.close(this.comments);
  }

}
