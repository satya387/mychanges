import { Injectable } from '@angular/core';
import { ToastService } from 'src/app/common/toast/toast.service';

@Injectable({
  providedIn: 'root'
})
export class DocumentWindowService {

  private openedWindows = new Map<string, Window>();

  constructor(private toastService: ToastService) {
    this.startPolling();
  }
  
  isOpen(fileName: string): boolean {

    const existingWindow =
      this.openedWindows.get(fileName);

    return !!existingWindow &&
           !existingWindow.closed;
  }


  open(fileName: string, url: string): void {

    const existingWindow = this.openedWindows.get(fileName);

    if (existingWindow && !existingWindow.closed) {

      existingWindow.focus();

      this.toastService.showInfo(
        'This document is already open.',
        'Information'
      );

      return;
    }

    const newWindow = window.open(url, '_blank');

    if (!newWindow) {

      this.toastService.showError(
        'Popup was blocked by the browser.',
        'Error'
      );

      return;
    }

    this.openedWindows.set(fileName, newWindow);

    this.toastService.showSuccess(
      'Document opened successfully.',
      'Success'
    );
  }

  private startPolling(): void {

    setInterval(() => {

      this.openedWindows.forEach((windowRef, key) => {

        if (windowRef.closed) {

          this.openedWindows.delete(key);

          this.toastService.showInfo(
            'Document has been closed.',
            'Information'
          );

        }

      });

    }, 1000);
  }
}