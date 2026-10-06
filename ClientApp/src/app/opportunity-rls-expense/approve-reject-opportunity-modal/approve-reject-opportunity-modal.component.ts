import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-approve-reject-opportunity-modal',
  templateUrl: './approve-reject-opportunity-modal.component.html',
  styleUrls: ['./approve-reject-opportunity-modal.component.scss']
})
export class ApproveRejectOpportunityModalComponent implements OnInit {
  comments: string = '';
  action: any;

  constructor(
    public dialogRef: MatDialogRef<ApproveRejectOpportunityModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.action = data.opportunity;
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
