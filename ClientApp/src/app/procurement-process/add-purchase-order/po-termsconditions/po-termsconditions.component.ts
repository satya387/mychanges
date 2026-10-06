import { Component, OnInit, Inject, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-po-termsconditions',
  templateUrl: './po-termsconditions.component.html',
  styleUrls: ['./po-termsconditions.component.scss']
})
export class PoTermsconditionsComponent implements OnInit, AfterViewInit {
  Location: any;
  @ViewChild('contentContainer') contentContainer!: ElementRef; // Changed from 'header' to 'contentContainer'

  constructor(
    public dialogRef: MatDialogRef<PoTermsconditionsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    if (this.data.LocationId == 1) {
      this.Location = 'INDIA';
    }
    else if (this.data.LocationId == 2) {
      this.Location = 'USA';
    }
    else if (this.data.LocationId == 4) {
      this.Location = 'CANADA';
    }
    else if (this.data.LocationId == 10) {
      this.Location = 'PHILIPPINES';
    }
    else {
      this.Location = 'OTHERS';
    }
  }

  ngAfterViewInit(): void {
    this.scrollToTop();
  }

  scrollToTop(): void {
    if (this.contentContainer) {
      this.contentContainer.nativeElement.scrollTop = 0;
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }
}