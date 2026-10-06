import { Injectable } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ConfirmationPopupComponent } from './confirmation-popup.component';
@Injectable({
  providedIn: 'root'
})
export class ConfirmationPopupService {

  constructor(private modalService: NgbModal) { }

  public confirm(
    title: string,
    message: string,
    btnOkText: string = 'DELETE',
    btnCancelText: string = 'CANCEL',
    dialogSize: 'md'|'lg' = 'md'): Promise<boolean> {
    const modalRef = this.modalService.open(ConfirmationPopupComponent, { size: dialogSize });
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.message = message;
    modalRef.componentInstance.btnOkText = btnOkText;
    modalRef.componentInstance.btnCancelText = btnCancelText;

    return modalRef.result;
  }
}
