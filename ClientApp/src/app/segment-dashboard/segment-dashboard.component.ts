import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http/http';
import { SegmentDashboardService } from './segment-dashboard.service';
import { ToastService } from '../common/toast/toast.service';
// import { AgChartOptions } from 'ag-charts-community';
// import { AgCartesianChartOptions, AgLineSeriesOptions } from 'ag-charts-community';
// import { AgCartesianSeriesTooltipRendererParams, AgChartOptions } from "ag-charts-community";
import { AgChartOptions, AgCartesianSeriesOptions } from 'ag-charts-community';

interface TreeNode {
  label: string;
  data?: ProjectData;
  children?: TreeNode[];
}

interface ProjectData {
  columns: { [key: string]: number };
  buTotals: { [key: string]: number };
  orgTotal: number;
}

interface BudgetData {
  category: string;
  values: { [key: string]: number };
}

interface BudgetApiResponse {
  isError: boolean;
  message: string;
  data: BudgetData[];
}

interface FormattedTableData {
  category: string;
  values: {
    [bu: string]: {
      [qtr: string]: number;
    };
  };
}

@Component({
  selector: 'app-segment-dashboard',
  templateUrl: './segment-dashboard.component.html',
  styleUrls: ['./segment-dashboard.component.scss'],
})
export class SegmentDashboardComponent implements OnInit {
  tableData: BudgetData[] = [];
  buList: string[] = [];
  quarterList: string[] = [];
//   htmlContent: SafeHtml = 'NO DATA TO DISPLAY';
  selectedFunction: any;
//   reportContent: string | null = null;
//   showData: boolean = false;
  accountList: any;
//   employeeData: TreeNode[];
//   groupData: TreeNode[];
  overAllData: TreeNode[] = [];
  flatColumns: any;
  // buGroups: any;
  selectedYear: number;
  userAccess: any;
//   dataForGraph: any;
//   dataGroupLevelForGraph: any;
//   overAllDataForGraph: any;
  quarterlyChecked: boolean = true;
  addBackChecked: boolean = false;
  columns: string[] = []; // dynamic columns like BU_Desc|Segment|QTR
  buTotalColumns: string[] = []; // e.g., "Payer Enterprise"
  orgTotalColumn = 'Org Total';


  treeData: TreeNode[] = [];
  pivotColumns: any[] = [];
  buGroups: any[] = [];
  buSegments: any[] = [];
  categoriesByBu: { [bu: string]: any[] } = {};
  buKeys: string[] = [];
  quarterListByBu: string[] = [];
  rawData: BudgetApiResponse;
  rawSegmentData: BudgetApiResponse;
  selectedSegment: any;
  segmentList: any;
  rawGraphData = [];
  // rawGraphData = [
  //   { BU: "Payer", month: "Jan", value: "23.4%" }, 
  //   { BU: "Provider", month: "Jan", value: "13.9%" }, 
  //   { BU: "Payer", month: "Feb", value: "27.8%" },
  //   { BU: "Provider", month: "Feb", value: "22.2%" }
  // ];
  rawSegmentGraphData = [];
  public options: AgChartOptions  | null = null;
  public segment_options: AgChartOptions  | null = null;
  yearList = Array.from({ length: 2 }, (_, i) => new Date().getFullYear() - i); // Generate last 2 years
  public OverAllChartViewEnabled = false;
  constructor(
    private segmentService: SegmentDashboardService,
    private sanitizer: DomSanitizer,
    private toastService: ToastService
  ) {}

  async ngOnInit(): Promise<void> {
    try {
    debugger;
    this.selectedYear = new Date().getFullYear();
    await this.getProjectListByEmpId();
    await this.getSegmentListByEmpId();
    // this.checkUserAccess();
    await this.getOverallData();
    await this.getSegmentWiseData();
    await this.initializeChartOptions();
  } catch (error) {
    console.error("Init error:", error);
  }
  }  



