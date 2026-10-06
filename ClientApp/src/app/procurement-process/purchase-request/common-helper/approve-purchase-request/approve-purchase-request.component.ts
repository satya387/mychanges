import { Component, Input, HostListener } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-approve-purchase-request',
  templateUrl: './approve-purchase-request.component.html',
  styleUrls: ['./approve-purchase-request.component.scss']
})
export class ApprovePurchaseRequestComponent {
  @Input() title: string;
  @Input() message: string;
  @Input() btnOkText: string;
  @Input() btnCancelText: string;
  @Input() modalOpened : boolean = false;

  constructor(private activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

  onSave() {
    this.activeModal.close(true); // Close the modal and pass the true as result
    this.modalOpened = true;
  }

  onCancel() {
    this.activeModal.dismiss(); // Dismiss the modal without any result
    this.modalOpened = false;
  }

  @HostListener('window:popstate', ['$event'])
    onPopState(event: Event) {
    if (this.activeModal) {
      this.activeModal.dismiss('Navigation');
      this.activeModal = null; // Clear reference
    }
  }
  
}
