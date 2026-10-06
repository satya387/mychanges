import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ADMIN_URLS } from './admin.url-config';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient) { }

  getTilesList(){
    return this.http.get(ADMIN_URLS.TILES_LIST);
  }
}