  getProjectListByEmpId(): Promise<void> {
    return new Promise((resolve, reject) => {
    this.segmentService.getAccountsByEmpId().subscribe(
      (response: any) => {
        if (response) {
          this.accountList = response;
          if(!this.accountList.length){
              this.yearList = [];
          }
          resolve();
        }
      },
      (error: any) => {
        this.toastService.showError(error, 'Error');
      });
      this.segmentService.getAccountsByEmpId().subscribe({
        next: (response) => {
          this.accountList = response || [];
          resolve();
        },
        error: (err) => reject(err)
      });
  });
}
  getSegmentListByEmpId(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.segmentService.getSegmentsByEmpId().subscribe({
        next: (response) => {
          this.segmentList = response || [];
          // this.selectedSegment = this.segmentList[0]?.value;

          if (this.segmentList.length > 0) {
            this.selectedSegment = this.segmentList[0].value;
          }
          console.log('selectedSegment',this.selectedSegment);
          // this.selectedSegment = "CVS";
          resolve();
        },
        error: (err) => reject(err)
      });
  });
}

getOverallData(): Promise<void> {
  this.rawData = null;
  this.tableData = null;
  this.buList = [];
  this.quarterList = [];
  this.rawGraphData = [];
  const object = {
    functionName: this.selectedFunction?.value ?? '',
    segmentName: this.selectedSegment?.value ?? '',
    year: this.selectedYear ?? 0,
    isQuarterly: this.quarterlyChecked,
    isAddBack: this.addBackChecked
  };

  return new Promise((resolve, reject) => {
    this.segmentService.getSegmentDashboardOverAllData(object).subscribe({
      next: (response: BudgetApiResponse) => {
        this.rawData = response;
        this.tableData = this.rawData.data;      
        if(this.rawData.data.length > 0){
          // Optional: Extract unique BU and Quarter list
        this.buList = Object.keys(this.tableData[0].values);
        this.quarterList = Object.keys(this.tableData[0].values[this.buList[0]]);
        this.rawGraphData = this.extractSegmentMarginData(this.tableData);
        this.tableData = this.convertToMillionsUnlessPercentage(this.tableData);   
        console.log('Segment Margin Data Extracted:', this.rawGraphData);
        }
        resolve();
      },
      error: (err) => reject(err)
    });
  });
}
getSegmentWiseData(): Promise<void> {  
  this.rawSegmentData = null;
  this.rawSegmentGraphData = [];
  console.log('getSegmentWiseData selectedSegment',this.selectedSegment);
  const object = {
    functionName: this.selectedFunction?.value ?? '',
    segmentName: this.selectedSegment?.value ?? '',
    year: this.selectedYear ?? 0,
    isQuarterly: this.quarterlyChecked,
    isAddBack: this.addBackChecked
  };

  return new Promise((resolve, reject) => {
    this.segmentService.getSegmentDashboardDataBySegmentId(object).subscribe({
      next: (response: BudgetApiResponse) => {
        this.rawSegmentData = response; 
          const grouped: { [bu: string]: any[] } = {};
            for (const entry of this.rawSegmentData.data) {
              for (const bu of Object.keys(entry.values)) {
                if (!grouped[bu]) grouped[bu] = [];
                grouped[bu].push(entry);
              }
            }        
            this.categoriesByBu = grouped;
            this.buKeys = Object.keys(grouped);
            this.buKeys = Object.keys(grouped);
            // this.quarterListByBu = Object.keys(this.rawSegmentData.data.values[this.buKeys[0]]);
            const quarterSet = new Set<string>();

            this.rawSegmentData.data.forEach((item: any) => {
              const values = item.values;
              Object.values(values).forEach((bu: any) => {
                Object.keys(bu).forEach(qtr => {
                  if (qtr !== 'BU Total') {
                    quarterSet.add(qtr);
                  }
                });
              });
            });

            this.quarterListByBu = Array.from(quarterSet);
            this.rawSegmentGraphData = this.extractSegmentMarginData(this.rawSegmentData.data);
            // this.categoriesByBu = this.convertToMillionsUnlessPercentage(this.rawSegmentData.data);
            console.log('Segment Margin Data Extracted:', this.rawSegmentGraphData);
            resolve();
      },
      error: (err) => reject(err)
    });
  });
}

