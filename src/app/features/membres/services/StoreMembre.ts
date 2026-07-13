import { Injectable, signal } from '@angular/core';
import { Membre } from '../models/Membre';
import { ServiceMembre } from './ServiceMembre';

@Injectable({ providedIn: 'root' })
export class StoreMembre {

  // ✅ STATE
  private _loading = signal(false);
  private _error = signal<string | null>(null);
  private _membres = signal<Membre[]>([]);

  // ✅ READONLY (exposé au component)
  loading = this._loading.asReadonly();
  error = this._error.asReadonly();
  membres = this._membres.asReadonly();

  // ✅ CACHE FLAG
  private _loaded = signal(false);

  constructor(private service: ServiceMembre) {}

  // ✅ LOAD ONLY IF NOT CACHED
  loadAllIfNeeded() {
    if (this._loaded()) {
      return; // ✅ déjà chargé
    }
    this.loadAll();
  }

  // ✅ GET BY ID (CACHE FIRST)
  getById(id: number, onLoaded?: (membre: Membre) => void) {

    const cached = this._membres().find(m => m.id === id);

    if (cached) {
      onLoaded?.(cached);
      return;
    }

    this._loading.set(true);

    this.service.getById(id).subscribe({
      next: (res) => {
        this._loading.set(false);

        // ✅ OPTION: ajouter au cache
        this._membres.update(list => [...list, res]);

        onLoaded?.(res);
      },
      error: () => {
        this._loading.set(false);
        this._error.set('Membre introuvable');
      }
    });
  }

  // ✅ LOAD ALL
  loadAll() {
    this._loading.set(true);

    this.service.getAll().subscribe({
      next: (data) => {
        this._membres.set(data);   // ✅ direct
        this._loaded.set(true);
        this._loading.set(false);
        console.log('liste visite', data)
      },
      error: () => {
        this._error.set('Erreur chargement membres');
        this._loading.set(false);
      }
    });
  }

  // ✅ CLEAR CACHE
  clearCache() {
    this._membres.set([]);
    this._loaded.set(false);
  }

  // ✅ CREATE
  create(data: Membre, onSuccess?: () => void) {
    this._loading.set(true);

    this.service.create(data).subscribe({
      next: (res) => {
        this._membres.update(list => [res, ...list]); // ✅ push en haut
        this._loading.set(false);
        onSuccess?.();
      },
      error: () => {
        this._error.set('Erreur création membre');
        this._loading.set(false);
      }
    });
  }

  // ✅ UPDATE
  update(id: number, data: Membre, onSuccess?: () => void) {
    this._loading.set(true);

    this.service.update(id, data).subscribe({
      next: (res: Membre) => {

        this._membres.update(list =>
          list.map(m => m.id === id ? res : m)
        );

        this._loading.set(false);
        onSuccess?.();
      },
      error: () => {
        this._error.set('Erreur modification membre');
        this._loading.set(false);
      }
    });
  }

  // ✅ RESET ERROR
  resetError() {
    this._error.set(null);
  }
}
