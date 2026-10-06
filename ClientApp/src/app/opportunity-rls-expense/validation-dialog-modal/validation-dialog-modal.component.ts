import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-validation-dialog',
  templateUrl: './validation-dialog-model.component.html',
  styleUrls: ['./validation-dialog-modal.component.scss']
})
export class ValidationDialogComponent {
  messages: string[];
  htmlMessages: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<ValidationDialogComponent>
  ) {
    this.messages = data.messages || [];
  }
  onCloseClick(): void {
    this.dialogRef.close();
  }
  
  ngOnInit(): void{
    this.htmlMessages = '<ul>' + this.messages.map(m => `<li>${m}</li>`).join('') + '</ul>';
  }
}