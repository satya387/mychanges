import { Injectable } from '@angular/core';

import { HttpClient,HttpHeaders, HttpResponse  } from '@angular/common/http';
import { LOGIN_AS_URLS } from './login-as.url-config';
import { saveAs } from 'file-saver';
import { Observable, of } from 'rxjs';
import { map, catchError} from 'rxjs/operators';

export interface Employee {
  id: string;
  value: string;
  mail: string;
}

@Injectable({
  providedIn: 'root'
})
export class LoginAsService {
  viewAllTileDetail: any;
  catchError: any
  constructor(private http: HttpClient) { }


  homeSectionList(empEmidsId) {
    return this.http.get(LOGIN_AS_URLS.HOME_SECTION_LIST + empEmidsId);
  }  
  getEmployeeNameById(employeeName: string): Observable<Employee[]> {
    debugger;
    const url = `${LOGIN_AS_URLS.get_NAME}${employeeName}`;
    console.log('Fetching from URL:', url); 
    return this.http.get<Employee[]>(url).pipe(
      catchError(error => {
        console.error('Error fetching employee names:', error);
        return of([]); 
      })
    );
  }
  getEmployeeId(employeeName: string): Observable<{ value: string; mail: string }> {
    return this.http.get<{ value: string; mail: string }>(LOGIN_AS_URLS.get_EmpId + employeeName);
  }
  saveLoginDetails(data: { employeeName: string; username: string }): Observable<any> { 
    return this.http.post(LOGIN_AS_URLS.SAVE_LOGIN_DETAILS, data); }
}
