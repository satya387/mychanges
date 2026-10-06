import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MailBoxLogService {

  private BASE_URL = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }

  public getEmailsList(): any {
    const url = `${this.BASE_URL}DeliveryDashboard/GetMailBoxLogDetails`;
    return this.http.get<any>(url)
      .pipe(
        catchError(this.handleError));
  }

  public getEmailById(id: number): any {
    const url = `${this.BASE_URL}DeliveryDashboard/GetMailBoxLog?id=${id}`;
    return this.http.get<any>(url)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: any): Observable<any> {
    console.error('An error occurred:', error);
    throw error;
  }
}
