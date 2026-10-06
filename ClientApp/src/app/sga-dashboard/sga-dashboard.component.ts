import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http/http';
import { SgaDashboardService } from './sga-dashboard.service';
import { ToastService } from '../common/toast/toast.service';

interface TreeNode {
  data: {
    functionGroupName?: string; // Made optional
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
  selector: 'app-sga-dashboard',
  templateUrl: './sga-dashboard.component.html',
  styleUrls: ['./sga-dashboard.component.scss'],
})
export class SgaDashboardComponent implements OnInit {
  htmlContent: SafeHtml = 'NO DATA TO DISPLAY';
  selectedFunction: any;
  reportContent: string | null = null;
  showData: boolean = false;
  accountList: any;
  employeeData: TreeNode[];
  groupData: TreeNode[];
  overAllData: TreeNode[];
  selectedYear: number;
  userAccess: any;
  dataForGraph: any;
  dataGroupLevelForGraph: any;
  overAllDataForGraph: any;
  quarterlyChecked: boolean = true;
  addBackChecked: boolean = false;

  yearList = Array.from({ length: 2 }, (_, i) => new Date().getFullYear() - i); // Generate last 2 years

  constructor(
    private sgaService: SgaDashboardService,
    private sanitizer: DomSanitizer,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.getProjectListByEmpId();
    this.checkUserAccess();
  }

  checkUserAccess() {
    this.sgaService
      .getSGAAccessByEmpemidsId()
      .subscribe((access: any) => (this.userAccess = access?.accessType));
  }

  onYearChange() {
    let object = {
      functionName: this.selectedFunction?.value ?? '',
      year: this.selectedYear ?? 0,
      isQuarterly: this.quarterlyChecked,
      isAddBack: this.addBackChecked
    };

    if (object.functionName != '' && object.year != 0) {
      this.sgaService
        .getSGADashboardDataByEmployeeFunction(object)
        .subscribe((data: any) => {
          this.employeeData = data.data;
        });
      this.sgaService
        .getSGADashboardDataForGraph(object)
        .subscribe((data: any) => {
          this.dataForGraph = data.data;
        });

      this.sgaService
        .getSGADashboardDataGroupLevelByFunction(object)
        .subscribe((data: any) => {
          this.groupData = data.data;
        });
      this.sgaService
        .GetSGADashboardDataGroupLevelForGraph(object)
        .subscribe((data: any) => {
          this.dataGroupLevelForGraph = data.data;
        });

      if (this.userAccess == 'SGA_Dashboard_Admin') {
        this.sgaService
          .getSGADashboardOverAllData(object)
          .subscribe((data: any) => {
            this.overAllData = data.data;
          });
        this.sgaService
          .GetSGADashboardOverAllDataForGraph(object)
          .subscribe((data: any) => {
            this.overAllDataForGraph = data.data;
          });
      }
    } else this.employeeData = null;
    this.groupData = null;
    this.overAllData = null;
  }

  // Method to handle report selection and fetch HTML content from the API
  onFunctionChange(): void {
    let object = {
      functionName: this.selectedFunction?.value ?? '',
      year: this.selectedYear ?? 0,
      isQuarterly: this.quarterlyChecked,
      isAddBack: this.addBackChecked
    };
    if (object.functionName != '' && object.year != 0) {
      this.sgaService
        .getSGADashboardDataByEmployeeFunction(object)
        .subscribe((data: any) => {
          this.employeeData = data.data;
          this.showData = true;
        });
        this.sgaService
        .getSGADashboardDataForGraph(object)
        .subscribe((data: any) => {
          this.dataForGraph = data.data;
        });

      this.sgaService
        .getSGADashboardDataGroupLevelByFunction(object)
        .subscribe((data: any) => {
          this.groupData = data.data;
        });
        this.sgaService
        .GetSGADashboardDataGroupLevelForGraph(object)
        .subscribe((data: any) => {
          this.dataGroupLevelForGraph = data.data;
        });

        if(this.userAccess == "SGA_Dashboard_Admin"){
        this.sgaService
        .getSGADashboardOverAllData(object)
        .subscribe((data: any) => {
          this.overAllData = data.data;
        });
        this.sgaService
        .GetSGADashboardOverAllDataForGraph(object)
        .subscribe((data: any) => {
          this.overAllDataForGraph = data.data;
        });
      }
    } else this.employeeData = null;
    this.groupData = null;
    this.overAllData = null;
  }

  getCustomerRowSpan(customer: any): number {
    return customer.categories.reduce(
      (sum: number, category: any) => sum + category.employees.length,
      0
    );
  }

  getProjectListByEmpId() {
    this.sgaService.getAccountsByEmpId().subscribe(
      (response: any) => {
        if (response) {
          this.accountList = response;
          if(!this.accountList.length){
              this.yearList = [];
          }
        }
      },
      (error: any) => {
        this.toastService.showError(error, 'Error');
      }
    );
  }

  onReportChange(): void {
    let object = {
      functionName:
        this.userAccess == 'SGA_Dashboard_Admin'
          ? '-1'
          : this.selectedFunction?.value ?? '',
    };
    if (object.functionName) {
      this.sgaService.getSGAReport(object).subscribe(
        (response: HttpResponse<any>) => {
          if (response.status === 200 || response.status === 202) {
            console.log(`Got a successfull status code: ${response.status}`);
            const blob = new Blob([response.body], {
              type: 'application/vnd.ms-excel',
            });
            var downloadURL = window.URL.createObjectURL(blob);
            var link = document.createElement('a');
            link.href = downloadURL;
            link.download = 'SGA_Dashboard_Report.xls';
            link.click();
            link.href = '';
            window.URL.revokeObjectURL(downloadURL);
            console.log(`This contains body: ${response.body}`);
          }
        },
        (err: HttpErrorResponse) => {
          console.log(`Error fetching report: ${err}`);
          if (err.status === 403) {
            console.error('403 status code caught');
          }
        }
      );
    } else {
      this.toastService.showInfo(
        'Please select the function and year',
        'Information'
      );
    }
  }

  onAddBackChange(){
    // console.log(this.addBackChecked);
    this.onYearChange();
    
  }
  onQuarterChange(){
    // console.log(this.quarterlyChecked);
    this.onYearChange();
  }
}
