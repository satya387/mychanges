import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApprovePurchaseRequestComponent } from './approve-purchase-request.component';

@Injectable({
    providedIn: 'root'
})
export class ApprovePurchaseRequestService {

    constructor(private modelService: NgbModal) { }

    public confirm(
        title: string,
        message: string,
        btnOkText: string ='APPROVE',
        btnCancelText: string = 'CANCEL',
        dialogSize: 'md' | 'lg' = 'md'): Promise<boolean> {
        const modalRef = this.modelService.open(ApprovePurchaseRequestComponent, { size:dialogSize });
        modalRef.componentInstance.title = title;
        modalRef.componentInstance.message = message;
        modalRef.componentInstance.btnOkText = btnOkText;
        modalRef.componentInstance.btnCancelText = btnCancelText;
        modalRef.componentInstance.modalOpened = true;
        return modalRef.result;
    }

}