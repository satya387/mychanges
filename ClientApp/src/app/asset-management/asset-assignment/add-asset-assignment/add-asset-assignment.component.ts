import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl  } from '@angular/forms';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { take } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router'; 
import { Console } from 'console';
import { ToastService } from 'src/app/common/toast/toast.service';
import {AssetManagementService} from  'src/app/asset-management/asset-management.service';
import { distinctUntilChanged,debounceTime, switchMap, catchError, map, finalize } from 'rxjs/operators';
import { Subject,of, Observable } from 'rxjs';
import { ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { NgSelectModule } from '@ng-select/ng-select';

interface AssetRequestBody {
  Id?: number | null; 
  assetNumber: string | null;
  employeeId: string | null;
  deviceType: string | null;
  employeeName: string | null;
  deviceName: string | null;
  status: string | null;
  assignedDate: string | null;
  returnDate: string | null;
  comments: string | null;
  assetStatus: string | null;
  assetName: string | null;
}

 
@Component({
  selector: 'app-add-asset-assignment',
  templateUrl: './add-asset-assignment.component.html',
  styleUrls: ['./add-asset-assignment.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddAssetAssignmentComponent implements OnInit {
  isSaveButtonDisabled = false; 
  serverErrorMessage: string | null = null;
  employeeNameControl = new FormControl(); 
  assetForm: FormGroup;
  assetId: string | null = null;
  isAddMode: boolean;
  requestBody: any;
  DeviceList: any;
  TypeList: any
  ANList: any;
  list: any;
  isLoading: boolean = false; 
  employeeList: { id: string; value: string }[] = [];
  selectedEmployee: any;
  message: any;
  error: any;
  ANameList:any;
  initialAssetName: string = '';
  initialAssetNumber: string = '';
  initialDeviceType: string = '';
  IniatialStatus: string = '';
 
  constructor(
    private fb: FormBuilder,
    private assetManagementService: AssetManagementService, 
    private router: Router,
    private datepipe: DatePipe,
    private route: ActivatedRoute, 
    private toastService: ToastService,
    private cd: ChangeDetectorRef,
  ) {
    this.employeeNameControl = new FormControl('', [Validators.required, Validators.pattern(/\S+/)]); 
    this.assetForm = this.fb.group({
      assetNumber: ['',[Validators.required]],
      employeeId: ['',[Validators.required]],
      deviceType: ['',[Validators.required]],
      employeeName: this.employeeNameControl,
      deviceName: ['',[Validators.required,, Validators.maxLength(30)]],
      status: ['',],
      assignedDate: ['',[Validators.required]],
      returnDate: [''],
      comments: [''],
      assetStatus: [''],
      assetName: ['',[Validators.required]]
    });
  }

  ngOnInit(): void {
    this.setupEmployeeSearch();
    this.route.queryParams.subscribe(params => {
      this.isAddMode = params['isAdd'] === 'true';
      this.assetId = params['id'] || null;

      if (this.isAddMode) {
        this.formInitialization();  
        this.fetchDeviceTypes();     
        this.assetForm.get('status')?.clearValidators(); 
        this.assetForm.get('status')?.updateValueAndValidity();
      } else if (!this.isAddMode && this.assetId) {
        this.loadAssetDetails(this.assetId).subscribe(() => {
          this.fetchDeviceTypes();  
          this.assetForm.get('status')?.setValidators([Validators.required]);
          this.assetForm.get('status')?.updateValueAndValidity();
          if (this.IniatialStatus === 'Returned' || this.IniatialStatus === 'Inuse' ) {
            this.assetForm.get('deviceType').disable();
            this.assetForm.get('assetName').disable();
            this.assetForm.get('assetNumber').disable();
            this.assetForm.get('employeeName').disable();
          } else {
            this.assetForm.get('deviceType').enable();
            this.assetForm.get('assetName').enable();
            this.assetForm.get('assetNumber').enable();
            this.assetForm.get('employeeName').enable();
          }
        });
      }
     
    });
    this.assetForm.get('deviceName')?.valueChanges.subscribe(() => {
      this.serverErrorMessage = null;
      this.cd.detectChanges(); // Trigger change detection if necessary
    });
  }
  
  setupEmployeeSearch(): void {
    this.employeeNameControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(value => {
        this.isLoading = true;
        return this.searchEmployees(value);
      })
    ).subscribe(employees => {
      this.employeeList = employees;
      this.isLoading = false;
      this.cd.markForCheck();
    });
  }
  
  searchEmployees(searchTerm: string): Observable<{ id: string; value: string }[]> {
    if (typeof searchTerm !== 'string' || searchTerm.trim() === '') {
      return of([]); 
    }
    
    return this.assetManagementService.getEmployeeNameById(searchTerm).pipe(
      map(response => response), 
      catchError(err => {
        console.error('Error fetching employees:', err);
        return of([]); 
      })
    );
  }
  
  onEmployeeSelect(employee: { id: string; value: string }): void {
    debugger
    if (employee) {
      this.assetForm.patchValue({
        employeeId: employee.id,
        employeeName: employee.value
      });
    }
    this.cd.markForCheck();
  }
  
  onFocus(): void {
  
  }

  fetchEmployeeId(employeeName: string): void {
    this.assetManagementService.getEmployeeId(employeeName).subscribe(
      (response: { value: string }) => {
        if (response && response.value) {
          this.assetForm.patchValue({
            employeeId: response.value, 
            employeeName: employeeName
          });
          this.cd.markForCheck(); 
        } else {
          console.error('No employee ID found for the selected name');
        }
      },
      error => {
        console.error('Error fetching employee ID', error);
      }
    );
  }

handleStatusChange(event: Event): void {
  const selectedStatus = (event.target as HTMLSelectElement).value;
  if (selectedStatus === 'Returned') {
      this.assetForm.get('returnDate')?.setValidators([Validators.required]);
      this.assetForm.get('assetStatus')?.setValidators([Validators.required]);
  } else {
      this.assetForm.get('returnDate')?.clearValidators();
      this.assetForm.get('assetStatus')?.clearValidators();
  }
  this.assetForm.get('returnDate')?.updateValueAndValidity();
  this.assetForm.get('assetStatus')?.updateValueAndValidity();
}
formInitialization(): void {
  this.assetForm.reset();
}

onSave(): void {
  debugger;
  const formValues = this.assetForm.value;
  console.log('request',formValues)
  const requestBody: AssetRequestBody = {
    Id: parseInt(this.assetId, 10) || 0,
    assetNumber: formValues.assetNumber || null,
    employeeId: formValues.employeeId,
    deviceType: formValues.deviceType || null,
    employeeName: formValues.employeeName || null,
    deviceName: formValues.deviceName || null,
    status: formValues.status || null,
    assignedDate: formValues.assignedDate ? new Date(formValues.assignedDate).toISOString() : null,
    returnDate: formValues.returnDate ? new Date(formValues.returnDate).toISOString() : null,
    comments: formValues.comments || null,
    assetStatus: formValues.assetStatus || null,
    assetName: formValues.assetName || null
  };
   console.log('request',requestBody)
  this.assetManagementService.saveAssetAssginment(requestBody).subscribe(
    (response: any) => {
      console.log('Server response:', response);
      if (response.isError !== true) {
        console.log('Assignment Updated');
        this.toastService.clear(); 
        this.toastService.showSuccess(response.message, 'Success');
        this.assetForm.reset();
        this.isSaveButtonDisabled = false;  
        this.serverErrorMessage = null; 
        this.router.navigate(['/asset-assignment']).then(() => {
          this.serverErrorMessage = null;
        });  
      } else {      
        console.log('Setting error message:', response.message); 
        this.isSaveButtonDisabled = true; 
        this.serverErrorMessage = response.message;
        this.cd.detectChanges();  
         
      } 
    },
    error => {
      console.error('Error saving asset', error);
      this.isSaveButtonDisabled = true; 
      this.serverErrorMessage = 'An unexpected error occurred. Please try again.'; 
    }
  );
}

loadAssetDetails(id: string):Observable<void> {
  const parsedId = parseInt(id, 10);
  if (isNaN(parsedId)) {
    console.error('Invalid ID');
    return;
  }

  return this.assetManagementService.getAssginmentId({ id: parsedId }).pipe(
    map((response: any) => {
      if (response && response.aaDetails) {
        const data = response.aaDetails;
        console.log('Loaded Data:', data); 
        this.initialDeviceType = data.deviceType || '';
        this.assetForm.patchValue({
          deviceType: this.initialDeviceType || '',
          assetName: data.assetName || '',
          assetNumber: data.assetNumber || '',
          employeeId: data.employeeId || '',
          employeeName: data.employeeName || '',
          deviceName: data.deviceName || '',
          status: data.status || '',
          assignedDate: data.assignedDate ? this.datepipe.transform(data.assignedDate, 'MM/dd/yyyy') : null,
          returnDate: data.returnDate ? this.datepipe.transform(data.returnDate, 'MM/dd/yyyy') : null,
          comments: data.comments || '',
          assetStatus: data.assetStatus || ''
        });
        console.log(this.initialDeviceType)
        this.assetForm.patchValue({
          deviceType: this.initialDeviceType
        });
        this.IniatialStatus = data.status || '';
        this.initialAssetName = data.assetName || '';
        this.initialAssetNumber = data.assetNumber || '';
        if (data.deviceType) {
          this.getAssetName(data.deviceType);
        }

        if (data.assetName) {
          this.getAssetNumber(data.assetName);
        }
        this.cd.markForCheck(); 
      } else {
        console.error('No details found in the response');
      }
    },
    error => {
      console.error('Error fetching asset data', error);
    })
  );
}

fetchDeviceTypes(): any {
  debugger
   this.assetManagementService.fetchDeviceTypes().subscribe(
    (response: any) => {
      if (response && response.length > 0) {
        this.TypeList = this.removeDuplicateValues(response);
        const found = this.TypeList.find(item => item.value === this.initialDeviceType);
        if (!found && this.initialDeviceType) {
          this.TypeList.unshift({ value: this.initialDeviceType });
        }
        this.assetForm.patchValue({
          deviceType: this.initialDeviceType
        });
        console.log('Initial value',this.initialDeviceType)
      } else {
        this.TypeList = [{ value: this.initialDeviceType }];
        this.assetForm.patchValue({
          deviceType: this.initialDeviceType
        });
        console.log('Initial value',this.initialDeviceType)
      }
    }),
    catchError((error: any) => {
      console.error('Error fetching device types:', error);
      this.TypeList = [{ value: this.initialDeviceType }];
      this.assetForm.patchValue({
        deviceType: this.initialDeviceType
      });
      return of([]); 
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

onSelect(event: any): void {
  const deviceType = event.target.value;
  if (deviceType) {
    this.assetForm.patchValue({
      assetName: null  
    });
    this.getAssetName(deviceType);
  }
}

getAssetName(deviceType: string): void {
  debugger
  this.assetManagementService.getAssetName(deviceType).subscribe(
    (response: any) => {
      if (response && response.length > 0) {
        this.ANameList = this.removeDuplicateValues(response);
        if (this.initialAssetName) {
          const found = this.ANameList.find(item => item.value === this.initialAssetName);
          if (found) {
            this.assetForm.patchValue({
              assetName: found.value
            });
          }
        }
      } else {
        console.warn('No asset names found for this device type');
        this.ANameList = [{ value: this.initialAssetName }];
        this.assetForm.patchValue({
          assetName: this.initialAssetName
        });
      }
    },
    error => {
      console.error('Error fetching asset names', error);
      this.ANameList = [{ value: this.initialAssetName }];
      this.assetForm.patchValue({
        assetName: this.initialAssetName
      });
    }
  );
}
onSelec(event: any): void {
  const assetName = event.target.value;
  if (assetName) {
    this.assetForm.patchValue({
      assetNumber: null  
    });
    this.getAssetNumber(assetName);
  }
}
getAssetNumber(assetName: string): void {
  debugger
  this.assetManagementService.getAssetNumber(assetName).subscribe(
    (response: any) => {
      if (response && response.length > 0) {
        this.ANList = response;
        if (this.initialAssetNumber) {
          const found = this.ANList.find(item => item.value === this.initialAssetNumber);
          if (found) {
            this.assetForm.patchValue({
              assetNumber: found.value
            });
          }
        }
      } else {
        console.warn('No asset numbers found for this asset name');
        this.ANList = [{ value: this.initialAssetNumber }];
        this.assetForm.patchValue({
          assetNumber: this.initialAssetNumber
        });
      }
    },
    error => {
      console.error('Error fetching asset numbers', error);
      this.ANList = [{ value: this.initialAssetNumber }];
      this.assetForm.patchValue({
        assetNumber: this.initialAssetNumber
      });
    }
  );
}

}

