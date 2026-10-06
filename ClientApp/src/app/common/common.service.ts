import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'lodash';
import { Subject } from 'rxjs/internal/Subject';

import { AUTH_TOKEN_URLS } from './common.url-config';
import { SECTION_URLS } from '../admin/section/section.url-config';
import { CONTENT_URLS } from '../admin/content/content.url-config';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  appLogout$ = new Subject();

  constructor(private http: HttpClient) { }

  getCustomToken(data) {
    return this.http.post(AUTH_TOKEN_URLS.GET_CUSTOM_TOKEN, data);
  }

  getImageUrl(data) {
    return this.http.post(AUTH_TOKEN_URLS.GET_IMAGE_URL, data);
  }

  //Get banner list
  getBannerImages() {
    return this.http.get(CONTENT_URLS.GET_BANNER_IMAGES);
  }

  // Mutating roles object as per the requirement
  modifyResponseObject(dataList, idProperty, nameProperty) {
    if (dataList?.length) {
      map(dataList, (item) => {
        item.id = item[idProperty];
        item.name = item[nameProperty];
      })
    }
  }

  homeSectionList(userId) {
    return this.http.get(SECTION_URLS.HOME_SECTION_LIST + userId);
  }

  getProfileImage() {
    return this.http.get(AUTH_TOKEN_URLS.GET_PROFILE + 'TL0052');
  }

  // Trigger the subscription
  logOutApplication(isSessionLoggedOut) {
    this.appLogout$.next(isSessionLoggedOut);
  }

  // Returns the observable
  updateHeaderFooter() {
    return this.appLogout$.asObservable();
  }


  removeCachedData(empAuthId) {
    const userData = JSON.parse(sessionStorage.getItem('userDetail'));
    return this.http.get(CONTENT_URLS.REMOVE_CACHED_DATA + empAuthId + userData.Environment);
  }
checkCodeOfConductAcceptance(){
  return this.http.get(CONTENT_URLS.check_CodeOfConduct_Acceptance);
}
acceptCodeOfConduct(){
  return this.http.get(CONTENT_URLS.Accept_codeOfConduct_);
}
}
