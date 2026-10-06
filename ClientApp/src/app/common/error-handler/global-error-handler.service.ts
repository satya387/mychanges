import { ErrorHandler, Inject, Injectable, Injector } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalErrorHandlerService implements ErrorHandler {


  constructor(@Inject(Injector) private readonly injector: Injector) { }

  handleError(error: any): void {
    console.log(error);
  }
}
