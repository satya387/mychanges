import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ALERT_URLS } from './alert.Url-config';

import { AlertsComponent } from './alerts.component';
@Injectable({
  providedIn: 'root'
})
export class AlertsComponentService {

  constructor(private modalService: NgbModal, private http: HttpClient) { }

  public confirm(
    title: string,
    message: string,
    btnOkText: string = 'viewAll',
    //btnCancelText: string = 'CANCEL',
    dialogSize: 'md' | 'lg' = 'md'): Promise<boolean> {
    if (this.modalService.hasOpenModals()) {
      this.modalService.dismissAll(false);
    } else {
      const modalRef = this.modalService.open(AlertsComponent, { size: dialogSize });
      modalRef.componentInstance.title = title;
      modalRef.componentInstance.message = message;
      modalRef.componentInstance.btnOkText = btnOkText;
      //modalRef.componentInstance.btnCancelText = btnCancelText;
      return modalRef.result;
    }


  }
  getalerts(ManagerId) {
    return this.http.get(ALERT_URLS.GET_ALERT_LIST + ManagerId);
  }
  getalert(EmpId) {
    return this.http.get(ALERT_URLS.Get_List + EmpId)
  }
}
