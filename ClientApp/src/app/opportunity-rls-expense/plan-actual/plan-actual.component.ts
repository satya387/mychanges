import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { OpportunityRlsExpenseService } from '../opportunity-rls-expense.service';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';

export interface PeriodicElement {
  projectName: string;
  projectId: number;
  plan_Revenue: number;
  plan_Salary: number;
  plan_Margin: number;
  plan_Margin_Percent: number;
  actual_Revenue: number;
  actual_Salary: number;
  actual_Margin: number;
  actual_Margin_Percent: number;
}

// const ELEMENT_DATA: PeriodicElement[] = [
//   {projectid: 1, projectname: 'Hydrogen', plan_revenue: 1234, plan_salary: 123, plan_margin: 12, plan_margin_percent: 0.12, actual_revenue: 4321, actual_salary:432, actual_margin: 43, actual_margin_percent: 0.43 },
//   {projectid: 2, projectname: 'Helium', plan_revenue: 1234, plan_salary: 123, plan_margin: 12, plan_margin_percent: 0.12, actual_revenue: 4321, actual_salary:432, actual_margin: 43, actual_margin_percent: 0.43 },
//   {projectid: 3, projectname: 'Lithium', plan_revenue: 1234, plan_salary: 123, plan_margin: 12, plan_margin_percent: 0.12, actual_revenue: 4321, actual_salary:432, actual_margin: 43, actual_margin_percent: 0.43 },
//   {projectid: 4, projectname: 'Beryllium', plan_revenue: 1234, plan_salary: 123, plan_margin: 12, plan_margin_percent: 0.12, actual_revenue: 4321, actual_salary:432, actual_margin: 43, actual_margin_percent: 0.43 },
//   {projectid: 5, projectname: 'Boron', plan_revenue: 1234, plan_salary: 123, plan_margin: 12, plan_margin_percent: 0.12, actual_revenue: 4321, actual_salary:432, actual_margin: 43, actual_margin_percent: 0.43 },
//   {projectid: 6, projectname: 'Carbon', plan_revenue: 1234, plan_salary: 123, plan_margin: 12, plan_margin_percent: 0.12, actual_revenue: 4321, actual_salary:432, actual_margin: 43, actual_margin_percent: 0.43 },
//   {projectid: 7, projectname: 'Nitrogen', plan_revenue: 1234, plan_salary: 123, plan_margin: 12, plan_margin_percent: 0.12, actual_revenue: 4321, actual_salary:432, actual_margin: 43, actual_margin_percent: 0.43 },
//   {projectid: 8, projectname: 'Oxygen', plan_revenue: 1234, plan_salary: 123, plan_margin: 12, plan_margin_percent: 0.12, actual_revenue: 4321, actual_salary:432, actual_margin: 43, actual_margin_percent: 0.43 },
//   {projectid: 9, projectname: 'Fluorine', plan_revenue: 1234, plan_salary: 123, plan_margin: 12, plan_margin_percent: 0.12, actual_revenue: 4321, actual_salary:432, actual_margin: 43, actual_margin_percent: 0.43 },
//   {projectid: 10, projectname: 'Neon', plan_revenue: 1234, plan_salary: 123, plan_margin: 12, plan_margin_percent: 0.12, actual_revenue: 4321, actual_salary:432, actual_margin: 43, actual_margin_percent: 0.43 },
// ];

@Component({
  selector: 'app-plan-actual',
  templateUrl: './plan-actual.component.html',
  styleUrls: ['./plan-actual.component.scss']
})



export class PlanActualComponent implements OnInit, AfterViewInit {

  htmlContent: SafeHtml;
  years: number[] = [];
  selectedYear: number = new Date().getFullYear();
  selectedMonth: number = new Date().getMonth() -1;
  months: any[] = [];
  periodicData: PeriodicElement[] = [];

  constructor(private oppRlsExpService: OpportunityRlsExpenseService,private sanitizer: DomSanitizer,
    private router: Router, public dialogRef: MatDialogRef<PlanActualComponent>) { }

  ngOnInit(): void {
    this.initializeYears();
    this.initializeMonths();
    this.setDefaultMonth();
    //this.getPAData(this.selectedYear, this.selectedMonth);
  }

