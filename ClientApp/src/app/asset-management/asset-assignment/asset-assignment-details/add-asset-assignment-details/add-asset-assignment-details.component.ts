import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { take } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router'; 
import { Console } from 'console';
import { ToastService } from 'src/app/common/toast/toast.service';
import {AssetManagementService} from  'src/app/asset-management/asset-management.service';

interface SoftwareRequestBody {
  Id?: number | null; 
  caption: string | null;
  vendor: string | null;
  name: string | null;
  version: string | null;
  identifyingNumber: string | null;
  device_Name: string | null;
  obtainedfrom: string | null;
  kind: string | null;
  signedby: string | null;
  location: string | null;
  OSType: string | null;
}
interface HardwareRequestBody {
  Id?: number | null; 
  component: string | null;
  name: string | null;
  detail1: string | null;
  detail2: string | null;
  deviceName: string | null;
}
@Component({
  selector: 'app-add-asset-assignment-details',
  templateUrl: './add-asset-assignment-details.component.html',
  styleUrls: ['./add-asset-assignment-details.component.scss']
})
export class AddAssetAssignmentDetailsComponent implements OnInit {
  softwareForm: FormGroup;
  hardwareForm: FormGroup;
  assetId: string | null = null;
  isAddMode: any;
  requestBody: any;
  softwareType: string | null = null;
  OSType: string | null = null;
  deviceName: string | null = null;

  constructor(
    private fb: FormBuilder,
    private assetManagementService: AssetManagementService, 
    private router: Router,
    private datepipe: DatePipe,
    private route: ActivatedRoute, 
    private toastService: ToastService,
  ) { }

  ngOnInit(): void {
    this.softwareForm = this.fb.group({
      caption: [''],
      vendor: [''],
      name: [''],
      version: [''],
      identifyingNumber: [''],
      device_Name: [''],
      obtainedfrom: [''],
      kind: [''],
      signedby: [''],
      location: ['']
    });
    this.hardwareForm = this.fb.group({
      component: [''],
      name: [''],
      detail1: [''],
      detail2: [''],
      deviceName: ['']
    });
    this.route.queryParams.subscribe(params => {
      this.isAddMode = params['isAdd'] === 'true';
      this.assetId = params['id'] || null;
      this.softwareType = params['SoftwareType'] || null;
      console.log('Is Add Mode:', this.isAddMode);
      console.log(this.softwareType);
      const deviceName = params['Device_Name'] || '';
      this.deviceName = params['Device_Name'] || '';
      if (this.deviceName) {
        this.softwareForm.patchValue({ device_Name: this.deviceName });
        this.hardwareForm.patchValue({ deviceName: this.deviceName });
        console.log('Device name',deviceName)
      }
      
       this.OSType = params['OSType'] || '';
      if (this.isAddMode) {
        if(this.softwareType === 'SoftwareType'){
          console.log(this.softwareType)
          this.softwareInitialization();
          
        }
        else {
          this.hardwareInitialization();
          if (this.deviceName) {
            this.hardwareForm.patchValue({ deviceName: this.deviceName });
            console.log('Device name',deviceName)
          }
        }
      } else if (!this.isAddMode && this.assetId) {
        console.log('edit')
        console.log('edit',this.softwareType)
        if(this.softwareType === 'Software'){
          this.loadSoftwareDetails(this.assetId);
          console.log('loadSoftwareDetails',this.assetId)
        }
        else {
          this.loadHardwareDetails(this.assetId);
          console.log('loadHardwareDetails',this.assetId)
        }
      }
    });
  }
  loadSoftwareDetails(id: string): void {
    debugger;
    const parsedId = parseInt(id, 10); 
  if (isNaN(parsedId)) {
    console.error('Invalid ID');
    return;
  }
  const requestBody = { id: parsedId };  
  console.log(id)
    this.assetManagementService.getSoftwareById(requestBody).subscribe(
      data => {
        console.log('Received data:', data);
        this.softwareInitialization(data);  
      },
      error => {
        console.error('Error fetching asset data', error);
      }
    );
  }
  loadHardwareDetails(id: string): void {
    debugger;
    const parsedId = parseInt(id, 10); 
  if (isNaN(parsedId)) {
    console.error('Invalid ID');
    return;
  }
  const requestBody = { id: parsedId };  
  console.log(id)
    this.assetManagementService.getHardwareById(requestBody).subscribe(
      data => {
        console.log('Received data:', data);
        this.hardwareInitialization(data);  
      },
      error => {
        console.error('Error fetching asset data', error);
      }
    );
  }
  
