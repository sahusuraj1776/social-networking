import { Injectable } from '@angular/core';
import Toastify from 'toastify-js';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

@Injectable({ providedIn: 'root' })
export class ToastService {
  // ✅ Same defaults as your React ToastContainer
  private readonly defaultDuration = 2000;
  private readonly defaultPosition: 'left' | 'center' | 'right' = 'right';
  private readonly defaultGravity: 'top' | 'bottom' = 'top';

  success(message: string): void {
    this.show(message, 'success');
  }

  error(message: string): void {
    this.show(message, 'error');
  }

  info(message: string): void {
    this.show(message, 'info');
  }

  warning(message: string): void {
    this.show(message, 'warning');
  }

  show(message: string, type: ToastType = 'info', duration = this.defaultDuration): void {
    Toastify({
      text: message,
      duration,
      gravity: this.defaultGravity,     // top/bottom
      position: this.defaultPosition,   // left/center/right
      close: true,
      stopOnFocus: true,
      style: {
        background: this.bg(type),
      },
    }).showToast();
  }

  private bg(type: ToastType): string {
    // “theme=colored” feel (similar to react-toastify colored theme)
    switch (type) {
      case 'success':
        return 'linear-gradient(to right, #16a34a, #22c55e)';
      case 'error':
        return 'linear-gradient(to right, #dc2626, #ef4444)';
      case 'warning':
        return 'linear-gradient(to right, #d97706, #f59e0b)';
      default:
        return 'linear-gradient(to right, #0284c7, #38bdf8)'; // info
    }
  }
}