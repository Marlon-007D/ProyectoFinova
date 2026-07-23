import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private toastsSubject = new Subject<Toast>();
  toasts$ = this.toastsSubject.asObservable();

  showSuccess(title: string, message: string = '') {
    this.addToast('success', title, message);
  }

  showError(title: string, message: string = '') {
    this.addToast('error', title, message);
  }

  showInfo(title: string, message: string = '') {
    this.addToast('info', title, message);
  }

  private addToast(type: 'success' | 'error' | 'info', title: string, message: string) {
    const id = Math.random().toString(36).substring(2, 9);
    this.toastsSubject.next({ id, type, title, message });
  }
}
