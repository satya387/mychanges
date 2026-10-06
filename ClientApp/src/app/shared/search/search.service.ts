import { EventEmitter, Injectable } from '@angular/core';
import { environment } from "../../../environments/environment";
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SEARCH_URLS } from './Search-Url-config';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/internal/operators/map';

@Injectable({
  providedIn: 'root',
})

export class SearchComponentService {


  constructor(private http: HttpClient, private modalService: NgbModal, private _router: Router) { }



  //public confirm(
  //  title: string,
  //  message: string,
  //  btnOkText: string = 'viewAll',
  //  //btnCancelText: string = 'CANCEL',
  //  dialogSize: 'md' | 'lg' = 'md'
  //): Promise<boolean> {
  //  const modalRef = this.modalService.open(SearchComponent, {
  //    size: dialogSize,modalDialogClass:'search-box'
  //  });
  //  modalRef.componentInstance.title = title;
  //  modalRef.componentInstance.message = message;
  //  modalRef.componentInstance.btnOkText = btnOkText;
  //  //modalRef.componentInstance.btnCancelText = btnCancelText;

  //  return modalRef.result;
  //}


  public baseUrl = SEARCH_URLS.GET_SEARCH_LIST;
  public sharepoint_baseUrl = SEARCH_URLS.GET_SHAREPOINT_BASE_URL;


  getsearch(query: string): Observable<any> {
    if (query === "") {
      console.log("Not defined");
      return of(null)
    } else {
      //localStorage.removeItem('obj')
      let params = { searchText: query, sharepointurl: this.sharepoint_baseUrl }
      return this.http.get(this.baseUrl, { params })
    }
  }

}
