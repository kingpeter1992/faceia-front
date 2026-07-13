import { Injectable, signal } from '@angular/core';
import { DonationService } from './DonationService';
import { DonationResponse, DonationRequest } from '../models/DonationRequest';
@Injectable({ providedIn: 'root' })
export class DonationStore {

  private _loading = signal(false);
  private _error = signal<string | null>(null);
  private _donations = signal<DonationResponse[]>([]);

  loading = this._loading.asReadonly();
  error = this._error.asReadonly();
  donations = this._donations.asReadonly();

  private _loaded = signal(false);

  constructor(private donationService: DonationService) {}


   // 🚀 LOAD ONLY IF NEEDED
  loadAllIfNeeded() {

    if (this._loaded()) {
      return; // ⛔ déjà en cache
    }

    this.loadAll();
  }



    // 🔄 FORCE LOAD
  loadAll() {
    this._loading.set(true);
    this.donationService.getAll().subscribe({
      next: (response) => {
        this._donations.set(response.data);
        console.log('liste offrandes', response.data)
        this._loaded.set(true);
        this._loading.set(false);
      },
      error: () => {
        this._error.set('Erreur chargement cultes');
        this._loading.set(false);
      }
    });
  }



  // 📥 LOAD BY CULTE
  loadByCulte(culteId: number) {
    this._loading.set(true);
    this.donationService.getByCulte(culteId).subscribe({
      next: (res) => {
        this._donations.set(res);
        this._loaded.set(true);
        this._loading.set(false);
        console.log('liste offrandes pour le culte', res)
      },
      error: () => {
        this._error.set('Erreur chargement dons');
        this._loading.set(false);
        console.error('Erreur chargement dons pour le culte', this.error);
      }

    });
  }

  // ➕ CREATE SINGLE
  create(donation: DonationRequest, onSuccess?: (res: DonationResponse) => void) {

    this._loading.set(true);

    this.donationService.create(donation).subscribe({

      next: (res) => {

        this._donations.update(list => [res, ...list]);

        this._loading.set(false);
        onSuccess?.(res);
      },

      error: () => {
        this._error.set('Erreur création don');
        this._loading.set(false);
      }

    });
  }

  // 🚀 CREATE BULK
  createMany(culteId: number, rows: any[], onSuccess?: () => void) {

    const payload: DonationRequest[] = rows.map(r => ({
      culteId,
      donateur: r.donateur,
      montant: r.montant,
      devise: r.devise,
      date: r.date,
      operation: r.operation,
      typeDon: r.typeDon
    }));

    this._loading.set(true);
    console.log('offrande ENVOYEER', payload)
    this.donationService.createMany(payload).subscribe({

      next: (res) => {
        this._donations.update(list => [...res, ...list]);
        this._loading.set(false);
        onSuccess?.();
      },

      error: () => {
        this._error.set('Erreur création dons');
        this._loading.set(false);
      }

    });
  }

  // ✏️ UPDATE
  update(id: number, donation: DonationRequest, onSuccess?: (res: DonationResponse) => void) {

    this._loading.set(true);

    this.donationService.update(id, donation).subscribe({

      next: (res) => {

        this._donations.update(list =>
          list.map(d => d.id === id ? res : d)
        );

        this._loading.set(false);
        onSuccess?.(res);
      },

      error: () => {
        this._error.set('Erreur modification don');
        this._loading.set(false);
      }

    });
  }

  // 🗑 DELETE
  delete(id: number, onSuccess?: () => void) {

    this._loading.set(true);

    this.donationService.delete(id).subscribe({

      next: () => {

        this._donations.update(list =>
          list.filter(d => d.id !== id)
        );

        this._loading.set(false);
        onSuccess?.();
      },

      error: () => {
        this._error.set('Erreur suppression don');
        this._loading.set(false);
      }

    });
  }

  // 🧹 CLEAR CACHE
  clearCache() {
    this._donations.set([]);
    this._loaded.set(false);
  }

  resetError() {
    this._error.set(null);
  }
}
