import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { MsalService } from '@azure/msal-angular';
import { retry, catchError } from "rxjs/operators";
import { ToastService } from '../common/toast/toast.service';
// import { NgxSpinnerService } from "ngx-spinner";

import { API_STATUS_CODE } from '../common/configuration.settings';
import { AUTH_TOKEN_URLS } from '../common/common.url-config';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {

  constructor(private msalService: MsalService) { }


  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = sessionStorage.getItem('customToken');
    if (token && request.url !== AUTH_TOKEN_URLS.GET_CUSTOM_TOKEN) {
      request = request.clone({ headers: request.headers.set('token', token) });
    }
    return next.handle(request)
      .pipe(
        retry(1),
        catchError((error: HttpErrorResponse) => {
          let errorMessage = '';
          if (error.error instanceof ErrorEvent) {
            // client-side error
            errorMessage = `Error: ${error.error.message}`;
          } else {
            // server-side error
            switch (error.status) {
              case API_STATUS_CODE.badRequest:      //bad request
                errorMessage = 'Please try again!';
                break;
              case API_STATUS_CODE.unauthorised:      //unauthorised
                errorMessage = 'Please login again!';
                this.msalService.logout();
                break;
              case API_STATUS_CODE.forbidden:     //forbidden
                errorMessage = 'Access denied!';
                sessionStorage.clear();
                this.msalService.logout();
                break;
              case API_STATUS_CODE.notfound:     //not found
                errorMessage = 'Unable to get result!';
                break;
              case API_STATUS_CODE.internalServerError:     //Internal Server error
                errorMessage = 'Something went wrong. Please try again!';
                break;

              default:
                errorMessage = 'Something went wrong. Please try again!';
            }
            // this.toastService.showWarning(error.error, 'Alert');
            return throwError(errorMessage);
          }
        })
      )
  }
}
