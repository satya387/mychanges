import { HttpClient, HttpParams, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CR_URLS} from './commission-report.url-config';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn:'root'
})

export class CommissionReportService  {

    constructor(private http: HttpClient){ }

    private clientPartnerIdSubject = new BehaviorSubject<number>(null);
    clientPartnerId$ = this.clientPartnerIdSubject.asObservable();

    setClientPartnerId(id: number) {
      this.clientPartnerIdSubject.next(id);
    }

    getAllCPCommisionData(){
        return this.http.get(CR_URLS.GET_ALL_CP_COMMISSION_DATA)
    }

    GetCommissionReportByClientId(clientPartnerId : number){
        let params = new HttpParams().set('CPId', clientPartnerId);
        return this.http.get(CR_URLS.GET_COMMISSION_REPORT_BY_CLIENTID, { params }); 
    }

    GetCommissionReportById(incentiveEarnedId : number){
        let params = new HttpParams().set('Id', incentiveEarnedId);
        return this.http.get(CR_URLS.GET_COMMISSION_REPORT_BY_Id, { params }); 
    }

    updateIncentiveEarnedById(incentiveEarnedData: any): any {
        let incentiveEarnedObject = {
            incentiveEarnedId : incentiveEarnedData.incentiveEarnedId,
            comments : incentiveEarnedData.comments,
            incentivePercentageAsPerPolicy : incentiveEarnedData.incentivePercentageAsPerPolicy
        };
        return this.http.put(CR_URLS.UPDATE_INCENTIVE_EARNED_BY_Id, incentiveEarnedObject);
    }

    GetCommissionReportDrillDownData(clientPartnerId : number){
        let params = new HttpParams().set('CPId', clientPartnerId);
        return this.http.get(CR_URLS.GET_COMMISSION_REPORT_DRILL_DOWN_DATA, { params }); 
    }

    checkIsAdminByEmpemidsId(): any {
        return this.http.get(CR_URLS.CHECK_IS_ADMIN);
    }

    getCommissionReportGrid(requestBody) {
        return this.http.post(CR_URLS.GET_COMMISSION_REPORT_GRID, requestBody);
    }
}