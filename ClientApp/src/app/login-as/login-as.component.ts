import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/common/toast/toast.service';
import { map, filter, forEach } from 'lodash';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../common/common.service';
import { HomeService } from '../home/home.service';
import { distinctUntilChanged,debounceTime, switchMap, catchError, finalize } from 'rxjs/operators';
import { Subject,of, Observable } from 'rxjs';
import { ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { LoginAsService } from './login-as.service';

//Component.ts
interface Employee {
  id: string;
  value: string;
  mail: string;
}
interface EmployeeResponse {
  value: string;
  mail: string;
}

@Component({
  selector: 'app-login-as',
  templateUrl: './login-as.component.html',
  styleUrls: ['./login-as.component.scss']
})
export class LoginAsComponent implements OnInit {
  title = 'View Tiles';  
  employeeID: string;
  empEmidsId: string;
  responseMessage: string;
  response: any;
  sectionList: any;
  activeSectionList: any;
  isPersonalizedSections: boolean;
  blob: any;
  Email: any;
  userInfo: any;
  profileImage: any;
  bannerList: any;
  public moduleSearchText: string ="";
  public showOnlyBookmark: boolean = false;
  public showBookmark: number = 0;
  isLoading:any;
  assetForm: FormGroup;
  employeeList: { id: string; value: string; mail: string; }[] = [];
  employeeNameControl = new FormControl(); 
  username: string;
  employeeName: string;

  constructor(
    private toastService: ToastService, 
    private loginAsService: LoginAsService,
    private homeService: HomeService,
    private commonService: CommonService, 
    private router: Router,
    private cd: ChangeDetectorRef,
    private fb: FormBuilder
  ) { 
    this.isPersonalizedSections = false;
    this.showOnlyBookmark = false;
    this.showBookmark = 0;
    this.moduleSearchText = "";
  }

  ngOnInit(): void {
    debugger;
    this.assetForm = this.fb.group({
      employeeId: [{value: '', disabled: true}],
      employeeName: ['', Validators.required],
      employeeEmail: ['', Validators.required]
    });

    this.setupEmployeeSearch();
    this.getloginemployee();
  }
  getloginemployee(){
    const UserDetail = sessionStorage.getItem('userDetail');
    const userDetails = JSON.parse(UserDetail); 
    console.log('UserInfo', userDetails); 
    this.username = userDetails.UserName;
  }
  getSectionListByUser() {
    debugger;
    //this.employeeID = 'INEMP5230';
    this.employeeID = this.assetForm.get('employeeId').value;
    this.employeeName = this.assetForm.get('employeeName').value;
    console.log("employeename",this.employeeName)
    // const userData = JSON.parse(sessionStorage.getItem('userDetail'));
    // this.employeeID = userData.EmployeeId; //'INEMP019';
    this.loginAsService.homeSectionList(this.employeeID).subscribe((response: any) => {
      if (response) {
        this.sectionList = response;
        this.activeSectionList = filter(this.sectionList, { 'isActive': true });
        //this.clearSessionAndGetToken()
      }
    }, (error: any) => {
      this.toastService.showError(error, 'Error');
    })
    this.saveLoginDetails({ employeeName: this.employeeName, username: this.username})
  }
  saveLoginDetails(data: { employeeName: string; username: string }) { 
    debugger; 
    this.loginAsService.saveLoginDetails(data).subscribe( (response: any) => { if (response) { this.responseMessage = 'Login details saved successfully!'; this.toastService.showSuccess(this.responseMessage, 'Success'); } }, (error: any) => { this.toastService.showError(error, 'Error'); } ); }
  clearSessionAndGetToken() {
    sessionStorage.removeItem('customToken');
    sessionStorage.removeItem('profileImage');
    sessionStorage.removeItem('userDetail');
    this.getToken();
  }
  getToken() {
    this.userInfo = { Email: this.assetForm.get('employeeEmail').value };
    console.log("user", this.userInfo)
    this.commonService.getCustomToken(this.userInfo).subscribe((response: any) => {
      if (response) {
        const userDetail: any = JSON.parse(atob(response.token.split('.')[1]));
        sessionStorage.setItem('customToken', response.token);
        sessionStorage.setItem('userDetail', JSON.stringify(userDetail));
        console.log("UserInfo", this.userInfo)
        this.homeService.userNameUpdated(true);  
        this.getBannerList();
        this.getUserProfile();
        this.getSectionListByUser() 
      } else {
        this.toastService.showWarning('Your account is not verified yet!', 'Alert!');
        setTimeout(() => {
          return;
        }, 3000);
      }
    }, (error: any) => {
      this.toastService.showError('Please login again!', 'Alert');
    })
    
  }
  getBannerList() {
    this.commonService.getBannerImages().subscribe((response: any) => {
      if (response) {
        this.bannerList = response;
        this.imageCompatibility();
      }
    }, (error: any) => {
      this.toastService.showError(error, 'Error');
    })
  }
  imageCompatibility() {
    forEach(this.bannerList, (img) => {
      map(img.contentData, (data) => {
        if (data.orientation === 'Tablet (Portrait)') {
          data['portraitImg'] = data.imageUrl;
        } else if (data.orientation === 'Tablet (Landscape)') {
          data['landscapeImg'] = data.imageUrl;
        } else if (data.orientation === 'Mobile') {
          data['mobileImg'] = data.imageUrl;
        } else if (data.orientation === 'Desktop') {
          data['desktopImg'] = data.imageUrl;
        }
      });
    })
  }
  isBannerVisible() {
    return this.homeService.showBanner;
  }

  getUserProfile() {
    sessionStorage.removeItem('profileImage');
    this.commonService.getProfileImage().subscribe((response: any) => {
      if (response) {
        this.profileImage = response.data.url;
        console.log("profile Image",  this.profileImage)
        sessionStorage.setItem('profileImage', this.profileImage);
      }
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
    ).subscribe(
      employees => {
        this.employeeList = employees;
        this.isLoading = false;
        this.cd.markForCheck();
      },
      error => {
        console.error('Error fetching employees:', error);
        this.isLoading = false;
      }
    );
  }
  
  searchEmployees(searchTerm: string): Observable<{ id: string; value: string; mail: string; }[]> {
    if (typeof searchTerm !== 'string' || searchTerm.trim() === '') {
      return of([]);
    }
  
    return this.loginAsService.getEmployeeNameById(searchTerm).pipe(
      catchError(err => {
        console.error('Error fetching employees:', err);
        return of([]);
      })
    );
  }
   
  onEmployeeSelect(employeeName: string): void {
    const selectedEmployee = this.employeeList.find(emp => emp.value === employeeName);
    if (selectedEmployee) {
      this.assetForm.patchValue({
        employeeId: selectedEmployee.id,
        employeeName: selectedEmployee.value,
        employeeEmail: selectedEmployee.mail
      });
      this.cd.markForCheck();
      this.fetchEmployeeId(selectedEmployee.value);
    }
  }
  

  // Define the expected response type

  onFocus(): void {
    console.log('Input field is focused');
    // Add any additional logic you want to execute on focus
  }
  
  fetchEmployeeId(employeeName: string): void {
    debugger;
    this.loginAsService.getEmployeeId(employeeName).subscribe(
      (response) => {
        if (Array.isArray(response) && response.length > 0) {
          const employee = response[0]; // Extract the first element of the array
          this.assetForm.patchValue({
            employeeId: employee.value || '',
            employeeEmail: employee.mail || '',
            employeeName: employeeName
          });
          this.cd.markForCheck();
          console.log("mail", employee.mail);
        } else {
          console.error('No employee mail found for the selected name');
        }
      },
      error => {
        console.error('Error fetching employee ID', error);
      }
    );
  }
}
