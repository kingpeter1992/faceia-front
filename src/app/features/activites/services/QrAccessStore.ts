import { Injectable, signal } from '@angular/core';
import { finalize, Observable } from 'rxjs';

import { QrAccessService } from './QrAccessService';

import {
  ComptageResponse,
  GenerateQrResponse,
  ValidateQrResponse,
  PublicComptageRequest
} from '../models/culte.model';

@Injectable({
  providedIn: 'root'
})
export class QrAccessStore {

  constructor(
    private service: QrAccessService
  ) {}

  /* ===========================
      SIGNALS
  =========================== */

  private _qr = signal<GenerateQrResponse | null>(null);
  readonly qr = this._qr.asReadonly();

  private _selected = signal<ComptageResponse | null>(null);
  readonly selected = this._selected.asReadonly();

  private _validation = signal<ValidateQrResponse | null>(null);
  readonly validation = this._validation.asReadonly();

  private _loading = signal(false);
  readonly loading = this._loading.asReadonly();

  private _error = signal<string | null>(null);
  readonly error = this._error.asReadonly();

  /* ===========================
      CHARGER LE COMPTAGE
  =========================== */

  loadByCulte(culteId: number): void {

    this._loading.set(true);

    this._error.set(null);

    this.service
      .getComptageByCulte(culteId)
      .pipe(
        finalize(() => this._loading.set(false))
      )
      .subscribe({

        next: response => {

          this._selected.set(response);

        },

        error: err => {

          this._selected.set(null);

          this._error.set(
            err.error?.message ??
            'Impossible de charger le comptage.'
          );

        }

      });

  }

  /* ===========================
      SAUVEGARDE ADMIN
  =========================== */

  save(payload: any): Observable<ComptageResponse> {

    return this.service.saveInternalComptage(
      payload.culteId,
      payload
    );

  }

  /* ===========================
      GENERATION QR
  =========================== */

  generate(
    culteId: number,
    callback?: () => void
  ): void {

    this._loading.set(true);

    this._error.set(null);

    this.service
      .generate(culteId)
      .pipe(
        finalize(() => this._loading.set(false))
      )
      .subscribe({

        next: response => {

          this._qr.set(response);

          callback?.();

        },

        error: err => {

          this._error.set(
            err.error?.message ??
            'Erreur génération QR.'
          );

        }

      });

  }

  /* ===========================
      VALIDATION
  =========================== */

  validate(
    token: string,
    callback?: () => void
  ): void {

    this._loading.set(true);

    this._error.set(null);

    this.service
      .validate(token)
      .pipe(
        finalize(() => this._loading.set(false))
      )
      .subscribe({

        next: response => {

          this._validation.set(response);

          callback?.();

        },

        error: err => {

          this._validation.set(null);

          this._error.set(
            err.error?.message ??
            'QR invalide ou expiré.'
          );

        }

      });

  }

  /* ===========================
      SOUMISSION PUBLIQUE
  =========================== */

  submit(
    token: string,
    request: PublicComptageRequest,
    callback?: () => void
  ): void {

    this._loading.set(true);

    this._error.set(null);

    this.service
      .submit(token, request)
      .pipe(
        finalize(() => this._loading.set(false))
      )
      .subscribe({

        next: () => {

          callback?.();

        },

        error: err => {

          this._error.set(
            err.error?.message ??
            'Erreur lors de la soumission.'
          );

        }

      });

  }

  /* ===========================
      REVOQUER
  =========================== */

  revoke(
    token: string,
    callback?: () => void
  ): void {

    this._loading.set(true);

    this._error.set(null);

    this.service
      .revoke(token)
      .pipe(
        finalize(() => this._loading.set(false))
      )
      .subscribe({

        next: () => {

          this._qr.set(null);

          callback?.();

        },

        error: err => {

          this._error.set(
            err.error?.message ??
            'Impossible de révoquer le QR.'
          );

        }

      });

  }

}