  displayedColumns = [
    'projectname',
    'plan_revenue',
    'plan_salary',
    'plan_margin',
    'plan_margin_percent',
    'actual_revenue',
    'actual_salary',
    'actual_margin',
    'actual_margin_percent',
    'star'
  ];
  //dataSource = ELEMENT_DATA;

  dataSource = new MatTableDataSource<PeriodicElement>([]);

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  goBack() {
    this.router.navigate(['resource-loading']);
  }

  initializeYears() {
    const startYear = 2025; // fixed starting year
    const currentYear = new Date().getFullYear();
  
    this.years = []; // reset array
  
    for (let year = startYear; year <= currentYear; year++) {
      this.years.push(year);
    }
  }

  onYearChange(event: Event) {
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.selectedYear = parseInt(selectedValue, 10);
    console.log('Selected Year:', this.selectedYear);
  }

  initializeMonths() {
    //this.months = Array.from({ length: 12 }, (_, i) => i + 1);
    this.months = [
      { name: 'January', value: 1 },
      { name: 'February', value: 2 },
      { name: 'March', value: 3 },
      { name: 'April', value: 4 },
      { name: 'May', value: 5 },
      { name: 'June', value: 6 },
      { name: 'July', value: 7 },
      { name: 'August', value: 8 },
      { name: 'September', value: 9 },
      { name: 'October', value: 10 },
      { name: 'November', value: 11 },
      { name: 'December', value: 12 }
    ];
  }
  
  onMonthChange(event: Event) {
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.selectedMonth = parseInt(selectedValue, 10);
    console.log('Selected Month:', this.selectedMonth);
  }

  setDefaultMonth() {
    const currentMonth = new Date().getMonth() + 1; // 1–12
    this.selectedMonth = currentMonth === 1 ? 12 : currentMonth - 1;
    console.log("Default Selected Month:", this.selectedMonth);
  }
  
  getPAData(selectedYear, selectedMonth){
    this.oppRlsExpService.getPAByMonthAndYear(selectedYear, selectedMonth).subscribe((data: any) => {
      if (!data.isError) {
        this.periodicData = data?.data?.planVsActual;

        // update table
        this.dataSource.data = this.periodicData;

        // ensure paginator is connected
        this.dataSource.paginator = this.paginator;
      }
    })
  }
  
  DownloadPAandViewReport() {
    const object = {
      Month: this.selectedMonth,
      Year: this.selectedYear
    };
    this.oppRlsExpService.downloadPAViewReport(object).subscribe(
      (data: HttpResponse<any>) => {
        if (data.status === 200 || data.status === 202) {
          console.log(`Got a successfull status code: ${data.status}`);
          const blob = new Blob([data.body], {
            type: 'application/vnd.ms-excel',
          });
          var downloadURL = window.URL.createObjectURL(blob);
          var link = document.createElement('a');
          link.href = downloadURL;
          link.download = 'Plan_VS_Actual_Report.xls';
          link.click();
          link.href = '';
          window.URL.revokeObjectURL(downloadURL);
          console.log(`This contains body: ${data.body}`);
        }
      },
      (err: HttpErrorResponse) => {
        console.log(`Got a error status code: ${err.status}`);
        if (err.status === 403) {
          console.error('403 status code caught');
        }
      }
    );
  }

  GetPLandViewHtmlReport() {
    const object = {
      Month: this.selectedMonth,
      Year: this.selectedYear
    };
    this.oppRlsExpService.getPAViewHtmlReport(object).subscribe((res: any) => {
        this.htmlContent = this.sanitizer.bypassSecurityTrustHtml(res.data);
        // Open a new tab
        const newTab = window.open('', '_blank');
        if (newTab) {
          newTab.document.write(this.htmlContent.toString().replace('SafeValue must use [property]=binding:','')
                                                            .replace('(see https://g.co/ng/security#xss)',''));
        }
        newTab.document.close();
      },
      (err: HttpErrorResponse) => {
        console.log(`Got a error status code: ${err.status}`);
        if (err.status === 403) {
          console.error('403 status code caught');
        }
      }
    )
  }

  onCloseClick(): void {
    this.dialogRef.close();
  }
}



