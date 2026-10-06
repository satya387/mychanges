import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RR_URLS } from 'src/app/request-resource/request-resource.url-config';
import { CONTENT_URLS } from './content.url-config';

@Injectable({
  providedIn: 'root'
})
export class ContentService {

  constructor(private http: HttpClient) { }

  getAllContents(data) {
    return this.http.post(CONTENT_URLS.GET_CONTENT_LIST, data)
  }

  createContent(data) {
    return this.http.post(CONTENT_URLS.CREATE_CONTENT, data);
  }

  // edit Content
  editContent(data) {
    return this.http.post(CONTENT_URLS.UPDATE_CONTENT, data);
  }

  // delete Content
  deleteContent(data) {
    return this.http.post(CONTENT_URLS.DELETE_CONTENT, data);
  }

  //Update Content status
  changeContentStatus(data) {
    return this.http.post(CONTENT_URLS.UPDATE_CONTENT_STATUS, data);
  }

  //Get Content data
  getContentData(data) {
    return this.http.get(CONTENT_URLS.GET_CONTENT_DATA + data);
  }

  // country dropdown list
  getCountryDrop(){
    return this.http.get(RR_URLS.COUNTRY_LIST);
  }
}
