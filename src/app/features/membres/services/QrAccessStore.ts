import { Injectable, inject, signal } from '@angular/core';
import { finalize, Observable,tap } from 'rxjs';
import { QrAccessService } from '../../activites/services/QrAccessService';
import { GenerateQrResponse, ValidateQrResponse, PublicComptageRequest, ComptageResponse } from '../../activites/models/culte.model';

@Injectable({
  providedIn: 'root'
})
export class QrAccessStore {
  private readonly service = inject(QrAccessService);

  readonly loading = signal(false);
  readonly qr = signal<GenerateQrResponse | null>(null);
  readonly validation = signal<ValidateQrResponse | null>(null);
  readonly error = signal<string | null>(null);

  // 🌟 AJOUT : Signal pour stocker le comptage sélectionné par l'administrateur
  readonly selected = signal<ComptageResponse | null>(null);

  /**
   * 🌟 AJOUT : Charger le comptage interne existant pour un culte donné
   */
  loadByCulte(culteId: number) {
    this.loading.set(true);
    this.error.set(null);

    // Note : Assurez-vous que cette méthode 'getComptageByCulte' est bien déclarée dans votre QrAccessService (voir bloc suivant)
    this.service.getComptageByCulte(culteId)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (comptage) => {
          this.selected.set(comptage);
        },
        error: (err) => {
          this.error.set(err.error?.message ?? 'Erreur lors du chargement du comptage');
          this.selected.set(null);
        }
      });
  }

  /**
   * 🌟 AJOUT : Sauvegarder (créer ou mettre à jour) le comptage depuis l'administration
   */
save(payload: any): Observable<ComptageResponse> {

  this.loading.set(true);
  this.error.set(null);

  return this.service
    .saveInternalComptage(payload.culteId, payload)
    .pipe(

      tap(response => {

        this.selected.set(response);

      }),

      finalize(() => this.loading.set(false))

    );

}

  /* --- Vos méthodes initiales inchangées --- */
generate(culteId: number, callback?: () => void) {

  this.loading.set(true);
  this.error.set(null);

  this.service.generate(culteId)
    .pipe(finalize(() => this.loading.set(false)))
    .subscribe({
      next: response => {

        console.log('Réponse backend QR :', response);

        this.qr.set(response);

        console.log('Signal QR :', this.qr());

        callback?.();
      },

      error: err => {
        console.error(err);
        this.error.set(err.error?.message ?? 'Erreur génération QR');
      }
    });
}

validate(token:string){

 this.loading.set(true);

 this.service.validate(token)
 .subscribe({

   next:data=>{
     console.log("VALIDATION QR :",data);

     this.validation.set(data);
     this.loading.set(false);
   },

   error:err=>{
     console.error(err);

     this.error.set(
       "QR invalide ou expiré"
     );

     this.validation.set(null);
     this.loading.set(false);
   }

 });

}

  submit(token: string, request: PublicComptageRequest, callback?: () => void) {
    this.loading.set(true);
    this.error.set(null);
    this.service.submit(token, request).pipe(finalize(() => this.loading.set(false))).subscribe({
      next: () => { callback?.(); },
      error: err => { this.error.set(err.error?.message ?? 'Erreur enregistrement'); }
    });
  }
}
