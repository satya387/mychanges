import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { AccountList, BuItem, ProjectList, PracticeAreaList } from './acc-dashboard/acc-dashboard.component';


@Injectable({
  providedIn: 'root'
})
export class ChartsService {

  private BASE_URL = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }

  public getRevenueData(empEmidsId?: string, buId?: any, accountId?: any, year?: any, location?: any, isMacadamian?: boolean, isRevenueOnHold?: boolean, studio?: any, projId?: any, practiceAreaId?: any, quartely?: boolean): Observable<any> {
   
    let params = new HttpParams()
      // .set('location', -1)
      .set('empEmidsId', empEmidsId)
      // .set('accountId', '-1')
      // .set('projectId', -1)
    // .set('year', 2022)
    // .set('IsMacadamian', 0)
    //.set('IsRevenueOnHold', 0)
    if (isMacadamian) {
      params = params.set('isMacadamian', 1);
    } else {
      params = params.set('isMacadamian', 0);
    }
    if (isRevenueOnHold) {
      params = params.set('isRevenueOnHold', 1);
    } else {
      params = params.set('isRevenueOnHold', 0);
    }
    if (location) {
      params = params.set('location', location);
    } else {
      params = params.set('location', -1);
    }
    if (year == 'LTM') {
      params = params.set('year', '-1');
    } 
    else if (year) {
      params = params.set('year', year);
    } 
    else {
      params = params.set('year', new Date().getFullYear());
    }
    if (buId) {
      params = params.set('Bu', buId.toString());
    } else {
      params = params.set('Bu', '-1');
    }
    if (accountId) {
      params = params.set('accountId', accountId);
    } else {
      params = params.set('accountId', -1);
    }
    if (studio) {
      params = params.set('studio', studio);
    } else {
      params = params.set('studio', -1);
    }
    if (projId) {
      params = params.set('projectId', projId);
    } else {
      params = params.set('projectId', -1);
    }
    if (practiceAreaId) {
      params = params.set('practiceAreaId', practiceAreaId);
    } else {
      params = params.set('practiceAreaId', -1);
    }
    if (quartely) {
      params = params.set('quartely', 1);
    } else {
      params = params.set('quartely', 0);
    }
    // .set('Bu', '-1');
    return this.http.get(this.BASE_URL + 'DeliveryDashboard/GetDeliveryDashboardRevenue', { params });
  }
  public getHeadCountData(empEmidsId?: string, buId?: any, accountId?: any, year?: any, location?: any, isMacadamian?: boolean, isRevenueOnHold?: boolean, studio?: any, projId?: any, practiceAreaId?: any, quartely?: boolean) {

    let params = new HttpParams()
      //.set('location', '-1')
      .set('empEmidsId', empEmidsId)
      // .set('accountId', '-1')
      .set('projectId', '-1')
      // .set('Bu', '-1')
      // .set('year', 2022)
      // .set('IsMacadamian', 0)
      // .set('IsRevenueOnHold', 0)
      if (isMacadamian) {
        params = params.set('isMacadamian', 1);
      } else {
        params = params.set('isMacadamian', 0);
      }
      if (isRevenueOnHold) {
        params = params.set('isRevenueOnHold', 1);
      } else {
        params = params.set('isRevenueOnHold', 0);
      }
    if (location) {
      params = params.set('location', -1);
    } else {
      params = params.set('location', -1);
    }
    if (year == 'LTM') {
      params = params.set('year', '-1');
    } 
    else if (year) {
      params = params.set('year', year);
    } 
    else {
      params = params.set('year', new Date().getFullYear());
    }
    if (buId) {
      params = params.set('Bu', buId.toString());
    } else {
      params = params.set('Bu', '-1');
    }
    if (accountId) {
      params = params.set('accountId', accountId);
    } else {
      params = params.set('accountId', -1);
    }
    if (studio) {
      params = params.set('studio', studio);
    } else {
      params = params.set('studio', -1);
    }
    if (projId) {
      params = params.set('projectId', projId);
    } else {
      params = params.set('projectId', -1);
    }
    if (practiceAreaId) {
      params = params.set('practiceAreaId', practiceAreaId);
    } else {
      params = params.set('practiceAreaId', -1);
    }
    if (quartely) {
      params = params.set('quartely', 1);
    } else {
      params = params.set('quartely', 0);
    }

    return this.http.get(this.BASE_URL + 'DeliveryDashboard/GetDeliveryDashboardHeadCounts', { params });
  }

  public IsEBITDAVisible(empEmidsId?: string): Observable<any> {
    const params = new HttpParams().set('empEmidsId', empEmidsId);
    return this.http.get<any>(this.BASE_URL + 'DeliveryDashboard/IsEBITDAEnabled', { params });
  }

  public getBuList(empEmidsId?: string): Observable<BuItem[]> {
    const params = new HttpParams().set('empEmidsId', empEmidsId);
    return this.http.get<BuItem[]>(this.BASE_URL + 'DeliveryDashboard/GetBuList', { params });
  }

  public getAccountList(empEmidsId: string): Observable<AccountList[]> {
    const params = new HttpParams().set('empEmidsId', empEmidsId);
    return this.http.get<AccountList[]>(this.BASE_URL + 'DeliveryDashboard/GetAccountBasedOnEmpId', { params });
  }

  public getProjectList(empEmidsId: string, accountId: any): Observable<ProjectList[]> {
    const params = new HttpParams()
    .set('empEmidsId', empEmidsId)
    .set('accountId', accountId);
    return this.http.get<ProjectList[]>(this.BASE_URL + 'DeliveryDashboard/GetProjectBasedOnEmpId', { params });
  }

  public getPracticeAreaList(empEmidsId: string): Observable<PracticeAreaList[]> {
    const params = new HttpParams()
    .set('empEmidsId', empEmidsId);
    return this.http.get<PracticeAreaList[]>(this.BASE_URL + 'DeliveryDashboard/GetPracticeAreaBasedOnEmpId', { params });
  }
  public getDirectMarginData(empEmidsId?: string, buId?: any, accountId?: any, year?: any, location?: any, isMacadamian?: boolean, isRevenueOnHold?: boolean, studio?: any, projId?: any, practiceAreaId?: any, quartely?: boolean): Observable<any> {
    let params = new HttpParams()
      //.set('location', '-1')
      .set('empEmidsId', empEmidsId)
      // .set('accountId', '-1')
      .set('projectId', '-1')
      // .set('Bu', '-1')
      // .set('year', 2022)
      // .set('IsMacadamian', 0)
      // .set('IsRevenueOnHold', 0)
      if (isMacadamian) {
        params = params.set('isMacadamian', 1);
      } else {
        params = params.set('isMacadamian', 0);
      }
      if (isRevenueOnHold) {
        params = params.set('isRevenueOnHold', 1);
      } else {
        params = params.set('isRevenueOnHold', 0);
      }
    if (location) {
      params = params.set('location', location);
    } else {
      params = params.set('location', -1);
    }
    if (year == 'LTM') {
      params = params.set('year', '-1');
    } 
    else if (year) {
      params = params.set('year', year);
    } 
    else {
      params = params.set('year', new Date().getFullYear());
    }
    if (buId) {
      params = params.set('Bu', buId.toString());
    } else {
      params = params.set('Bu', '-1');
    }
    if (accountId) {
      params = params.set('accountId', accountId);
    } else {
      params = params.set('accountId', -1);
    }
    if (studio) {
      params = params.set('studio', studio);
    } else {
      params = params.set('studio', -1);
    }
    if (projId) {
      params = params.set('projectId', projId);
    } else {
      params = params.set('projectId', -1);
    }
    if (practiceAreaId) {
      params = params.set('practiceAreaId', practiceAreaId);
    } else {
      params = params.set('practiceAreaId', -1);
    }
    if (quartely) {
      params = params.set('quartely', 1);
    } else {
      params = params.set('quartely', 0);
    }
   
    return this.http.get<any>(this.BASE_URL + 'DeliveryDashboard/GetDeliveryDashboardDirectMargin', { params });
  }
  public getAccountMarginData(empEmidsId?: string, buId?: any, accountId?: any, year?: any, location?: any, isMacadamian?: boolean, isRevenueOnHold?: boolean, studio?: any, projId?: any, practiceAreaId?: any, quartely?: boolean): Observable<any> {
    let params = new HttpParams()
      //.set('location', '-1')
      .set('empEmidsId', empEmidsId)
      // .set('accountId', '-1')
      .set('projectId', '-1')
      // .set('Bu', '-1')
      // .set('year', 2022)
      // .set('IsMacadamian', 0)
      // .set('IsRevenueOnHold', 0)
      if (isMacadamian) {
        params = params.set('isMacadamian', 1);
      } else {
        params = params.set('isMacadamian', 0);
      }
      if (isRevenueOnHold) {
        params = params.set('isRevenueOnHold', 1);
      } else {
        params = params.set('isRevenueOnHold', 0);
      }
    if (location) {
      params = params.set('location', location);
    } else {
      params = params.set('location', -1);
    }
    if (year == 'LTM') {
      params = params.set('year', '-1');
    } 
    else if (year) {
      params = params.set('year', year);
    } 
    else {
      params = params.set('year', new Date().getFullYear());
    }
    if (buId) {
      params = params.set('Bu', buId.toString());
    } else {
      params = params.set('Bu', '-1');
    }
    if (accountId) {
      params = params.set('accountId', accountId);
    } else {
      params = params.set('accountId', -1);
    }
    if (studio) {
      params = params.set('studio', studio);
    } else {
      params = params.set('studio', -1);
    }
    if (projId) {
      params = params.set('projectId', projId);
    } else {
      params = params.set('projectId', -1);
    }
    if (practiceAreaId) {
      params = params.set('practiceAreaId', practiceAreaId);
    } else {
      params = params.set('practiceAreaId', -1);
    }
    if (quartely) {
      params = params.set('quartely', 1);
    } else {
      params = params.set('quartely', 0);
    }

    return this.http.get<any>(this.BASE_URL + 'DeliveryDashboard/GetDeliveryDashboardAccountMargin', { params });
  }

  public getUtilizationData(empEmidsId?: string, buId?: any, accountId?: any, year?: any, location?: any, isMacadamian?: boolean, isRevenueOnHold?: boolean, studio?: any, projId?: any, practiceAreaId?: any, quartely?: boolean): Observable<any> {
    let params = new HttpParams()
      //  .set('location', '-1')
      .set('empEmidsId', empEmidsId)
      // .set('accountId', '-1')
      .set('projectId', '-1')
      // .set('Bu', '-1')
      // .set('year', 2022)
      // .set('IsMacadamian', 0)
      // .set('IsRevenueOnHold', 0)
      if (isMacadamian) {
        params = params.set('isMacadamian', 1);
      } else {
        params = params.set('isMacadamian', 0);
      }
      if (isRevenueOnHold) {
        params = params.set('isRevenueOnHold', 1);
      } else {
        params = params.set('isRevenueOnHold', 0);
      }
    if (location) {
      params = params.set('location', -1);
    } else {
      params = params.set('location', -1);
    }
    if (year == 'LTM') {
      params = params.set('year', '-1');
    } 
    else if (year) {
      params = params.set('year', year);
    } 
    else {
      params = params.set('year', new Date().getFullYear());
    }
    if (buId) {
      params = params.set('Bu', buId.toString());
    } else {
      params = params.set('Bu', '-1');
    }
    if (accountId) {
      params = params.set('accountId', accountId);
    } else {
      params = params.set('accountId', -1);
    }
    if (studio) {
      params = params.set('studio', studio);
    } else {
      params = params.set('studio', -1);
    }
    if (projId) {
      params = params.set('projectId', projId);
    } else {
      params = params.set('projectId', -1);
    }
    if (practiceAreaId) {
      params = params.set('practiceAreaId', practiceAreaId);
    } else {
      params = params.set('practiceAreaId', -1);
    }
    if (quartely) {
      params = params.set('quartely', 1);
    } else {
      params = params.set('quartely', 0);
    }

    return this.http.get<any>(this.BASE_URL + 'DeliveryDashboard/GetDeliveryDashboardUtilization', { params });
  }

  public getAccountRisksData(empEmidsId?: string, buId?: any, accountId?: any, year?: any, location?: any, projectId?: any, isMacadamian?: boolean, isRevenueOnHold?: boolean, studio?: any, projId?: any, practiceAreaId?: any,quartely?: boolean): Observable<any> {
    let params = new HttpParams()
    .set('empEmidsId', empEmidsId)
    if (year == 'LTM') {
      params = params.set('year', '-1');
    } 
    else if (year) {
      params = params.set('year', year);
    } 
    else {
      params = params.set('year', new Date().getFullYear());
    }
    if (buId) {
      params = params.set('Bu', buId.toString());
    } else {
      params = params.set('Bu', '-1');
    }
    if (location) {
      params = params.set('location', location);
    } else {
      params = params.set('location', -1);
    }
    if (empEmidsId) {
      params = params.set('EmpEmidsId', empEmidsId);
    } else {
      params = params.set('EmpEmidsId', '-1');
    }
    if (projectId) {
      params = params.set('ProjectId', projectId);
    } else {
      params = params.set('ProjectId', -1);
    }
    if (accountId) {
      params = params.set('AccountId', accountId);
    } else {
      params = params.set('accountId', -1);
    }
    if (isMacadamian) {
      params = params.set('isMacadamian', 1);
    } else {
      params = params.set('isMacadamian', 0);
    }
    if (isRevenueOnHold) {
      params = params.set('isRevenueOnHold', 1);
    } else {
      params = params.set('isRevenueOnHold', 0);
    }
    if (studio) {
      params = params.set('studio', studio);
    } else {
      params = params.set('studio', -1);
    }
    if (projId) {
      params = params.set('projectId', projId);
    } else {
      params = params.set('projectId', -1);
    }
    if (practiceAreaId) {
      params = params.set('practiceAreaId', practiceAreaId);
    } else {
      params = params.set('practiceAreaId', -1);
    }
    if (quartely) {
      params = params.set('quartely', 1);
    } else {
      params = params.set('quartely', 0);
    }

    return this.http.get<any>(this.BASE_URL + 'DeliveryDashboard/GetDeliveryDashboardAccountRisks', { params });
  }

  public getBookToBillData(empEmidsId?: string, buId?: any, accountId?: any, year?: any, location?: any, projectId?: any, isMacadamian?: boolean, isRevenueOnHold?: boolean, studio?: any, projId?: any, practiceAreaId?: any,quartely?: boolean): Observable<any> {
    let params = new HttpParams()
    .set('empEmidsId', empEmidsId)
    if (year == 'LTM') {
      params = params.set('year', '-1');
    } 
    else if (year) {
      params = params.set('year', year);
    } 
    else {
      params = params.set('year', new Date().getFullYear());
    }
    if (buId) {
      params = params.set('Bu', buId.toString());
    } else {
      params = params.set('Bu', '-1');
    }
    if (location) {
      params = params.set('location', location);
    } else {
      params = params.set('location', -1);
    }
    if (isMacadamian) {
      params = params.set('isMacadamian', 1);
    } else {
      params = params.set('isMacadamian', 0);
    }
    if (isRevenueOnHold) {
      params = params.set('isRevenueOnHold', 1);
    } else {
      params = params.set('isRevenueOnHold', 0);
    }
    if (projectId) {
      params = params.set('ProjectId', projectId);
    } else {
      params = params.set('ProjectId', -1);
    }
    if (accountId) {
      params = params.set('AccountId', accountId);
    } else {
      params = params.set('accountId', -1);
    }
    if (studio) {
      params = params.set('studio', studio);
    } else {
      params = params.set('studio', -1);
    }
    if (projId) {
      params = params.set('projectId', projId);
    } else {
      params = params.set('projectId', -1);
    }
    if (practiceAreaId) {
      params = params.set('practiceAreaId', practiceAreaId);
    } else {
      params = params.set('practiceAreaId', -1);
    }
    if (quartely) {
      params = params.set('quartely', 1);
    } else {
      params = params.set('quartely', 0);
    }

    return this.http.get<any>(this.BASE_URL + 'DeliveryDashboard/GetDeliveryDashboardBookToBill', { params });
  }
  
  public getSharedCostData(empEmidsId?: string, buId?: any, accountId?: any, year?: any, location?: any, isMacadamian?: boolean, isRevenueOnHold?: boolean, studio?: any, projId?: any, practiceAreaId?: any,quartely?: boolean): Observable<any> {
    let params = new HttpParams()
      //.set('location', '-1')
      .set('empEmidsId', empEmidsId)
      // .set('accountId', '-1')
      // .set('projectId', '-1')
      // .set('Bu', '-1')
      // .set('year', 2022)
      // .set('IsMacadamian', 0)
      // .set('IsRevenueOnHold', 0)
      if (isMacadamian) {
        params = params.set('isMacadamian', 1);
      } else {
        params = params.set('isMacadamian', 0);
      }
      if (isRevenueOnHold) {
        params = params.set('isRevenueOnHold', 1);
      } else {
        params = params.set('isRevenueOnHold', 0);
      }
    if (location) {
      params = params.set('location', location);
    } else {
      params = params.set('location', -1);
    }
    if (year == 'LTM') {
      params = params.set('year', '-1');
    } 
    else if (year) {
      params = params.set('year', year);
    } 
    else {
      params = params.set('year', new Date().getFullYear());
    }
    if (buId) {
      params = params.set('Bu', buId.toString());
    } else {
      params = params.set('Bu', '-1');
    }
    if (accountId) {
      params = params.set('accountId', accountId);
    } else {
      params = params.set('accountId', -1);
    }
    if (studio) {
      params = params.set('studio', studio);
    } else {
      params = params.set('studio', -1);
    }
    if (projId) {
      params = params.set('projectId', projId);
    } else {
      params = params.set('projectId', -1);
    }
    if (practiceAreaId) {
      params = params.set('practiceAreaId', practiceAreaId);
    } else {
      params = params.set('practiceAreaId', -1);
    }
    if (quartely) {
      params = params.set('quartely', 1);
    } else {
      params = params.set('quartely', 0);
    }

    return this.http.get<any>(this.BASE_URL + 'DeliveryDashboard/GetDeliveryDashboardSharedCost', { params });
  }

  public getEbitdaData(empEmidsId?: string, buId?: any, accountId?: any, year?: any, location?: any, isMacadamian?: boolean, isRevenueOnHold?: boolean, studio?: any, projId?: any, practiceAreaId?: any,quartely?: boolean, isAddback?: boolean): Observable<any> {
    let params = new HttpParams()
      //.set('location', '-1')
      .set('empEmidsId', empEmidsId)
      // .set('accountId', '-1')
      // .set('projectId', '-1')
      // .set('Bu', '-1')
      // .set('year', 2022)
      // .set('IsMacadamian', 0)
      // .set('IsRevenueOnHold', 0)
      if (isMacadamian) {
        params = params.set('isMacadamian', 1);
      } else {
        params = params.set('isMacadamian', 0);
      }
      if (isRevenueOnHold) {
        params = params.set('isRevenueOnHold', 1);
      } else {
        params = params.set('isRevenueOnHold', 0);
      }
    if (location) {
      params = params.set('location', location);
    } else {
      params = params.set('location', -1);
    }
    if (year == 'LTM') {
      params = params.set('year', '-1');
    } 
    else if (year) {
      params = params.set('year', year);
    } 
    else {
      params = params.set('year', new Date().getFullYear());
    }
    if (buId) {
      params = params.set('Bu', buId.toString());
    } else {
      params = params.set('Bu', '-1');
    }
    if (accountId) {
      params = params.set('accountId', accountId);
    } else {
      params = params.set('accountId', -1);
    }
    if (studio) {
      params = params.set('studio', studio);
    } else {
      params = params.set('studio', -1);
    }
    if (projId) {
      params = params.set('projectId', projId);
    } else {
      params = params.set('projectId', -1);
    }
    if (practiceAreaId) {
      params = params.set('practiceAreaId', practiceAreaId);
    } else {
      params = params.set('practiceAreaId', -1);
    }
    if (quartely) {
      params = params.set('quartely', 1);
    } else {
      params = params.set('quartely', 0);
    }
    if(isAddback){
      params = params.set('isAddback', 1);
    } else {
      params = params.set('isAddback', 0);
    }
    return this.http.get<any>(this.BASE_URL + 'DeliveryDashboard/GetDeliveryDashboardEBITDA', { params });
  }


  downloadExcelDump(requestBody): Observable<HttpResponse<any>> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    var res =  this.http.post<HttpResponse<any>>(this.BASE_URL+ 'DeliveryDashboard/GetExcelDumpReport', requestBody, {
      headers: headers,
      responseType: 'blob' as 'json',
      observe: 'response' as 'body'
    });
    return res;
  }
}