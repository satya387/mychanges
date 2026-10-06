import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {AssetManagementService} from '../asset-management.service';
import { DatePipe } from '@angular/common';
import { take } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router'; 
import { Console } from 'console';
import { ToastService } from 'src/app/common/toast/toast.service';

interface AssetRequestBody {
  Id?: number | null; 
  assetNumber: string | null;
  assetName: string | null;
  assetType: string | null;
  assetCategory: string | null;
  assetSubCategory: string | null;
  assetLocation: string | null;
  assetStatus: string | null;
  description: string | null;
  manufacturer: string | null;
  modelNumber: string | null;
  serialNumber: string | null;
  modelDetails: string | null;
  ownerName: string | null;
  ownerEmail: string | null;
  assetTag: string | null;
  macAddress: string | null;
  ipAddress: string | null;
  softwareName: string | null;
  osName: string | null;
  softwareDetails: string | null;
  softwareVersion: string | null;
  licenseType: string | null;
  licenseKey: string | null;
  licenseCount: number | null;
  purchaseDate: string | null;
  purchaseCost: string | null;
  installationDate: string | null;
  expirationDate: string | null;
  depreciationDetails: string | null;
  warrantyInformation: string | null;
  retirementDisposalInformation: string | null;
  vendorName: string | null;
  vendorAddress: string | null;
  vendorEmailAddress: string | null;
  vendorPhoneNumber: string | null;
  comments: string | null;
}
@Component({
  selector: 'app-add-assest-management',
  templateUrl: './add-assest-management.component.html',
  styleUrls: ['./add-assest-management.component.scss']
})

export class AddAssestManagementComponent implements OnInit {
  isSaveButtonDisabled = false;
  serverErrorMessage: string | null = null;
  assetForm: FormGroup;
  assetId: string | null = null;
  isAddMode: boolean;
  requestBody: any;

  constructor(
    private fb: FormBuilder,
    private assetManagementService: AssetManagementService, 
    private router: Router,
    private datepipe: DatePipe,
    private route: ActivatedRoute, 
    private toastService: ToastService,
  ) {
    
  }

  ngOnInit(): void {
    this.assetForm = this.fb.group({
      assetNumber: [''],
      assetName: [''],
      assetType: [''],
      assetCategory: [''],
      assetSubCategory: [''],
      assetLocation: [''],
      assetStatus: [''],
      description: [''],
      manufacturer: [''],
      modelNumber: [''],
      serialNumber: [''],
      modelDetails: [''],
      ownerName: [''],
      ownerEmail: ['', [Validators.email]],
      assetTag: [''],
      macAddress: [''],
      ipAddress: [''],
      softwareName: [''],
      osName: [''],
      softwareDetails: [''],
      softwareVersion: [''],
      licenseType: [''],
      licenseKey: [''],
      licenseCount: [''],
      purchaseDate: [''],
      purchaseCost: [''],
      installationDate: [''],
      expirationDate: [''],
      depreciationDetails: [''],
      warrantyInformation: [''],
      retirementDisposalInformation: [''],
      vendorName: [''],
      vendorAddress: [''],
      vendorEmailAddress: [''],
      vendorPhoneNumber: [''],
      comments: ['']
    });
    this.route.queryParams.subscribe(params => {
      this.isAddMode = params['isAdd'] === 'true';
      this.assetId = params['id'] || null;
  
      console.log('Is Add Mode:', this.isAddMode);
      console.log('Asset ID:', this.assetId);
  
      if (this.isAddMode) {
        this.formInitialization();
        this.assetForm.get('assetStatus')?.clearValidators(); 
        this.assetForm.get('assetStatus')?.updateValueAndValidity();
      } else if (!this.isAddMode && this.assetId) {
        this.loadAssetDetails(this.assetId);
        this.assetForm.get('assetStatus')?.setValidators([Validators.required]);
        this.assetForm.get('assetStatus')?.updateValueAndValidity();
      }
  
      console.log('Asset Form:', this.assetForm);
    });
  }
  
  loadAssetDetails(id: string): void {
    debugger;
    const parsedId = parseInt(id, 10); 
  if (isNaN(parsedId)) {
    console.error('Invalid ID');
    return;
  }
  const requestBody = { id: parsedId };  
    this.assetManagementService.getAssetById(requestBody).subscribe(
      data => {
        console.log('Received data:', data);
        this.formInitialization(data);  
      },
      error => {
        console.error('Error fetching asset data', error);
      }
    );
  }
  
