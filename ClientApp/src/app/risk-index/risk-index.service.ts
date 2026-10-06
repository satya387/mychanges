import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RI_URLS } from './risk-index.url-config';

@Injectable({
  providedIn: 'root'
})

export class RiskIndexService {

  constructor(private http: HttpClient) { }

  getProjectRiskIndexDetails(requestBody) {
    return this.http.post(RI_URLS.PROJECT_RISK_INDEX_DETAILS, requestBody);
  }
  addRiskIndexDetails(requestBody) {
    return this.http.post(RI_URLS. ADD_RISK_INDEX_DETAILS, requestBody);
  }
}