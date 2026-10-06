import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';

// Define a counter variable to track the number of calls

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PO_URLS } from './purchase-order.url-config';
@Injectable({
  providedIn: 'root'
})
export class PurchaseOrderService {
  private isUploadInProgress: boolean = false;
   uploadCallCount : 0;

  constructor(private http: HttpClient) { }
 
 GetPODetails(requestBody){
    debugger;
    let params=new HttpParams()
    params=params.set('PageNumber',requestBody.PageNumber)
    params=params.set('PageSize',requestBody.PageSize)
    params=params.set('EmpEmidsId',requestBody.EmpEmidsId)
    params=params.set('SearchValue',requestBody.SearchValue)
    params=params.set('Status',requestBody.Status)


  return this.http.get(PO_URLS.PO_LIST,{params});
 }
 savePurchaseOrder(formData: FormData) {
    debugger;
    const headers = new HttpHeaders({
      'Accept': 'application/json'
    });
    return this.http.post(PO_URLS.CREATE_PO,  formData, { headers });
  }
  GetPOEditDetails(Id){
    return this.http.get(PO_URLS.POEditDetails+ Id);
  }
  GetPOUserDetails(EmpeMidsID){
    return this.http.get(PO_URLS.POUserPermissions+ EmpeMidsID);
  }
  updateTaxDetails(updatedItems){
    debugger;
    return this.http.post(PO_URLS.UPDATE_Tax, updatedItems);
  
  }
  UpdatePurchaseOrder(formData: FormData) {
    debugger;
    const headers = new HttpHeaders({
      'Accept': 'application/json'
    });  
    
    return this.http.post(PO_URLS.UPDATE_PO,  formData, { headers });
  }
  
  rejectPurchaseOrder(requestBody){
    debugger;
    return this.http.put(PO_URLS.REJECT_PR_STATUS, requestBody)
}
  GetPRDetails(Id){
    debugger;
    return this.http.get(PO_URLS.PR_Details+ Id);
  }
  GetPRNumbers(Id, empEmidsId) {
    debugger;
    let params = new HttpParams()
    params = params.set('Id', Id)
    params = params.set('EmpEmidsId', empEmidsId)
    return this.http.get(PO_URLS.PR_Numbers, { params });
  }
  //  GetPOFile(FileName){
  //   return this.http.get(PO_URLS.GET_POFile+ FileName);
  // }
  getPdf(requestBody): Observable<HttpResponse<any>> {
    return this.http.post<HttpResponse<any>>(
      PO_URLS.GET_POFile, requestBody, 
      {
        responseType: 'blob' as 'json',
        observe: 'response' as 'body'
      });
  }
  getUploadFIle(requestBody): Observable<HttpResponse<any>> {
    debugger;
    return this.http.post<HttpResponse<any>>(
      PO_URLS.Download_Doc, requestBody, 
      {
        responseType: 'blob' as 'json',
        observe: 'response' as 'body'
      });
  }
  UploadPdf(requestBody): Observable<HttpResponse<any>> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    var res =  this.http.post<HttpResponse<any>>(PO_URLS.DOWNLOAD_PDF, requestBody, {
      headers: headers,
      responseType: 'blob' as 'json',
      observe: 'response' as 'body'
    });
    return res;
  }
  updatePurchaseOrderStatus(requestBody){
    return this.http.put(PO_URLS.UPDATE_PO_STATUS, requestBody)
}

// Method to upload files
uploadFiles(id: string, files: FileList, headers: HttpHeaders) {
 
  const formData: FormData = new FormData();
  for (let i = 0; i < files.length; i++) {
    formData.append('files', files[i], files[i].name);
  }
  formData.append('id', id.toString());

  // Make the HTTP POST request
  return this.http.post(PO_URLS.UPLOAD_SP_FILES, formData, { headers })
   
}
downloadExcelDump(requestBody): Observable<HttpResponse<any>> {
  const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  var res =  this.http.post<HttpResponse<any>>(PO_URLS.GET_PO_EXCEL_DUMP, requestBody, {
    headers: headers,
    responseType: 'blob' as 'json',
    observe: 'response' as 'body'
  });
  return res;
}
}

