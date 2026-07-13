import { WritableSignal } from '@angular/core';
import { Observable, finalize } from 'rxjs';

export interface StoreActionOptions<T> {
  request$: Observable<T>;

  loading: WritableSignal<boolean>;
  error: WritableSignal<string | null>;
  success?: WritableSignal<string | null>;

  successMessage?: string;
  errorMessage?: string;

  onSuccess?: (result: T) => void;
  onError?: (error: any) => void;

  toast?: {
    success?: (message: string) => void;
    error?: (message: string) => void;
  };
}

export function executeStoreAction<T>(
  options: StoreActionOptions<T>
): void {
  options.loading.set(true);
  options.error.set(null);

  if (options.success) {
    options.success.set(null);
  }

  options.request$
    .pipe(
      finalize(() => options.loading.set(false))
    )
    .subscribe({
      next: result => {
        if (options.successMessage) {
          options.success?.set(options.successMessage);
          options.toast?.success?.(options.successMessage);
        }

        options.onSuccess?.(result);
      },

      error: err => {
        const message =
          err?.error?.message ||
          options.errorMessage ||
          'Une erreur est survenue.';

        options.error.set(message);
        options.toast?.error?.(message);
        options.onError?.(err);
      }
    });
}
