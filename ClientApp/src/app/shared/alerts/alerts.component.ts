import { Component, Input, OnInit } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from "../../../environments/environment";
import { AlertsComponentService } from '../alerts/alert.service';
@Component({
  selector: 'app-confirmation-popup',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.scss']
})
export class AlertsComponent implements OnInit {

  @Input() title: string;
  @Input() message: string;
  @Input() btnOkText: string;
  @Input() btnCancelText: string;
  searchResult: any;
  MyAreaurl: string;
  alerts: any;

  constructor(private activeModal: NgbActiveModal, private alertservice: AlertsComponentService) { }

  ngOnInit() {
    this.getalerts();
    this.MyArea();
    this.getalert();
   // document.getElementsByClassName('modal-dialog modal-md')[0].setAttribute('style','left:'+ ((<HTMLElement>document.getElementsByClassName('alrt-icon')[0]).offsetLeft - 56 ) + 'px; width: 278px;')
  }

  public decline() {
    this.activeModal.close(false);
  }

  public accept() {
    this.activeModal.close(true);
  }

  public dismiss() {
    this.activeModal.dismiss();
  }
  getalerts() {
    const userData = JSON.parse(sessionStorage.getItem('userDetail'));
    const ManagerId = userData.EmployeeId;
    //const ManagerId = 'INEMP2057'
    this.alertservice.getalerts(ManagerId).subscribe((result) => {
      this.searchResult = result;
      console.log(this.searchResult);
    })
  }
  MyArea() {
    const userData = JSON.parse(sessionStorage.getItem('userDetail'));
    const auth = userData.EmpAuthId;
    const email = userData.EmpFullEmailId;
    const MyAreaurl = environment.arcBaseUrl;
    const apiUrl = "/Dashboard/Clientlogin?email=" + email + "&oauth=" + auth + "&redirectURL=Dashboard/MyArea&isNewArcLogin=false";
    this.MyAreaurl = MyAreaurl + apiUrl;
  }
  getalert() {
    const userData = JSON.parse(sessionStorage.getItem('userDetail'));
    const empId = userData.EmployeeId;
    //const empId = 'INEMP2057'
    this.alertservice.getalert(empId).subscribe((result) => {
      this.alerts = result;
      console.log(this.alerts);
    })
  }
}
