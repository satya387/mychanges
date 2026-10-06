import { HttpClient, HttpParams, HttpResponse, HttpHeaders  } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Practice_URL } from './practice-dashboard.url-config';

@Injectable({
  providedIn: 'root',
})
export class PracticeDashboardService {
  constructor(private http: HttpClient) {}

//   private sGAReportSubject = new BehaviorSubject<any>({});

//   sGAReport$ = this.sGAReportSubject.asObservable();

//   updateSgaReport(data: any) {
//     this.sGAReportSubject.next(data);
//   }

  getAccountsByEmpId() {
    return this.http.get(Practice_URL.GET_PRACTICE_ALL_ACCOUNTS_BY_EMP_ID);
  }
  getPracticesByEmpId() {
    return this.http.get(Practice_URL.GET_PRACTICE_ALL_PRACTICES_BY_EMP_ID);
  }
//   getSGAAccessByEmpemidsId() {
//     return this.http.get(SGA_URL.GET_SGA_ACCESSBY_EMPEMIDS_ID);
//   }


  getPracticeDashboardOverAllData(practiceObject: any) {
    return this.http.post(
        Practice_URL.GET_PRACTICE_DASHBOARD_OVERALL_DATA,
        practiceObject
    );
  }

  getPracticeDashboardDataByPracticeId(practiceObject: any) {
    return this.http.post(
        Practice_URL.GET_PRACTICE_DASHBOARD_DATA_BY_PRACTICE_ID,
        practiceObject
    );
  }

}
