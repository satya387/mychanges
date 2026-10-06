import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private toastr: ToastrService) {
  }

  showSuccess(message, title, toasrAwaitTime = 8000) {
    this.toastr.success(message, title, {timeOut: toasrAwaitTime})
  }

  showError(message, title, toasrAwaitTime = 5000) {
    this.toastr.error(message, title, {timeOut: toasrAwaitTime})
  }

  showInfo(message, title, toasrAwaitTime = 5000) {
    this.toastr.info(message, title, {timeOut: toasrAwaitTime})
  }

  showWarning(message, title, toasrAwaitTime = 5000) {
    this.toastr.warning(message, title, {timeOut: toasrAwaitTime})
  }


}
