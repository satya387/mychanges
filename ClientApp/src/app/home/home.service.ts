import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
// import { Subject } from 'rxjs/Subject';
import { TILE_URLS } from '../admin/tiles/tiles.url-config';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  userName$ = new Subject();
  contentDetail: any;
  public showBanner: boolean = true;

  constructor(private http: HttpClient) { }

  // Trigger the subscription
  userNameUpdated(isUserNameUpdated) {
    this.userName$.next(isUserNameUpdated);
  }

  // Returns the observable
  updatedUserName() {
    return this.userName$.asObservable();
  }

  // // Trigger the subscription
  // setContentData(contentData) {
  //   this.contentDetail$.next(contentData);
  // }

  // // Returns the observable
  // getContentData() {
  //   return this.contentDetail$.asObservable();
  // }

  getTileDetailByTileCode(tileCode) {
    return this.http.get(TILE_URLS.GET_TILE_BY_TILECODE + tileCode );
  }
}
