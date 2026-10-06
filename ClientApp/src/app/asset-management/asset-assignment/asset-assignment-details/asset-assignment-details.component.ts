import { Component, OnInit } from '@angular/core';
import { settings } from 'src/app/common/configuration.settings';
import {AssetManagementService} from 'src/app/asset-management/asset-management.service';
import { ActivatedRoute } from '@angular/router'; 
import { combineLatest } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { FormGroup, FormBuilder } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-asset-assignment-details',
  templateUrl: './asset-assignment-details.component.html',
  styleUrls: ['./asset-assignment-details.component.scss']
})
export class AssetAssignmentDetailsComponent implements OnInit {
  selectedView: string = 'software'; 
  limit: number = 8;
  offset: any = settings.offset;
  page: any = 1;
  isPageChanged: any;
  requestBody: any;
  SoftList: any;
  totalRecord: any;
  isInitiateRequestCount: any;
  assetId: any;
  id: any;
  hardList:any;
  totalRecords:any;
  deviceName: any;
  form: FormGroup;
  searchTerm: any;
  selectedType: string = '';  
  searchControl = new FormControl();
  filterArray: any[] = [];
  type: any;
  OSType: string;
  Device_Name: any;

  selectView(view: string) {
    this.selectedView = view;
  }

  constructor(
    private assetManagementService: AssetManagementService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.deviceName = params['deviceName'] || null;
        this.configureRequested();
        this.configureRequest();
        this.setupValueChanges(); 
    });
  }
  onAdd(SoftwareType: string): void {
    this.router.navigate(['add-asset-assignment-details'], { 
        queryParams: { 
            isAdd: true, 
            SoftwareType: SoftwareType, 
            OSType: this.OSType, 
            Device_Name: this.Device_Name
        } 
    });
}
editsoftware(id: string, SoftwareType: string): void {
  this.router.navigate(['add-asset-assignment-details'], { 
    queryParams: { 
      isAdd: false, 
      id: id, 
      SoftwareType: SoftwareType, 
      OSType: this.OSType, 
      Device_Name: this.Device_Name 
    } 
  });
}
edithardware(id: string, SoftwareType: string): void {
  this.router.navigate(['add-asset-assignment-details'], { 
    queryParams: { 
      isAdd: false, 
      id: id, 
      SoftwareType: SoftwareType, 
      Device_Name: this.Device_Name 
    } 
  });
}
  setupValueChanges(): void {
    combineLatest([
      this.form.get('searchControl')?.valueChanges.pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
    ]).subscribe(([searchTerm]) => {
      this.searchTerm = searchTerm;
      this.onSearch();
    });
  }
  onSearch(): void {
    this.page = this.isPageChanged ? this.offset : 1; 
    if(this.selectedView === 'software'){
    this.SearchAMDetails(); 
    }
    else{
      this.SearchHardDetails(); 
    } 
  }

  SearchAMDetails(): void {
    debugger;
    this.requestBody = {
      "PageNumber": this.page,
      "PageSize": this.limit,
      "Name": this.searchTerm,
      "Type": this.deviceName
    };
    this.assetManagementService.SearchSoftwareDetails(this.requestBody).subscribe(
      (response: any) => {
        if (response) {
            this.SoftList = response.data || [];
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
  SearchHardDetails(): void {
    debugger;
    this.requestBody = {
      "PageNumber": this.page,
      "PageSize": this.limit,
      "Name": this.searchTerm,
      "Type": this.deviceName
    };
    this.assetManagementService.SearchHardwareDetails(this.requestBody).subscribe(
      (response: any) => {
        if (response) {
            this.hardList = response.data || [];
            this.totalRecords = response.totalCount;
          
          this.isPageChanged = false;
          this.isInitiateRequestCount = response.initiateCount > 0 ? response.initiateCount : 0;
        }
      },
      (error: any) => {
        console.error(error);
      }
    );
  }
  onTableDataChange(event: any): void {
    this.offset = !isNaN(event) && event > 0 ? event : 1;
    this.page = this.offset;
    this.isPageChanged = this.page !== 1;
    if (this.searchTerm) {
      if(this.selectedView === 'software'){
        this.SearchAMDetails(); 
        }
        else{
          this.SearchHardDetails(); 
        }  
    } else {
      this.configureRequest(); 
    }
    
  }
  configureRequest(field?: string, direction?: string, value?: any): void {
    debugger;
    this.requestBody = {
      "PageNumber": this.isPageChanged ? this.offset : 1,
      "PageSize": this.limit,
      "deviceName":this.deviceName
    };
    this.page = this.requestBody.PageNumber;
    this.offset = this.requestBody.PageNumber;
    this.id = this.requestBody.Id;
    this.getsoftwareDetails();
    this.getHardwareDetails();
  }
  configureRequested(field?: string, direction?: string, value?: any): void {
    debugger;
    this.requestBody = {
      "PageNumber": this.isPageChanged ? this.offset : 1,
      "PageSize": this.limit,
      "deviceName":this.deviceName
    };
    this.page = this.requestBody.PageNumber;
    this.offset = this.requestBody.PageNumber;
    this.id = this.requestBody.Id;
    this.getsoftwareDetails();
    this.getHardwareDetails();
  }
  getsoftwareDetails(): void {
    console.log(this.requestBody);
    this.assetManagementService.getSoftwareDetails(this.requestBody).subscribe(
      (response: any) => {
        if (response) {
          this.SoftList = response.data || [];
          console.log('SoftList:', this.SoftList);
          if (this.SoftList && this.SoftList.length > 0) {
            console.log('First item in SoftList:', this.SoftList[0]);
            if (this.SoftList[0].osType) {  
              this.OSType = this.SoftList[0].osType;
              console.log('OSType:', this.OSType);
            } else {
              console.warn('osType is missing in the first item of SoftList');
            }
            if (this.SoftList[0].device_Name) {  
              this.Device_Name = this.SoftList[0].device_Name;
              console.log('device_Name:', this.Device_Name);
            } else {
              console.warn('device_Name is missing in the first item of SoftList');
            }
          }
  
          this.totalRecord = response.totalCount;
          this.isPageChanged = false;
          this.isInitiateRequestCount = response.initiateCount > 0 ? response.initiateCount : 0;
        }
      },
      (error: any) => {
        console.error('API Error:', error);
      }
    );
  }  
  getHardwareDetails(): void {
    debugger
    console.log(this.requestBody)
    this.assetManagementService.getHardwareDetails(this.requestBody).subscribe(
      (response: any) => {
        if (response) {
          this.hardList = response.data || [];
          this.totalRecords = response.totalCount; 
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