  softwareInitialization(data?: any): void {
    const assetDetails = data.softwareDetail || {}; 

    this.softwareForm = this.fb.group({
        id: [assetDetails.id || null],
        caption: [assetDetails.caption || null],
        vendor: [assetDetails.vendor || null],
        name: [assetDetails.name || null],
        version: [assetDetails.version || null],
        identifyingNumber: [assetDetails.identifyingNumber || null],
        device_Name: [assetDetails.device_Name || null],
        obtainedfrom: [assetDetails.obtainedfrom || null],
        kind: [assetDetails.kind || null],
        signedby: [assetDetails.signedby || null],
        location: [assetDetails.location || null],
        OSType: [assetDetails.osType || null]  
    });

    console.log('Form initialized with:', this.softwareForm.value);
}
  hardwareInitialization(data?: any): void {
    const assetDetail = data.hardwareDetail || {}; 
    
    this.hardwareForm = this.fb.group({
      component: [assetDetail.component || null],
      name: [assetDetail.name || null],
      detail1: [assetDetail.detail1 || null],
      detail2: [assetDetail.detail2 || null],
      deviceName: [assetDetail.deviceName || null] 
    });
  }
  
  onSaveSoftwareDetails(): void {
    debugger;
    if (this.softwareForm.invalid) {
      this.softwareForm.markAllAsTouched(); 
      return;
    }
    if (this.softwareForm.valid) {
      const formValues = this.softwareForm.value;
      const requestBody: SoftwareRequestBody = {
        Id: parseInt(this.assetId, 10) || 0,
        caption: formValues.caption || null,
        vendor: formValues.vendor || null,
        name: formValues.name || null,
        version: formValues.version || null,
        identifyingNumber: formValues.identifyingNumber || null,
        device_Name: formValues.device_Name || null,
        obtainedfrom: formValues.obtainedfrom || null,
        kind: formValues.kind || null,
        signedby: formValues.signedby || null,
        location: formValues.location || null,
        OSType: this.OSType || null || null
      };
  
      console.log('Processed Form Data:', requestBody);
      this.assetManagementService.SaveSoftwareDetails(requestBody)
        .subscribe(
          (response: any) => { 
            this.toastService.showSuccess(this.assetId ? 'Assett Updated' : 'Asset Saved successfully', 'Success');
            console.log(response);
            this.softwareForm.reset();
            this.router.navigate(['/asset-assignment-details'], { queryParams: { deviceName: this.deviceName } });
            
          },
          error => {
            console.error('Error saving asset', error);
          }
        );
    } else {
      (error: any) => {
        this.toastService.showError(error, 'Error');
      }
    }
  }

  onSaveHardwareDetails(): void {
    debugger;
    if (this.hardwareForm.invalid) {
      this.hardwareForm.markAllAsTouched(); 
      return;
    }
    
    if (this.hardwareForm.valid) {
      const formValues = this.hardwareForm.value;
      const requestBody: HardwareRequestBody = {
        Id: parseInt(this.assetId, 10) || 0,
        component: formValues.component || null,
        name: formValues.name || null,
        detail1: formValues.detail1 || null,
        detail2: formValues.detail2 || null,
        deviceName: formValues.deviceName || null 
      };
      console.log('Hardware form deviceName:', this.hardwareForm.get('deviceName').value);
      console.log('Processed Form Data:', requestBody);
      this.assetManagementService.SaveHardwareDetails(requestBody)
        .subscribe(
          (response: any) => { 
            this.toastService.showSuccess(this.assetId ? 'Assett Updated' : 'Asset Saved successfully', 'Success');
            console.log(response);
            this.hardwareForm.reset();
            this.router.navigate(['/asset-assignment-details'], { queryParams: { deviceName: this.deviceName } });
            
          },
          error => {
            console.error('Error saving asset', error);
          }
        );
    } else {
      (error: any) => {
        this.toastService.showError(error, 'Error');
      }
    }
  }
}
