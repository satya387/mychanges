import { HttpClient, HttpParams, HttpResponse, HttpHeaders  } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SGA_URL } from './sga-dashboard.url-config';

@Injectable({
  providedIn: 'root',
})
export class SgaDashboardService {
  constructor(private http: HttpClient) {}

  private sGAReportSubject = new BehaviorSubject<any>({});

  sGAReport$ = this.sGAReportSubject.asObservable();

  updateSgaReport(data: any) {
    this.sGAReportSubject.next(data);
  }

  getSGAReport(object: any): any {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      var res =  this.http.post<HttpResponse<any>>(SGA_URL.GET_SGA_HTML_REPORT, object, {
        headers: headers,
        responseType: 'blob' as 'json',
        observe: 'response' as 'body'
      });
    return res;
  }

  getAccountsByEmpId() {
    return this.http.get(SGA_URL.GET_SGA_ALL_ACCOUNTS_BY_EMP_ID);
  }

  getSGADashboardDataByEmployeeFunction(sgaObject: any): any {
    return this.http.post(
      SGA_URL.GET_SGA_DASHBOARD_DATA_BY_EMPLOYEE_FUNCTION,
      sgaObject
    );
  }

  getSGAAccessByEmpemidsId() {
    return this.http.get(SGA_URL.GET_SGA_ACCESSBY_EMPEMIDS_ID);
  }

  getSGADashboardDataGroupLevelByFunction(sgaObject: any) {
    return this.http.post(
      SGA_URL.GET_SGA_DASHBOARD_DATA_BY_GROUP_FUNCTION,
      sgaObject
    );
  }

  getSGADashboardOverAllData(sgaObject: any) {
    return this.http.post(
      SGA_URL.GET_SGA_DASHBOARD_OVERALL_DATA,
      sgaObject
    );
  }

  getSGADashboardDataForGraph(object: any) {
    return this.http.post(SGA_URL.GET_SGA_DASHBOARD_DATAFORGRAPH, object);
  }

  GetSGADashboardDataGroupLevelForGraph(object: any) {
    return this.http.post(SGA_URL.GET_SGA_DASHBOARD_DATAGROUPLEVELFORGRAPH, object);
  }

  GetSGADashboardOverAllDataForGraph(object: any) {
    return this.http.post(SGA_URL.GET_SGA_DASHBOARD_OVER_ALL_DATAFORGRAPH, object);
  }

}
