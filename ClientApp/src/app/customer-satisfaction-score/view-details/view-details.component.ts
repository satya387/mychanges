import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormArray, AbstractControl } from '@angular/forms';
import { CustomerSatisfactionScoreService } from '../customer-satisfaction-score.service';
import { ToastService } from 'src/app/common/toast/toast.service';
import { DatePipe } from '@angular/common';
import { DateAdapter } from '@angular/material/core';
import { FormControl } from '@angular/forms'; // If using moment.js
import {  Router } from '@angular/router';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as XLSX from 'xlsx';
import { Inject, Input } from '@angular/core';

@Component({
  selector: 'customer-satisfaction-score-view-details',
  templateUrl: './view-details.component.html',
  styleUrls: ['./view-details.component.scss'],
})

export class ViewDetailsComponent implements OnInit {


     viewData:any;
  
  @Input() cycleData: any;
  constructor(public dialogRef: MatDialogRef<ViewDetailsComponent>, private formBuilder: FormBuilder, private customerSatisfactionScoreService: CustomerSatisfactionScoreService,
    private toastService: ToastService, private dateAdapter: DateAdapter<Date>, private router: Router, private datepipe: DatePipe, @Inject(MAT_DIALOG_DATA) public viewDetails: any
  ) {
    
    this.viewData =  Object.values(viewDetails);
  }
  accountName = new FormControl();
  ngOnInit(): void {
  }

  onCloseClick(): void {
    this.dialogRef.close();
  }

}


