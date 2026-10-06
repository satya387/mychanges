import { Component, OnInit } from '@angular/core';
import { CommissionReportService } from '../commission-report.service';
import { ToastService } from '../../common/toast/toast.service';
import { Router } from '@angular/router';

interface TreeNode {
  data: {
    clientPartner?: string; // Made optional
    customerName?: string;
    categoryName?: string;
    budgetCategoryName?: string;
    employeeName?: string;
    q1?: number;
    q2?: number;
    q3?: number;
    q4?: number;
  };
  children?: TreeNode[];
}

@Component({
  selector: 'app-drill-down-commission-report',
  templateUrl: './drill-down-commission-report.component.html',
  styleUrls: ['./drill-down-commission-report.component.scss']
})
export class DrillDownCommissionReportComponent implements OnInit {

  commssionDataList : TreeNode[];

  constructor(private _commissionReportService: CommissionReportService,
    private toastService: ToastService,
    private router: Router) { }

  ngOnInit(): void {
    this._commissionReportService.clientPartnerId$.subscribe(id => {
      if(id)
        this.GetCommissionReportDrillDownData(id);
      else
        this.router.navigate(['commission-report']);
    });
  }

  GetCommissionReportDrillDownData(clientParnerId){
    this._commissionReportService.GetCommissionReportDrillDownData(clientParnerId).subscribe((data: any) =>{
        if(data.data){
          this.commssionDataList = data.data;
        }
      },(error: any) => {
        this.toastService.showError(error, 'Error');
    });
  }

  goBack(){
    this.router.navigate(['commission-report']);
  }
  
}
