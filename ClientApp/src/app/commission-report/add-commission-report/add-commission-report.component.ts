import { Component, OnInit, OnDestroy, AfterViewInit,ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommissionReportService } from '../commission-report.service'
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ToastService } from '../../common/toast/toast.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CurrencyPipe, DecimalPipe  } from '@angular/common';
import {LiveAnnouncer} from '@angular/cdk/a11y';
import {MatSort, Sort} from '@angular/material/sort';
import { findIndex, find } from 'lodash';
import { Pagination_Items_Per_Page, settings } from '../../common/configuration.settings';
import { MatSelect } from '@angular/material/select';

@Component({
  selector: 'app-add-commission-report',
  templateUrl: './add-commission-report.component.html',
  styleUrls: ['./add-commission-report.component.scss']
})
export class AddCommissionReportComponent implements OnInit, OnDestroy, AfterViewInit {

  private routeSubscription: Subscription;
  clientParnerId : any;
  commssionDataList: CommissionData[];
  commssionData: CommissionData;
  
  constructor(private _commissionReportService: CommissionReportService,
  private toastService: ToastService,
  private activatedRoute: ActivatedRoute,
  private currencyPipe: CurrencyPipe,
  private numberPipe: DecimalPipe,
  private router: Router,
  private _liveAnnouncer : LiveAnnouncer
  ) { }

  displayedColumns: string[] = [ 'accountName', 'projectName','accountType',  //'clientPartner',
  'type', 'incentiveYear', 'incentiveMonth', 'billed','collected','incentiveEarned', 'applicablePercentage',
  'incentivePercentageAsPerPolicy', 'comments', 'edit'];
  dataSource = new MatTableDataSource<CommissionData>();

  // Arrays to hold distinct values for each filter
  distinctAccountNames: string[] = [];
  distinctProjectNames: string[] = [];
  distinctIncentiveYears: string[] = [];
  distinctIncentiveMonths: string[] = [];

  filteredProjectNames: string[] = [];
  filteredIncentiveYears: string[] = [];
  filteredIncentiveMonths: string[] = [];

  // Track selected values for filtering
  selectedAccountName: string = null;
  selectedProjectName: string = null;
  selectedIncentiveYear: string = null;
  selectedIncentiveMonth: string = null;
  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit(): void {
    this._commissionReportService.clientPartnerId$.subscribe(id => {
      if(id){
        this.clientParnerId = id;
        this.GetCommissionReportByClientId(id);
      }
      else
        this.router.navigate(['commission-report']);
    });
  }

