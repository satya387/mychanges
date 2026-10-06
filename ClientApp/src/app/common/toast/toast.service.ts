import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private toastr: ToastrService) {
  }

  showSuccess(message, title,duration: number = 5000) {
    this.toastr.success(message, title,{
      timeOut: duration
    })
  }

  showError(message, title,duration: number = 5000) {
    this.toastr.error(message, title, {
      timeOut: duration
    })
  }

  showInfo(message, title) {
    this.toastr.info(message, title)
  }

  showWarning(message, title) {
    this.toastr.warning(message, title)
  }
  clear() {
    this.toastr.clear();  
  }

}
