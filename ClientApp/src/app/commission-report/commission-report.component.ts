import { Component, OnInit, AfterViewInit,ViewChild } from '@angular/core';
import { CommissionReportService } from './commission-report.service'
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ToastService } from '../common/toast/toast.service';
import { Router } from '@angular/router';
import { CurrencyPipe, DecimalPipe  } from '@angular/common';

@Component({
  selector: 'app-commission-report',
  templateUrl: './commission-report.component.html',
  styleUrls: ['./commission-report.component.scss']
})

export class CommissionReportComponent implements OnInit, AfterViewInit {

  commssionData: PeriodicElement[];
  userAccess : boolean;

  constructor(
    private _commissionReportService: CommissionReportService,
    private toastService: ToastService,
    private router: Router,
    private currencyPipe: CurrencyPipe,
    private numberPipe: DecimalPipe
  ) {}
  displayedColumns: string[] = ['clientPartner', 'commissionEarned', 'commissionPaid', 'balance','edit'];
  dataSource = new MatTableDataSource<PeriodicElement>();

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit(){
    this.getAllCPCommissionData();
    this.checkIsAdmin();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  checkIsAdmin(){
    this._commissionReportService.checkIsAdminByEmpemidsId().subscribe((res) => {
      this.userAccess = res?.accessType == "Commission_Report_Admin" ? true : false;
    });
  }

  getAllCPCommissionData(){
    this._commissionReportService
        .getAllCPCommisionData()
        .subscribe((data: any) => {
          this.commssionData = data.data;
          this.dataSource.data = this.commssionData;
        });
  }

  // Convert the given number to US Currency Format with 2 decimal places 
  convertToUSFormat(amount) {
    if(amount)
      return this.numberPipe.transform(amount, '1.2-2');
    else
      return 0;
  }
  
  navigateToEdit(data?) {
    if (data) {
      this._commissionReportService.setClientPartnerId(data.clientPartnerId);
      this.router.navigate(['add-commission-report']);
    } else {
      this.router.navigate(['add-commission-report'], { queryParams: { isAdd: true } });
    }
  }

  navigateToDrillDown(data?) {
    if (data) {
      this._commissionReportService.setClientPartnerId(data.clientPartnerId);
      this.router.navigate(['commission-report-drill-down']);
    } 
  }
}

interface PeriodicElement {
  clientPartner: string;
  commissionEarned: number;
  commissionPaid: number;
  balance: string;
  edit: string
}