async onYearChange(): Promise<void> {
  let object = {
    functionName: this.selectedFunction?.value ?? '',
    segmentName: this.selectedSegment?.value ?? '',
    year: this.selectedYear ?? 0,
    isQuarterly: this.quarterlyChecked,
    isAddBack: this.addBackChecked
  };

  if (object.year != 0) {
    await this.getOverallData();
    await this.getSegmentWiseData();
    await this.initializeChartOptions();
  } 
  else{
    this.rawData = null;
    this.tableData = null;
    this.buList = [];
    this.quarterList = [];
    this.pivotColumns= [];
    this.buGroups = [];
    this.buSegments = [];
    this.treeData = null;

    this.rawSegmentData = null;
    this.rawGraphData = [];
    this.rawSegmentGraphData = [];
    this.categoriesByBu= {};
    this.buKeys = [];
  } 
}

async onSegmentChange(): Promise<void>{
  let object = {
    functionName: this.selectedFunction?.value ?? '',
    segmentName: this.selectedSegment?.value ?? '',
    year: this.selectedYear ?? 0,
    isQuarterly: this.quarterlyChecked,
    isAddBack: this.addBackChecked
  };
  if (object.segmentName != '' && object.year != 0) {      

    await this.getSegmentWiseData();
    await this.initializeChartOptions();
  } else{
    this.rawSegmentData = null;
    this.rawSegmentGraphData = [];
    this.categoriesByBu= {};
    this.buKeys = [];
  } 
}

extractSegmentMarginData(data: any[]): any[] {
  const result: any[] = [];

  const segmentMargin = data.find(d => d.category === 'Segment Margin%');
  if (!segmentMargin || !segmentMargin.values) return result;

  const values = segmentMargin.values;

  const months = new Set<string>();
  for (const bu in values) {
    Object.keys(values[bu]).forEach(month => {
      if (month !== "BU Total") {
        months.add(month);
      }
    });
  }

  for (const bu in values) {
    // const buShort = bu.replace(/ Enterprise| Technology| Sciences/gi, "").trim();
    for (const month of months) {
      if (values[bu][month] !== undefined) {
        result.push({
          BU: bu,   //buShort
          month,
          value: `${values[bu][month]}%`
        });
      }
    }
  }

  return result;
}
convertToMillionsUnlessPercentage(data: any[]): any[] {
  return data.map(item => {
    const isPercentage = item.category?.trim().endsWith('%');

    const grandTotal = isPercentage 
      ? item.grandTotal 
      : this.toMillions(item.grandTotal);

    const values: any = {};
    for (const bu in item.values) {
      values[bu] = {};
      for (const month in item.values[bu]) {
        const val = item.values[bu][month];
        values[bu][month] = isPercentage 
          ? val 
          : this.toMillions(val);
      }
    }

    return {
      ...item,
      grandTotal,
      values
    };
  });
}

toMillions(value: number): string {
  return `${(value / 1000000).toFixed(2)}M`;
}

