import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CSAT_SCORE_URLS } from './customer-satisfaction-score.url-config';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CustomerSatisfactionScoreService {

  private BASE_URL = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }

  GetProjectsList(object:any){
    let params=new HttpParams()
    params=params.set('AccountId',object.AccountId)
    params=params.set('EmpemidsId',object.empEmidsId)
    return this.http.get(CSAT_SCORE_URLS.GetProjects, {params});
  }
 GetAccountsList(empEmidsId){
  return this.http.get(CSAT_SCORE_URLS.GetAccounts+ empEmidsId);

 }
 deleteCSAT(data) {
  return this.http.post(CSAT_SCORE_URLS.DELETE_CSAT, data);
}
 getCustomersList(requestBody:any) {
    let params=new HttpParams()
    params=params.set('AccountId',requestBody.AccountId)
    params=params.set('ProjectId',requestBody.ProjectId)
    params=params.set('Studio',requestBody.Studio)
    return this.http.get(CSAT_SCORE_URLS.GetCustomers_LIST, {params});
  }

  GetEmployeeList(){
    return this.http.get(CSAT_SCORE_URLS.GetEmployees);
   }

   GetRoleType(EmpEmidsId){
    return this.http.get(CSAT_SCORE_URLS.GetRoleType+EmpEmidsId);
  }

  GetBUList(EmpEmidsId){
    return this.http.get(CSAT_SCORE_URLS.GetBuList+EmpEmidsId);
  }

  GetTemplateDetails(EmpEmidsId, cycle){
    return this.http.get(CSAT_SCORE_URLS.GetTemplateDetails(EmpEmidsId,cycle));
  }

  UploadCSATDocument(requestBody) {   
    var a = this.http.post(CSAT_SCORE_URLS.UploadCSATDocument, requestBody);
    return a;
  }

  GetCSATCycles(){
    return this.http.get(CSAT_SCORE_URLS.GetCSATCycles);  
  }

  GetCSATUploadData(requestBody:any){
    let params=new HttpParams()
    params=params.set('AccountName',requestBody.AccountName)
    params=params.set('ProjectName',requestBody.ProjectName)
    params=params.set('BUName',requestBody.BUName)
    params= params.set('EmployeeID', requestBody.EmployeeID)
    return this.http.get(CSAT_SCORE_URLS.GetCSATUploadData, {params});  
  }

  ClientRespondentData(requestBody:any){
    return this.http.post(CSAT_SCORE_URLS.ClientRespondentData, requestBody);
  }

  GetRespondentDetails(requestBody:any){
    let params=new HttpParams()
    params=params.set('AccountName',requestBody.AccountName)
    params=params.set('ProjectName',requestBody.ProjectName)
    params= params.set('EmployeeID', requestBody.EmployeeID)
    params= params.set('Cycle', requestBody.Cycle)
    return this.http.get(CSAT_SCORE_URLS.GetRespondentDetails, {params});
  }
  GetCSATEditDetails(Id){
    return this.http.get(CSAT_SCORE_URLS.EditDetails+ Id);
  }
  GetDropDownValues(){
    return this.http.get(CSAT_SCORE_URLS.DropDownValues);
  }
}
