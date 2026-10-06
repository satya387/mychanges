import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RejectPurchaseRequestComponent } from './reject-purchase-request.component';

@Injectable({
    providedIn: 'root'
})
export class RejectPurchaseRequestService {

    constructor(private modelService: NgbModal) { }

    public confirm(
        title: string,
        message: string,
        btnOkText: string = 'REJECT',
        btnCancelText: string = 'CANCEL',
        dialogSize: 'md' | 'lg' = 'md'): Promise<boolean> {
        const modalRef = this.modelService.open(RejectPurchaseRequestComponent, { size: dialogSize });
        modalRef.componentInstance.title = title;
        modalRef.componentInstance.message = message;
        modalRef.componentInstance.btnOkText = btnOkText;
        modalRef.componentInstance.btnCancelText = btnCancelText;
        modalRef.componentInstance.modalOpened = true;
        
        return modalRef.result;
    }

}