initializeChartOptions(): Promise<void> {
  debugger;
  return new Promise((resolve, reject) => {
  console.log(this.rawGraphData);
  console.log(this.rawSegmentGraphData);
  const formattedData = this.formatChartData(this.rawGraphData);
  const segmentformattedData = this.formatChartData(this.rawSegmentGraphData);
  const series = this.createSeries(formattedData);
  const segmentseries = this.createSeries(segmentformattedData);

  this.options = {
    data: formattedData,
    series: series,
    axes: [
      { type: 'category', position: 'bottom', title: { text: 'Segment Margin' } },
      {
        type: 'number',
        position: 'left',
        label: {
          formatter: (v) => `${v.value}%`
        }
      }
    ],
    legend: { position: 'bottom' }
  };

  this.segment_options = {
    data: segmentformattedData,
    series: segmentseries,
    axes: [
      { type: 'category', position: 'bottom', title: { text: 'Segment Margin' } },
      {
        type: 'number',
        position: 'left',
        label: {
          formatter: (v) => `${v.value}%`
        }
      }
    ],
    legend: { position: 'bottom' }
  };
  resolve();

});
}


  formatChartData(data: any[]) {
    const months = [...new Set(data.map(d => d.month))];
    const BUs = [...new Set(data.map(d => d.BU))];
    
    return months.map(month => {
      const monthData: any = { month };
      BUs.forEach(bu => {
        const entry = data.find(d => d.BU === bu && d.month === month);
        monthData[bu] = entry ? parseFloat(entry.value.replace('%', '')) : null;
      });
      return monthData;
    });
  }

  createSeries(data: any[]): AgCartesianSeriesOptions<any>[] {
    if (!data || data.length === 0) return [];
    const BUs = Object.keys(data[0]).filter(k => k !== 'month');
    if (BUs.length === 0) return [];
    const colors = ['#0D0359', '#0FE4BD', '#ffa500', '#007bff', '#28a745', '#ffc107', '#dc3545'];
  
    return BUs.map((bu, index) => ({
      type: 'line',
      xKey: 'month',
      yKey: bu,
      yName: bu,
      stroke: colors[index % colors.length],
      marker: {
        fill: colors[index % colors.length], stroke: colors[index % colors.length]
      },
      // marker: { shape: 'circle', size: 6 },
      strokeWidth: 2
    }));
  }

  onOverAllChartViewChange() {
    // console.log("Toggled: View as Chart", this.OverAllChartViewEnabled);
  }


  getGrandTotal(row: any): number {
    // debugger;
    // console.log(row);
    if(row.category == "Direct Margin%" || row.category == "Gross Margin%" || row.category == "Segment Margin%"){
      const values = Object.values(row.values)
                    .map((val: any) => val["BU Total"])
                    .filter(v => v !== undefined); // ensure BU Total exists

    const average = values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0;
    return parseFloat(average.toFixed(2)); 
    }
    else{
      return parseFloat(Object.values(row.values)
      .map((val: any) => val["BU Total"] || 0)
      .reduce((a, b) => a + b, 0));
      // .reduce((a, b) => a + b, 0).toFixed(2));
    }
    
  }
//   checkUserAccess() {
//     this.sgaService
//       .getSGAAccessByEmpemidsId()
//       .subscribe((access: any) => (this.userAccess = access?.accessType));
//   }


  // Method to handle report selection and fetch HTML content from the API
  // onFunctionChange(): void {
  //   let object = {
  //     functionName: this.selectedFunction?.value ?? '',
  //     year: this.selectedYear ?? 0,
  //     isQuarterly: this.quarterlyChecked,
  //     isAddBack: this.addBackChecked
  //   };
  //   if (object.functionName != '' && object.year != 0) {      

  //       //if(this.userAccess == "SGA_Dashboard_Admin"){
  //       this.segmentService
  //       .getSegmentDashboardOverAllData(object)
  //       .subscribe((data: any) => {
  //         this.rawData = data;
  //         this.generateUniqueColumnsData();
  //       });
  //     //}
  //   } else{
  //     this.rawData = null;
  //     this.pivotColumns= [];
  //     this.buGroups = [];
  //     this.buSegments = [];
  //     this.treeData = null;
  //   } 
  // }

  getCustomerRowSpan(customer: any): number {
    return customer.categories.reduce(
      (sum: number, category: any) => sum + category.employees.length,
      0
    );
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
