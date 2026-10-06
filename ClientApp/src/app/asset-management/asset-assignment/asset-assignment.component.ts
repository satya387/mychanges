import { Component, OnInit } from '@angular/core';
import {AssetManagementService } from '../asset-management.service';
import { settings } from 'src/app/common/configuration.settings';
import { Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { FormGroup, FormBuilder } from '@angular/forms';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-asset-assignment',
  templateUrl: './asset-assignment.component.html',
  styleUrls: ['./asset-assignment.component.scss']
})
export class AssetAssignmentComponent implements OnInit {
  offset: any = settings.offset;
  page: any;
  isPageChanged: any;
  requestBody: any;
  limit: number = 8;
  AAList: any;
  totalRecord: any;
  isInitiateRequestCount: any;
  TypeList: any[] = [];
  form: FormGroup;
  searchTerm: any;
  selectedType: string = '';  
  searchControl = new FormControl();
  filterArray: any[] = [];

  constructor(
    private assetManagementService: AssetManagementService,
    private router: Router,
    private fb: FormBuilder
  ) {}
  ngOnInit(): void {
    this.configureRequest();
    this.setupValueChanges(); 
  }
  onDetails(deviceName: string): void{
    this.router.navigate(['asset-assignment-details'], { queryParams: {deviceName: deviceName } });
  }
  onAdd(): void {
    this.router.navigate(['add-asset-assignment'], { queryParams: { isAdd: true } });
  }
  
  editAsset(id: string): void {
    this.router.navigate(['add-asset-assignment'], { queryParams: { isAdd: false, id: id } });
  }

  onTableDataChange(event: any): void {
    this.offset = !isNaN(event) && event > 0 ? event : 1;
    this.page = this.offset;
    this.isPageChanged = this.page !== 1;
    if (this.searchTerm || this.selectedType) {
      this.SearchAMDetails(); 
    } else {
      this.configureRequest(); 
    }
  }
  configureRequest(field?: string, direction?: string, value?: any): void {
    this.requestBody = {
      "PageNumber": this.isPageChanged ? this.offset : 1,
      "PageSize": this.limit,
    };
    this.page = this.requestBody.PageNumber;
    this.offset = this.requestBody.PageNumber;
    this.getAADetails();
  }
  getAADetails(): void {
    this.assetManagementService.getAssetAssigment(this.requestBody).subscribe(
      (response: any) => {
        if (response) {
          this.AAList = response.data || [];
          this.totalRecord = response.totalCount; 
          this.isPageChanged = false;
          this.isInitiateRequestCount = response.initiateCount > 0 ? response.initiateCount : 0;
        }
      },
      (error: any) => {
        console.error(error);
      }
    );
  }
  setupValueChanges(): void {
    combineLatest([
      this.form.get('searchControl')?.valueChanges.pipe(
        debounceTime(300),
        distinctUntilChanged()
      ),
      this.form.get('typeControl')?.valueChanges.pipe(
        distinctUntilChanged()
      )
    ]).subscribe(([searchTerm, selectedType]) => {
      this.searchTerm = searchTerm ?? '';
     
      this.selectedType = selectedType;
      this.onSearch();
    });
  }
  
  onSearch(): void {
    this.page = this.isPageChanged ? this.offset : 1; 
    this.SearchAMDetails();  
  }

  SearchAMDetails(): void {
    debugger;
    this.requestBody = {
      "PageNumber": this.page,
      "PageSize": this.limit,
      "Name": this.searchTerm,
      "Type": this.selectedType 
    };
    this.assetManagementService.SearchAssetAssginment(this.requestBody).subscribe(
      (response: any) => {
        if (response) {
          this.AAList = response.data || [];
          this.totalRecord = response.totalCount;
          this.isPageChanged = false;
          this.isInitiateRequestCount = response.initiateCount > 0 ? response.initiateCount : 0;
        }
      },
      (error: any) => {
        console.error(error);
      }
    );
  }
}
