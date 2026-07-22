import {Injectable,inject} from '@angular/core';
import {signal,computed } from '@angular/core';
import { MemberService } from './MemberService';

@Injectable({
providedIn:'root'
})

export class MemberStore {

private service = inject(MemberService);

// =========================
// STATE
// =========================
private _loading = signal(false);
private _success = signal(false);
private _error = signal<string|null>(null);


// =========================
// SELECTORS
// =========================
loading = computed(()=>this._loading());
success = computed(()=>this._success());
error = computed(()=>this._error());

// =========================
// ACTION
// =========================
registerVisitor(
  formData: FormData,
  successCallback?: () => void,
  errorCallback?: (error: any) => void
): void {

  this._loading.set(true);
  this._success.set(false);
  this._error.set(null);

  this.service.register(formData)
    .subscribe({

      next: (response) => {

        this._loading.set(false);
        this._success.set(true);
        successCallback?.();

      },

      error: (err) => {

        console.error(err);

        this._loading.set(false);

        this._error.set(
          "Erreur lors de l'inscription"
        );

        errorCallback?.(err);

      }

    });

}

reset(){
this._success.set(false);
this._error.set(null);
}
}
