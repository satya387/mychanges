import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';

// Define a counter variable to track the number of calls

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ALLOWANCE_URLS } from './allowance-module.url-config';
@Injectable({
  providedIn: 'root'
})
export class AllowanceModuleService {
  constructor(private http: HttpClient) { }
   
  GetAllowanceAccessByEmpId() {
    debugger;
    return this.http.get(ALLOWANCE_URLS.ALLOWANCE_ACCESS_BY_EMPID, { });
  }
   
  GetAllowanceDetails() {
    debugger;
    return this.http.get(ALLOWANCE_URLS.ALLOWANCE_DETAILS, { });
  }
  GetProjectList() {
    debugger;
    return this.http.get(ALLOWANCE_URLS.PROJECT_LIST, { });
  }
  
  GetEmployeeList() {
    debugger;
    return this.http.get(ALLOWANCE_URLS.EMPLOYEE_LIST + '0', { });
  }
  
  getEmployeeListByProjId(ProjId) {
    debugger;
    return this.http.get(ALLOWANCE_URLS.EMPLOYEE_LIST+ ProjId, { });
  }
  GetShiftTypeList() {
    debugger;
    return this.http.get(ALLOWANCE_URLS.SHIFT_TYPE_LIST, { });
  }

  saveAllowanceDetails(formData: FormData) {
    debugger;
    const headers = new HttpHeaders({
      'Accept': 'application/json'
    });
    return this.http.post(ALLOWANCE_URLS.CREATE_ALLOWANCES,  formData, { headers });
  }

  approveRejectAllowance(approveRejectObject: any): any {
    debugger;
    return this.http.put(ALLOWANCE_URLS.UPDATE_STATUS,
      approveRejectObject
    );
  }
}

