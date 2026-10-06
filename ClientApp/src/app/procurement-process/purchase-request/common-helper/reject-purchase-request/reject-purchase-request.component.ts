import { Component, Input, HostListener } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-reject-purchase-request',
  templateUrl: './reject-purchase-request.component.html',
  styleUrls: ['./reject-purchase-request.component.scss']
})
export class RejectPurchaseRequestComponent {
  isValid: boolean = false;
  formData = {
    Comments: ''
  };

  @Input() title: string;
  @Input() message: string;
  @Input() btnOkText: string;
  @Input() btnCancelText: string;
  @Input() modalOpened : boolean = false;
  constructor(public activeModal: NgbActiveModal) { }

  onSave() {
    // Assuming validation passes here
    if (this.formData.Comments != ''){
      this.activeModal.close(this.formData);
      this.modalOpened = true;
    }
    else{
      this.isValid = true;
      this.modalOpened = true;
    }
  }

  onCancel() {
    this.activeModal.dismiss('cancel');
    this.modalOpened = false;
  }

  rejectCommentValidation(event) {
    debugger;
    if (event.target.value != '')
      this.isValid = false;
    else
      this.isValid = true;
  }

  @HostListener('window:popstate', ['$event'])
    onPopState(event: Event) {
    if (this.activeModal) {
      this.activeModal.dismiss('Navigation');
      this.activeModal = null; // Clear reference
    }
  }
}
