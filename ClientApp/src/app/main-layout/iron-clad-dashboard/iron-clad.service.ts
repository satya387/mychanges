import { Injectable } from '@angular/core';
import { HttpClient, HttpBackend } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { IronCladContractDetails } from './iron-clad.model';
import { HttpHeaders } from '@angular/common/http';

const BASE_URL = environment.apiBaseUrl;
const GET_LIST_URL = BASE_URL + 'CustomerContractReview/get-customer-contract-list';
const GET_ENTITY_LIST_URL = BASE_URL + 'CustomerContractReview/get-entity-list';
const Delete_URL = BASE_URL + 'CustomerContractReview/delete-contract';
const UPLOAD_DOCUMENT_URL = BASE_URL + 'CustomerContractReview/UploadSupportDocuments';
export interface IronCladAttachment {
  attachmentId: number;
  contractId: number;
  contractAttachment: string;
  createdDate: string;
}

@Injectable({ providedIn: 'root' })
export class IronCladService {private httpWithoutInterceptor: HttpClient;
  constructor(private http: HttpClient,handler: HttpBackend) { this.httpWithoutInterceptor = new HttpClient(handler); }
  getList(
  pageNumber: number = 1,
  pageSize: number = 10,
  search: string = '',
  stage: string = 'All'
): Observable<any> {

  return this.http.get<any>(
    GET_LIST_URL,
    {
      params: {
        pageNumber: pageNumber.toString(),
        pageSize: pageSize.toString(),
        search,
        stage
      }
    }
  );
}

  add(model: FormData): Observable<any> {
    const url = BASE_URL + 'CustomerContractReview/submit-contract';
    return this.http.post(url, model);
  }

   update(model: FormData): Observable<any> {
  return this.http.put(
    `${environment.apiBaseUrl}CustomerContractReview/update-contract`,
    model
  );
}

getFiles(contractId: number) {
  return this.http.get(
    `${BASE_URL}CustomerContractReview/get-contract-files?contractId=${contractId}`
  );
}

   // Entity Dropdown API
  getEntityList(): Observable<any[]> {
    return this.http.get<any[]>(GET_ENTITY_LIST_URL);
  }

  
// GET BY ID
getById(contractId: number) {
  return this.http.get<any>(
    `${BASE_URL}CustomerContractReview/get-contract-byid?contractId=${contractId}`
  );
}
  
getDocumentTypes(parentId: number = 0): Observable<any[]> {
  return this.http.get<any[]>(
    `${BASE_URL}CustomerContractReview/GetDocumentTypes?parentNameId=${parentId}`
  );
}

  delete(id: number) {
  return this.http.delete(`${Delete_URL}?Id=${id}`);
}

uploadDocument(files: File[], contractId: number): Observable<any> {
  const formData = new FormData();

  files.forEach(file => {
    formData.append('files', file, file.name);
  });

  formData.append('contractId', contractId.toString().trim());

  return this.http.post(
    `${BASE_URL}CustomerContractReview/UploadSupportDocuments`,
    formData
  );
}


openDocument(contractId: number | string, fileName: string): Observable<any> {
  return this.http.get(
    `${BASE_URL}CustomerContractReview/open-document?contractId=${contractId}&fileName=${fileName}`
  );
}

createVersionAndEdit(
  contractId: number,
  fileName: string
): Observable<any> {

  return this.http.get<any>(
    `${BASE_URL}CustomerContractReview/create-version-and-edit`,
    {
      params: {
        contractId: contractId.toString(),
        fileName
      }
    }
  );
}

getDocumentVersions(
  contractId: number,
  fileName: string
): Observable<any[]> {

  return this.http.get<any[]>(
    `${environment.apiBaseUrl}CustomerContractReview/document-versions`,
    {
      params: {
        contractId: contractId.toString(),
        fileName: fileName
      }
    }
  );
}

viewDocument(
  contractId: number,
  fileName: string
): Observable<any> {

  return this.http.get(
    `${BASE_URL}CustomerContractReview/viewdoc`,
    {
      params: {
        contractId: contractId.toString(),
        fileName
      }
    }
  );
}
viewPdf(
  contractId: number,
  fileName: string
): string {

  return `${BASE_URL}CustomerContractReview/view-pdf?contractId=${contractId}&fileName=${encodeURIComponent(fileName)}`;
}
checkTemplateStatus(documentId: number) {
  return this.http.get<any>(
    `${BASE_URL}/check-template-status?documentId=${documentId}`
  );
}
GetAccessTypebyEmpId(){
  return this.http.get<any>(
    `${BASE_URL}CustomerContractReview/get-AccessType-byid`
  );
}
SaveApprover(data: any) {
  return this.http.post<any>(`${BASE_URL}CustomerContractReview/Update-Reviewer`, data);
}
SubmmitApproval(data: any) {
  console.count('SubmmitApproval Service');
  return this.http.post<any>(`${BASE_URL}CustomerContractReview/Submmit-Approval`, data);
}
// SubmmitApproval(data: any) {
//    console.count('SubmmitApproval Service');
//   return this.httpWithoutInterceptor.post<any>(
//     `${BASE_URL}IronCald/Submmit-Approval`,
//     data
//   );
// }
GetTimeLineList(id: number){
 return this.http.get<any>(
    `${BASE_URL}CustomerContractReview/get-TimeLine-byid?Id=${id}`
  );
}

  getFilesByContractId(contractId: number) {
     return this.http.get<IronCladAttachment[]>(`${BASE_URL}CustomerContractReview/get-contract-files?contractId=${contractId}`); 
  }
  getFilesByContractIdwithoutloader(contractId: number) {
      const token = sessionStorage.getItem('customToken');
     return this.httpWithoutInterceptor.get<IronCladAttachment[]>(`${BASE_URL}CustomerContractReview/get-contract-files?contractId=${contractId}`,
      {
      headers: new HttpHeaders({
        token: token || ''
      })
    }
    );

  }
  GetProjectbyEmpId(accountId: number) {
      return this.http.get(
        `${BASE_URL}CustomerContractReview/Get_ProjectListbyId?accountId=${accountId}`
      );
    }
     GetAccountListbyEmpId(){
        return this.http.get(`${BASE_URL}CustomerContractReview/Get_AccountListbyId`);
      }
      GetContractReviwer(){
        return this.http.get(`${BASE_URL}CustomerContractReview/Get-Contract-Reviwer`);
      }
 }
