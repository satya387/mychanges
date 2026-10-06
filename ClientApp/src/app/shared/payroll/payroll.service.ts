import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { PAYROLL_URLS } from './payroll.url-config';

@Injectable({
  providedIn: 'root'
})
export class PayrollService {
  viewAllTileDetail: any;

  constructor(private http: HttpClient) { }

  getPayrolAuthKey() {
    var a = this.http.get(PAYROLL_URLS.GET_PAYROLL_AUTH_KEY);
    return a;
    //.map((res: Response) => res.json());
  }
}
