import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-referral-policies',
  templateUrl: './referral-policies.component.html',
  styleUrls: ['./referral-policies.component.scss']
})
export class ReferralPoliciesComponent implements OnInit {
 

  constructor(public dialogRef: MatDialogRef<ReferralPoliciesComponent>) { }

  ngOnInit(): void {
  }
  close(): void {
    this.dialogRef.close();
  }

}
