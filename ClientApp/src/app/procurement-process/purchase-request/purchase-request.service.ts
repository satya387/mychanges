import { HttpClient, HttpParams, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PR_URLS} from './purchase-request.url-config';
import { Observable } from 'rxjs';

@Injectable({
    providedIn:'root'
})

export class PurchaseRequestService {

    constructor(private http: HttpClient){

    }

    getPurchaseRequest(requestBody){
        return this.http.post(PR_URLS.GET_ALL_PR_DETAILS,requestBody)
    }
    getPurchaseRequestById(requestBody){
        debugger;
        return this.http.post(PR_URLS.GET_PR_DETAILS_BY_ID,requestBody)
    }
    getProjectListByEmpEmidsId(empEmidsId) {
        return this.http.get(PR_URLS.GET_PROJECT_BY_EMPEMIDSID + empEmidsId);
    }
    getPurchaseRequestStatus(){
        return this.http.get(PR_URLS.GET_PR_STATUS);
    }
    getRequisitionType(){
        return this.http.get(PR_URLS.GET_REQUISITION_TYPE);
    }
    getCurrencyType(){
        return this.http.get(PR_URLS.GET_CURRENCY_TYPE);
    }
    getAccountByProjectId(projectId){
        return this.http.get(PR_URLS.GET_ACCOUNT_NAME_BY_PROJECT_ID + projectId)
    }
    getDHByProjectId(projectId){
        return this.http.get(PR_URLS.GET_DH_BY_PROJECT_ID + projectId)
    }
    getCitiesByLocationId(locationId){
        return this.http.get(PR_URLS.GET_CITIES_BY_LOCATION_ID + locationId)
    }
    getPurchaseRequestLocation(){
        return this.http.get(PR_URLS.GET_PR_LOCATION);
    }
    savePurchaseRequest(formData: FormData) {
        const headers = new HttpHeaders({
          'Accept': 'application/json'
        });
        return this.http.post(PR_URLS.SAVE_PR_DETAILS,  formData, { headers });
      }
    updatePurchaseRequestStatus(requestBody){
        return this.http.put(PR_URLS.UPDATE_PR_STATUS, requestBody)
    }
    rejectPurchaseRequestStatus(requestBody){
        return this.http.put(PR_URLS.REJECT_PR_STATUS, requestBody)
    }
    triggerMail(id){
        return this.http.get(PR_URLS.TRIGGER_MAIL + id)
    }

    downloadExcelDump(requestBody): Observable<HttpResponse<any>> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        var res =  this.http.post<HttpResponse<any>>(PR_URLS.GET_PR_EXCEL_DUMP, requestBody, {
          headers: headers,
          responseType: 'blob' as 'json',
          observe: 'response' as 'body'
        });
        return res;
      }
      getUploadFIle(requestBody): Observable<HttpResponse<any>> {
        debugger;
        return this.http.post<HttpResponse<any>>(
            PR_URLS.Download_Doc, requestBody, 
          {
            responseType: 'blob' as 'json',
            observe: 'response' as 'body'
          });
      }
      GetPOEditDetails(Id){
        return this.http.get(PR_URLS.POEditDetails+ Id);
      }
      GetPRDetails(Id){
        debugger;
        return this.http.get(PR_URLS.PR_Details+ Id);
      }
      getBuyersByLocationId(locationId){
        return this.http.get(PR_URLS.GetBuyersByLocationId+ locationId)
      }
}