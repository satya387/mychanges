import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AssetManagementService } from './asset-management.service';
import { ToastService } from '../common/toast/toast.service';
import { settings } from '../common/configuration.settings';
import { FormGroup, FormBuilder } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-asset-management',
  templateUrl: './asset-management.component.html',
  styleUrls: ['./asset-management.component.scss']
})
export class AssetManagementComponent implements OnInit {
  PRList: any;
  totalRecord: number = 0; 
  limit: number = 8;
  offset: any = settings.offset;
  page: any = 1;
  isPageChanged: any;
  searchTerm: string = '';
  filterType: string = '';
  AMList: any[] = [];
  isInitiateRequestCount: number = 0;
  filterArray: any[] = [];
  requestBody: any;
  searchControl = new FormControl();
  TypeList: any[] = [];
  selectedType: string = '';  
  form: FormGroup;
  

  constructor(
    private assetManagementService: AssetManagementService,
    private router: Router,
    private toastService: ToastService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.configureRequest();
    this.fetchAssetTypes();
    this.setupValueChanges();
  }

  navigateTo(data?) {
    if (data) {
      this.router.navigate(['/asset-management/add-assest-management'], { queryParams: { isAdd: false, id: data.id } });
    } else {
      this.router.navigate(['/asset-management/add-assest-management'], { queryParams: { isAdd: true } });
    }
  }
  
  onAdd(): void {
    this.router.navigate(['/asset-management/add-assest-management'], { queryParams: { isAdd: true } });
  }
  
  editAsset(assetId: string): void {
    this.router.navigate(['/asset-management/add-assest-management'], { queryParams: { isAdd: false, id: assetId } });
  }

  onTableDataChange(event: any): void {
    this.offset = !isNaN(event) && event > 0 ? event : 1;
    this.page = this.offset;
    this.isPageChanged = this.page !== 1;
    this.configureRequest();
  }
  
  configureRequest(field?: string, direction?: string, value?: any): void {
    this.requestBody = {
      "PageNumber": this.isPageChanged ? this.offset : 1,
      "PageSize": this.limit,
    };
    this.page = this.requestBody.PageNumber;
    this.offset = this.requestBody.PageNumber;
    this.getAMDetails();
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
      this.searchTerm = searchTerm;
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
    this.assetManagementService.SearchAssetManagement(this.requestBody).subscribe(
      (response: any) => {
        if (response) {
          this.AMList = response.data || [];
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
  getAMDetails(): void {
    this.assetManagementService.getAssetManagement(this.requestBody).subscribe(
      (response: any) => {
        if (response) {
          this.AMList = response.data || [];
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

  fetchAssetTypes(): void {
    this.assetManagementService.fetchAssetType().subscribe(
      (response: any) => {
        if (response && response.length > 0) {
          this.TypeList = this.removeDuplicateValues(response);
          console.log(this.TypeList )
          console.log('Data received:', this.TypeList);
        } else {
          console.log('No data received from fetchAssetType');
        }
      },
      (error: any) => {
        console.error('Error fetching asset types:', error);
      }
    );
  }
  
  removeDuplicateValues(data: any[]): any[] {
    const seen = new Set();
    const uniqueValues = data.filter(item => {
      const lowerCaseValue = item.value.toLowerCase();
      if (!seen.has(lowerCaseValue)) {
        seen.add(lowerCaseValue);
        return true;
      }
      return false;
    });
    return uniqueValues;
  }
 
}
