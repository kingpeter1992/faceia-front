import { computed, Injectable, signal } from "@angular/core";
import { GenerateQrRequest, QrAccess } from "../models/QrModule";
import { QrManagementService } from "./qr-management.service";
import { GenerateQrResponse, ValidateQrResponse } from "../../activites/models/culte.model";
import { Toast } from "../../../shared/utilities/Toast";
import { tap, finalize } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class QrManagementStore {


  constructor(
    private service: QrManagementService,
    private toast: Toast,
  ) { }

  /*=============================
          STATE
  =============================*/

  private _loading = signal(false);
  private _qrInfo = signal<ValidateQrResponse | null>(null);
  qrInfo = this._qrInfo.asReadonly();

  private _error = signal<string | null>(null);

  private _qrs = signal<GenerateQrResponse[]>([]);

  private _selected = signal<GenerateQrResponse | null>(null);

  /*=============================
         READONLY
  =============================*/

  loading = this._loading.asReadonly();

  error = this._error.asReadonly();

  qrs = this._qrs.asReadonly();

  selected = this._selected.asReadonly();

  /*=============================
        STATISTIQUES
  =============================*/

  qrActifs = computed(() =>
    this._qrs().filter(q => q.status === 'ACTIVE').length
  );

  qrExpires = computed(() =>
    this._qrs().filter(q => q.status === 'EXPIRED').length
  );

  qrUtilises = computed(() =>
    this._qrs().filter(q => q.status === 'USED').length
  );

  qrRevokes = computed(() =>
    this._qrs().filter(q => q.status === 'REVOKED').length
  );

  /*=============================
          LOAD
  =============================*/

  load() {
    this._loading.set(true);
    this._error.set(null);
    this.service.getAll().subscribe({
      next: data => {
        this._qrs.set(data);
        this._loading.set(false);
        console.log('list qr',data)
      },
      error: () => {
        this._loading.set(false);
        this._error.set("Impossible de charger les QR Codes");
      }
    });

  }

  /*=============================
        SELECT
  =============================*/

  select(qr: QrAccess) {

    this._selected.set(qr);

  }

  /*=============================
         GENERATE
  =============================*/

  generate(
    request: GenerateQrRequest,
    callback?: (qr: GenerateQrResponse) => void
  ) {

    this._loading.set(true);
    this._error.set(null);
    this.service.generate(request).subscribe({
      next: qr => {
        this._qrs.update(list => [
          qr,
          ...list
        ]);
        this._selected.set(qr);
        this._loading.set(false);
        callback?.(qr);
      },
      error: err => {
        this._loading.set(false);

        // Récupère le message envoyé par le backend
        const errorMessage = err.error?.reason || err.error?.message || "Erreur de génération du QR";
          console.log(err.error?.reason)
        this._error.set(errorMessage);

        // Affiche le toast PrimeNG
        this.toast.info(errorMessage)
          ;
      }

    });

  }

  /*=============================
          REVOKE
  =============================*/

  revoke(
    token: string,
    callback?: () => void
  ) {
    this._loading.set(true);
    this.service.revoke(token)
      .subscribe({
        next: () => {
          this._qrs.update(list =>
            list.map(q =>
              q.token === token
                ? {
                ...q,
                  status: 'REVOKED',
                  active: false
                }
                : q
            )
          );
          this._loading.set(false);
          callback?.();
        },
        error: err => {
          console.error(err);
          this._loading.set(false);
        }

      });

  }

  /*=============================
        REGENERATE
  =============================*/

  regenerate(
    token: string,
    callback?: () => void
  ) {
    this._loading.set(true);
    this.service.regenerate(token)
      .subscribe({
        next: qr => {
          this._qrs.update(list =>
            list.map(item =>
              item.token === token
                ? qr

                : item

            )

          );

          this._selected.set(qr);

          this._loading.set(false);

          callback?.();

        },

        error: err => {

          console.error(err);

          this._loading.set(false);

        }

      });

  }
validateToken(token:string){

  return this.service.validateToken(token);

}

delete(token: string, callback?: () => void) {
  this._loading.set(true);
  this.service.delete(token)
    .subscribe({
      next: () => {
        this._qrs.update(list =>
          list.filter(q => q.token !== token)
        );
        this._loading.set(false);
        callback?.();
      },
      error: () => {
        this._loading.set(false);
      }

    });

}

}