  formInitialization(data?: any): void {
    const assetDetails = data?.amDetails || {}; 
    
    this.assetForm = this.fb.group({
      assetNumber: [assetDetails.assetNumber || null, [Validators.required, Validators.pattern(/\S+/), Validators.maxLength(30)]],
      assetName: [assetDetails.assetName || null, [Validators.required, Validators.pattern(/\S+/), Validators.maxLength(40)]],
      assetType: [assetDetails.assetType || null, [Validators.required, Validators.pattern(/\S+/), Validators.maxLength(40)]],
      assetCategory: [assetDetails.assetCategory || null, [Validators.required, Validators.pattern(/\S+/), Validators.maxLength(40)]],
      assetSubCategory: [assetDetails.assetSubCategory || null, [Validators.required, Validators.pattern(/\S+/), Validators.maxLength(40)]],
      assetLocation: [assetDetails.assetLocation || null, [Validators.required, Validators.pattern(/\S+/)]],
      assetStatus: [assetDetails.assetStatus || null, [Validators.required, Validators.pattern(/\S+/)]],
      description: [assetDetails.description || null, [Validators.required, Validators.pattern(/\S+/)]],
      manufacturer: [assetDetails.manufacturer || null],
      modelNumber: [assetDetails.modelNumber || null],
      serialNumber: [assetDetails.serialNumber || null],
      modelDetails: [assetDetails.modelDetails || null],
      ownerName: [assetDetails.ownerName || null, [Validators.required, Validators.pattern(/\S+/), Validators.maxLength(30)]],
      ownerEmail: [assetDetails.ownerEmail || null, [Validators.required, Validators.pattern(/\S+/)]],
      assetTag: [assetDetails.assetTag || null, [Validators.required, Validators.pattern(/\S+/)]],
      macAddress: [assetDetails.macAddress || null],
      ipAddress: [assetDetails.ipAddress || null],
      softwareName: [assetDetails.softwareName || null],
      osName: [assetDetails.osName || null],
      softwareDetails: [assetDetails.softwareDetails || null],
      softwareVersion: [assetDetails.softwareVersion || null],
      licenseType: [assetDetails.licenseType || null],
      licenseKey: [assetDetails.licenseKey || null],
      licenseCount: [assetDetails.licenseCount || null],
      purchaseDate: [assetDetails.purchaseDate ? this.datepipe.transform(assetDetails.purchaseDate, 'MM/dd/yyyy') : null],
      purchaseCost: [assetDetails.purchaseCost || null],
      installationDate: [assetDetails.installationDate ? this.datepipe.transform(assetDetails.installationDate, 'MM/dd/yyyy') : null],
      expirationDate: [assetDetails.expirationDate ? this.datepipe.transform(assetDetails.expirationDate, 'MM/dd/yyyy') : null],
      depreciationDetails: [assetDetails.depreciationDetails || null],
      warrantyInformation: [assetDetails.warrantyInformation || null],
      retirementDisposalInformation: [assetDetails.retirementDisposalInformation || null],
      vendorName: [assetDetails.vendorName || null, [Validators.required, Validators.pattern(/\S+/)]],
      vendorAddress: [assetDetails.vendorAddress || null, [Validators.required, Validators.pattern(/\S+/)]],
      vendorEmailAddress: [assetDetails.vendorEmailAddress || null, [Validators.required, Validators.pattern(/\S+/)]],
      vendorPhoneNumber: [assetDetails.vendorPhoneNumber || null, [Validators.required, Validators.pattern(/\S+/)]],
      comments: [assetDetails.comments || null]
    });
  }
  
  
  
  onSave(): void {
    debugger;
    if (this.assetForm.invalid) {
      this.assetForm.markAllAsTouched(); 
      return;
    }
    if (this.assetForm.valid) {
      const formValues = this.assetForm.value;
      const requestBody: AssetRequestBody = {
        Id: parseInt(this.assetId, 10) || 0,
        assetNumber: formValues.assetNumber || null,
        assetName: formValues.assetName || null,
        assetType: formValues.assetType || null,
        assetCategory: formValues.assetCategory || null,
        assetSubCategory: formValues.assetSubCategory || null,
        assetLocation: formValues.assetLocation || null,
        assetStatus: formValues.assetStatus || null,
        description: formValues.description || null,
        manufacturer: formValues.manufacturer || null,
        modelNumber: formValues.modelNumber || null,
        serialNumber: formValues.serialNumber || null,
        modelDetails: formValues.modelDetails || null,
        ownerName: formValues.ownerName || null,
        ownerEmail: formValues.ownerEmail || null,
        assetTag: formValues.assetTag || null,
        macAddress: formValues.macAddress || null,
        ipAddress: formValues.ipAddress || null,
        softwareName: formValues.softwareName || null,
        osName: formValues.osName || null,
        softwareDetails: formValues.softwareDetails || null,
        softwareVersion: formValues.softwareVersion || null,
        licenseType: formValues.licenseType || null,
        licenseKey: formValues.licenseKey || null,
        licenseCount: parseInt(formValues.licenseCount, 10) || 0,  
        purchaseDate: formValues.purchaseDate ? new Date(formValues.purchaseDate).toISOString() : null,
        purchaseCost: formValues.purchaseCost || null,
        installationDate: formValues.installationDate ? new Date(formValues.installationDate).toISOString() : null,
        expirationDate: formValues.expirationDate ? new Date(formValues.expirationDate).toISOString() : null,
        depreciationDetails: formValues.depreciationDetails || null,
        warrantyInformation: formValues.warrantyInformation || null,
        retirementDisposalInformation: formValues.retirementDisposalInformation || null,
        vendorName: formValues.vendorName || null,
        vendorAddress: formValues.vendorAddress || null,
        vendorEmailAddress: formValues.vendorEmailAddress || null,
        vendorPhoneNumber: formValues.vendorPhoneNumber || null,
        comments: formValues.comments || null,
      };
  
      console.log('Processed Form Data:', requestBody);
      this.assetManagementService.saveAssetManagement(requestBody)
        .subscribe(
          (response: any) => {
            if (response.isError === true) {
              console.log('Setting error message:', response.message); 
              this.toastService.showError(response.message, 'Error'); 
              this.isSaveButtonDisabled = true; 
              this.serverErrorMessage = response.message; 
            } else {
            this.toastService.showSuccess(this.assetId ? 'Assett Updated' : 'Asset Saved successfully', 'Success');
            console.log(requestBody);
            this.assetForm.reset();
            this.serverErrorMessage = null; 
            console.log('Asset saved successfully', response);
            this.router.navigate(['/asset-management']); 
            }
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
