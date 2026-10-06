import { HttpClient, HttpParams, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError, of  } from 'rxjs';
import {AM_URLS} from './asset-management.url-config'
import { map, catchError} from 'rxjs/operators';

export interface Employee {
  id: string;
  value: string;
}
@Injectable({
    providedIn:'root'
})

export class AssetManagementService {
    catchError: any
    
    constructor(private http: HttpClient){

    }
    getAssetManagement(requestBody){
        return this.http.post(AM_URLS.GET_ALL_AM_DETAILS,requestBody)
    }
    saveAssetManagement(requestBody: any) {
        debugger
        return this.http.post(AM_URLS.Save_AM_DETAILS, requestBody); 
     }
     getAssetById(requestBody: any){
        return this.http.post(AM_URLS.get_AssetBy_Id,requestBody)
    }
    SearchAssetManagement(requestBody){
        return this.http.post(AM_URLS.GETAMDETAILS_BYId,requestBody)
    }
    fetchAssetType(): Observable<any> {
        return this.http.get(AM_URLS.GET_ALL_Asset_DETAILS).pipe(
          map(response => {
            console.log('Response from fetchAssetType:', response); // Debugging line
            return response;
          }),
          catchError(error => {
            console.error('Error in fetchAssetType:', error); // Error handling
            return throwError(error);
          })
        );
    }
    getAssetAssigment(requestBody){
        return this.http.post(AM_URLS.GET_ALL_Assginment_DETAILS,requestBody)
    }
    getSoftwareDetails(requestBody){
      return this.http.post(AM_URLS.GET_ALL_Software_DETAILS,requestBody)
    }
    getHardwareDetails(requestBody){
      return this.http.post(AM_URLS.GET_ALL_Hardware_DETAILS,requestBody)
    }
    getAssginmentId(requestBody: any){
      debugger;
      return this.http.post(AM_URLS.get_AssginmentBy_Id,requestBody)
    }
    saveAssetAssginment(requestBody: any) {
      return this.http.post(AM_URLS.Save_AA_DETAILS, requestBody); 
    }
    fetchDeviceTypes(): Observable<any> {
      return this.http.get(AM_URLS.GET_ALL_Device_DETAILS).pipe(
        map(response => {
          console.log('Response from fetchDeviceTypes:', response); // Debugging line
          return response;
        }),
        catchError(error => {
          console.error('Error in fetchDeviceTypes:', error); // Error handling
          return throwError(error);
        })
      );
  }
  getAssetNumber(assetName){
    return this.http.get(AM_URLS.get_number+ assetName)
}
getAssetName(devicetype){
  return this.http.get(AM_URLS.get_namebytype+ devicetype)
}
fetchDeviceType(): Observable<any> {
  return this.http.get(AM_URLS.GET_ALL_Dece_DETAILS).pipe(
    map(response => {
      console.log('Response from fetchAssetType:', response); // Debugging line
      return response;
    }),
    catchError(error => {
      console.error('Error in fetchAssetType:', error); // Error handling
      return throwError(error);
    })
  );
}
SearchAssetAssginment(requestBody){ 
  return this.http.post(AM_URLS.GETAADETAILS_BYId,requestBody)
}
getEmployeeNameById(employeeName: string): Observable<Employee[]> {
  const url = `${AM_URLS.get_NAME}${employeeName}`; // Ensure URL is correctly formed
  console.log('Fetching from URL:', url); // Log the URL being fetched
  return this.http.get<Employee[]>(url).pipe(
    catchError(error => {
      console.error('Error fetching employee names:', error);
      return of([]); // Return an empty array on error
    })
  );
}
getEmployeeId(employeeName){
  return this.http.get(AM_URLS.get_EmpId+ employeeName)
}
SearchSoftwareDetails(requestBody){ 
  return this.http.post(AM_URLS.GETSOFTWAREDETAILS_BYId,requestBody)
}
SearchHardwareDetails(requestBody){ 
  return this.http.post(AM_URLS.GETHARDWAREDETAILS_BYId,requestBody)
}
getSoftwareById(requestBody: any){
  return this.http.post(AM_URLS.get_SoftwareBy_Id,requestBody)
}
getHardwareById(requestBody: any){
  return this.http.post(AM_URLS.get_HardwareBy_Id,requestBody)
}
SaveSoftwareDetails(requestBody: any) {
  return this.http.post(AM_URLS.Save_Software_DETAILS, requestBody); 
}
SaveHardwareDetails(requestBody: any) {
  return this.http.post(AM_URLS.Save_Hardware_DETAILS, requestBody); 
}
}