import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CVA_URLS } from './customer-value-add.url-config';

@Injectable({
  providedIn: 'root'
})
export class CustomerValueAddService {

  constructor(private http: HttpClient) { }

  getCustomersList(requestBody: any) {
    let params = new HttpParams()
    params = params.set('AccountId', requestBody.AccountId)
    params = params.set('ProjectId', requestBody.ProjectId)
    //params = params.set('Studio', requestBody.Studio)
    params = params.set('serviceArea', requestBody.serviceArea)
    params = params.set('statusId', requestBody.statusId)
    return this.http.get(CVA_URLS.GetCustomers_LIST, { params });
  }
  GetProjectsList(object: any) {
    let params = new HttpParams()
    params = params.set('AccountId', object.AccountId)
    params = params.set('EmpemidsId', object.empEmidsId)
    return this.http.get(CVA_URLS.GetProjects, { params });
  }
  GetAccountsList(empEmidsId) {
    return this.http.get(CVA_URLS.GetAccounts + empEmidsId);

  }
  GetEmployeeList() {
    return this.http.get(CVA_URLS.GetEmployees);
  }
  saveCustomerValueAdd(requestBody) {
    return this.http.post(CVA_URLS.CREATE_CVA, requestBody);
  }
  GetEditDetails(Id) {
    return this.http.get(CVA_URLS.EditDetails + Id);
  }
  updateCVADetails(requestBody) {
    return this.http.post(CVA_URLS.UPDATE_CVA, requestBody);

  }
  GetStudioDetails() {
    return this.http.get(CVA_URLS.GetStudioDetails);
  }
  GetStatusDetails() {
    return this.http.get(CVA_URLS.GetStatusDetails);
  }
  GetRoleType(EmpEmidsId) {
    return this.http.get(CVA_URLS.GetRoleType + EmpEmidsId);
  }
  GetCategoryList() {
    return this.http.get(CVA_URLS.GetAllCategories);
  }
  GetServiceAreaList() {
    return this.http.get(CVA_URLS.GetAllServiceArea);
  }
}

