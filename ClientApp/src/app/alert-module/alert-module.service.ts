import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Alert_URLS } from './alert-module.url-config';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AlertModuleService {

  constructor(private http: HttpClient) { }
  getAlertDetails(requestBody) {
    return this.http.post(Alert_URLS.GET_alert_details, requestBody);
  }
  GetAlertDetailsbyId(alertManagementId){
    return this.http.get(Alert_URLS.Get_AlertDetailsbyId+ alertManagementId);
  }

  GetAccountListbyEmpId(){
    return this.http.get(Alert_URLS.Get_AccountListbyId);
  }

  GetProjectbyEmpId(accountId: number) {
    return this.http.get(
      `${Alert_URLS.Get_ProjectListbyId}?accountId=${accountId}`
    );
  }
  
GetEscalationType(IsFilterData){
  return this.http.get(Alert_URLS.Get_EscalationType+ IsFilterData);
}
GetEscalationCategory(IsFilterData){
  return this.http.get(Alert_URLS.Get_EscalationCategory+ IsFilterData);
}
GetPersonsListbyProjId(projectId){
  debugger;
  return this.http.get(Alert_URLS.Get_PersonsListbyProjId+ projectId);
}
SubmitAlertDetails(requestBody) {
  return this.http.post(Alert_URLS.Submit_AlertDetails, requestBody);
}
UpdateAlertDetails(requestBody) {
  return this.http.put(Alert_URLS.Update_AlertDetails, requestBody);
}
getUploadFIle(requestBody: any): Observable<HttpResponse<any>> {
  debugger;
  return this.http.post<HttpResponse<any>>(
    Alert_URLS.Download_Doc, requestBody, 
    {
      responseType: 'blob' as 'json',
      observe: 'response' as 'body'
    });
}

Delete(empEmidsId: string, EscalationManagementId: number | null) {
  const accountParam = EscalationManagementId === null ? '' : `&EscalationManagementId=${encodeURIComponent(EscalationManagementId)}`;
  const url = `${Alert_URLS.DeleteById}?empEmidsId=${encodeURIComponent(empEmidsId)}${accountParam}`;
  return this.http.get(url);
}
DeleteAttachment(fileName: string, EscalationManagementId: number) {
  let params = new HttpParams()
    .set('fileName', fileName)
    .set('EscalationManagementId', EscalationManagementId.toString());

  return this.http.get(Alert_URLS.DeleteAttachments, { params });
}

GetAccountProjectListbyEmpId(accountId: number, searchText: string | null) {
  let params = new HttpParams().set('accountId', accountId.toString());
  if (searchText) params = params.set('searchText', searchText);

  return this.http.get(Alert_URLS.GetAccountProjectFilterdData, { params });
}

SubmitComments(isMarked: number, comments: string | null, escalationId?: number | null) {
  let params = new HttpParams()
    .set('IsMarked', String(isMarked === 1)); // 'true' or 'false'

  if (comments) params = params.set('comments', comments);
  if (escalationId != null) params = params.set('EscalationManagementId', String(escalationId));

  return this.http.post(Alert_URLS.Submitcomments, {}, { params });
}
GetTimeLineListbyId(EscalationManagementId){
  return this.http.get(Alert_URLS.Get_TimeLineListbyId+ EscalationManagementId);
}
GetEscalationPriority(IsFilterData){
  return this.http.get(Alert_URLS.Get_EscalationPriority+ IsFilterData);
}
GetDownloadALLDocuments(payload: any) {
  return this.http.post(
    Alert_URLS.DownloadALLDocuments,
    payload,
    {
      observe: 'response',
      responseType: 'blob'
    }
  );
}
GetEscalationStatus(IsFilterData){
  return this.http.get(Alert_URLS.Get_EscalationStatus+ IsFilterData);
}
}