  ngOnDestroy() {
    // Prevent memory leaks by unsubscribing when the component is destroyed
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  GetCommissionReportByClientId(clientParnerId){
    this._commissionReportService.GetCommissionReportByClientId(clientParnerId).subscribe((data: any) =>{
        if(data.data){
          this.commssionDataList = data.data;
          this.dataSource.data = this.commssionDataList;

          // Extract distinct values for filters
        this.distinctAccountNames = this.getDistinctValues(data.data, 'accountName');
        }
      },(error: any) => {
        this.toastService.showError(error, 'Error');
    });
  }

  // Helper function to get distinct values for each field
  getDistinctValues(data: CommissionData[], field: string): string[] {
    return [...new Set(data.map(item => item[field]))].sort();  // Remove duplicates and sort
  }

  // Handle changes in Account Name dropdown
  onAccountNameChange(): void {
    
    this.filteredProjectNames = this.getDistinctValues(this.dataSource.data.filter(item => item.accountName === this.selectedAccountName), 'projectName');
    this.selectedProjectName = null;
    this.filteredIncentiveYears = [];
    this.selectedIncentiveYear = null;
    this.filteredIncentiveMonths = [];
    this.selectedIncentiveMonth = null;
    this.applyFilters();
  }
  
  // Handle changes in Project Name dropdown
  onProjectNameChange(): void {
    this.filteredIncentiveYears = this.getDistinctValues(this.dataSource.data.filter(item => item.projectName === this.selectedProjectName), 'incentiveYear');
    this.selectedIncentiveYear = null;
    this.filteredIncentiveMonths = [];
    this.selectedIncentiveMonth = null;
    this.applyFilters();
  }
  
  // Handle changes in Year dropdown
  onIncentiveYearChange(): void {
    const monthMap = {
      'Jan': 1,'Feb': 2,'Mar': 3,'Apr': 4,'May': 5,'Jun': 6,'Jul': 7,'Aug': 8,'Sep': 9,'Oct': 10,'Nov': 11,'Dec': 12
    };
    this.filteredIncentiveMonths = this.getDistinctValues(this.dataSource.data.filter(item => 
      item.incentiveYear.toString() === this.selectedIncentiveYear.toString()
    ), 'incentiveMonth').sort((a, b) => monthMap[a] - monthMap[b]);
    this.selectedIncentiveMonth = null;
    this.applyFilters();
  }
  
  // Handle changes in Month dropdown
  onIncentiveMonthChange(): void {
    this.applyFilters();
  }


  // Apply the filters to the data source
  applyFilters(): void {
    let filteredData = this.dataSource.data;
    if (this.selectedAccountName) {
      filteredData = filteredData.filter(item => item.accountName === this.selectedAccountName);
      if(filteredData.length == 0){
        let newfilteredData = this.reloadCommissionReportByClientId(this.clientParnerId);
        filteredData = newfilteredData.filter(item => item.accountName === this.selectedAccountName);
        this.filteredProjectNames = this.getDistinctValues(filteredData.filter(item => item.accountName === this.selectedAccountName), 'projectName');
      }
      this.dataSource.data = filteredData;
    }
  
    if (this.selectedProjectName) {
      filteredData = filteredData.filter(item => item.projectName === this.selectedProjectName);
      if(filteredData.length == 0){
        let newfilteredData = this.reloadCommissionReportByClientId(this.clientParnerId);
        filteredData = newfilteredData.filter(item => 
          item.accountName === this.selectedAccountName &&
          item.projectName === this.selectedProjectName
        );
        this.filteredIncentiveYears = this.getDistinctValues(filteredData.filter(item => item.projectName === this.selectedProjectName), 'incentiveYear');
      }
      this.dataSource.data = filteredData;
    }
  
    if (this.selectedIncentiveYear) {
      filteredData = filteredData.filter(item => item.incentiveYear.toString() === this.selectedIncentiveYear.toString());
      if(filteredData.length == 0){
        let newfilteredData = this.reloadCommissionReportByClientId(this.clientParnerId);
        filteredData = newfilteredData.filter(item => 
          item.accountName === this.selectedAccountName &&
          item.projectName === this.selectedProjectName &&
          item.incentiveYear.toString() === this.selectedIncentiveYear.toString()
        );
        const monthMap = {
          'Jan': 1,'Feb': 2,'Mar': 3,'Apr': 4,'May': 5,'Jun': 6,'Jul': 7,'Aug': 8,'Sep': 9,'Oct': 10,'Nov': 11,'Dec': 12
        };
        this.filteredIncentiveMonths = this.getDistinctValues(filteredData.filter(item =>
          item.incentiveYear.toString() === this.selectedIncentiveYear.toString()), 'incentiveMonth').sort((a, b) => monthMap[a] - monthMap[b]);;
      }
      this.dataSource.data = filteredData;
    }
  
    if (this.selectedIncentiveMonth) {
      
      filteredData = filteredData.filter(item => item.incentiveMonth === this.selectedIncentiveMonth);
      if(filteredData.length == 0){
        let newfilteredData = this.reloadCommissionReportByClientId(this.clientParnerId);
        filteredData = newfilteredData.filter(item => 
          item.accountName === this.selectedAccountName &&
          item.projectName === this.selectedProjectName &&
          item.incentiveYear.toString() === this.selectedIncentiveYear.toString() &&
          item.incentiveMonth === this.selectedIncentiveMonth 
        );
      }
      this.dataSource.data = filteredData;
    }
  }

  reloadCommissionReportByClientId(clientParnerId){
    this._commissionReportService.GetCommissionReportByClientId(clientParnerId).subscribe((data: any) =>{
        if(data.data){
          this.commssionDataList = data.data;
        }
      },(error: any) => {
        this.toastService.showError(error, 'Error');
    });
    return this.commssionDataList;
  }

  clearFilters(){
    this.distinctAccountNames = [];
    this.selectedAccountName = null;
    this.filteredProjectNames = [];
    this.selectedProjectName = null;
    this.filteredIncentiveYears = [];
    this.selectedIncentiveYear = null;
    this.filteredIncentiveMonths = [];
    this.selectedIncentiveMonth = null;
    this.GetCommissionReportByClientId(this.clientParnerId);
  }

  GetCommissionReportById(incentiveEarnedId){
    this._commissionReportService.GetCommissionReportById(incentiveEarnedId).subscribe((data: any) =>{
        if(data.data){
          this.commssionData = data.data;
        }
      },(error: any) => {
        this.toastService.showError(error, 'Error');
    });
    return this.commssionData;
  }

  // Save changes to the element
  saveChanges(incentiveEarnedId: number) {
    const element = this.getElementById(incentiveEarnedId);
    if (element) {
      this._commissionReportService.updateIncentiveEarnedById(element).subscribe((res) => {
          this.toastService.showSuccess(res.message, 'Success');
        },
        (error: any) => {
          this.toastService.showError(error, 'Error')
        });
    }
  }

  // Cancel changes: restore the original values from the DB
  async cancelChanges(incentiveEarnedId: number) {
    const element = this.getElementById(incentiveEarnedId);
    if (element.incentiveEarnedId) {
      // Retrieve the original object from the DB
      // Wait for the result of the asynchronous call
      const originalElement = await this.GetCommissionReportById(element.incentiveEarnedId);
      if(originalElement){
      element.applicablePercentage = originalElement.applicablePercentage;
      element.comments = originalElement.comments;
      }
      else{
        console.log('No original data found for canceling changes');
      }
    } else {
      console.log('No original data found for canceling changes');
    }
  }

  getElementById(id: number) {
    // Assuming you have a list of elements (maybe in an array) called elements
    return this.dataSource.data.find(el => el.incentiveEarnedId === id);
  }

  
  // Convert the given number to US Currency Format with 2 decimal places 
  convertToUSFormat(amount) {
    if(amount)
      return this.numberPipe.transform(amount, '1.2-2');
    else
      return 0;
  }

  goBack(){
    this.router.navigate(['commission-report']);
  }


  onPercentageChange(event: any): void {
    let value = event.target.value;
    // Regular expression to match numbers with up to two decimal places
    const regex = /^\d*\.?\d{0,2}$/;

    if (!regex.test(value)) {
      event.target.value = value.slice(0, -1);  // Remove last character if invalid
    }
  }

  GetCommissionReportGrid(clientParnerId, ProjectId, Year, Month){
    let requestBody = {
      "ClientPartnerId" : clientParnerId,
      "ProjectId" : ProjectId,
      "Year" : Year,
      "Month" : Month
    }
    this._commissionReportService.getCommissionReportGrid(requestBody).subscribe((data: any) =>{
        if(data.data){
          this.commssionDataList = data.data;
          this.dataSource.data = this.commssionDataList;
        }
      },(error: any) => {
        this.toastService.showError(error, 'Error');
    });
  }
  
}

interface CommissionData {
  incentiveEarnedId: number;
  clientPartner: string;
  accountName: string;
  projectName: string;
  accountType: string;
  type: string;
  incentiveYear : number;
  incentiveMonth : string;
  billed: number;
  collected: number;
  applicablePercentage: number;
  incentivePercentageAsPerPolicy: number;
  incentiveEarned: number;
  comments: string;
}