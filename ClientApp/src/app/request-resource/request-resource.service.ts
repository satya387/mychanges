import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RR_URLS } from './request-resource.url-config';

@Injectable({
  providedIn: 'root'
})
export class RequestResourceService {

  constructor(private http: HttpClient) { }

  getCountryList() {
    return this.http.get(RR_URLS.COUNTRY_LIST);
  }

  getTechnologyList() {
    return this.http.get(RR_URLS.TECHNOLOGY_LIST);
  }

  getCOEList() {
    return this.http.get(RR_URLS.COE_LIST);
  }

  getJobTitleList() {
    return this.http.get(RR_URLS.JOB_TITLE_LIST);
  }

  getExperienceList() {
    return this.http.get(RR_URLS.MIN_EXP_LIST);
  }

  getProficiencyList() {
    return this.http.get(RR_URLS.PROFICIENCY_LIST);
  }

  getProjectList() {
    return this.http.get(RR_URLS.PROJECT_LIST);
  }

  getReportingManagerList() {
    return this.http.get(RR_URLS.REPORTING_MANAGER_LIST);
  }

  getRequesterList() {
    return this.http.get(RR_URLS.REQUESTER_LIST);
  }

  getRolesList() {
    return this.http.get(RR_URLS.ROLES_LIST);
  }

  getWorkLocationList(countryName) {
    return this.http.get(RR_URLS.WORK_LOCATION_LIST + countryName);
  }

  getAccountList() {
    return this.http.get(RR_URLS.ACCOUNT_NAME_LIST);
  }

  getPreferredSkillsList() {
    return this.http.get(RR_URLS.PREFERRED_SKILLS_LIST);
  }

  getRRById(rrId) {
    return this.http.get(RR_URLS.GET_RR_BY_ID + rrId);
  }

  getProjectByAccountName(accountId) {
    return this.http.get(RR_URLS.GET_PROJECT_BY_ACCOUNT + accountId);
  }

  getResourceRequestGrid(requestBody) {
    return this.http.post(RR_URLS.RESOURCE_REQUEST_GRID, requestBody);
  }

  saveRequestResource(requestBody) {
    return this.http.post(RR_URLS.CREATE_RR, requestBody);
  }
}
