import { computed, Injectable, signal } from '@angular/core';
import { CulteResponse } from '../models/culte.model';
import { CulteService } from './CulteService';
import { EventInput } from '@fullcalendar/core/index.js';

@Injectable({ providedIn: 'root' })
export class CulteStore {

  private _loading = signal(false);
  private _error = signal<string | null>(null);
  private _cultes = signal<CulteResponse[]>([]);

  loading = this._loading.asReadonly();
  error = this._error.asReadonly();
  cultes = this._cultes.asReadonly();


  // 🔥 CACHE FLAG
  private _loaded = signal(false);

  constructor(private culteService: CulteService) { }

  // 🚀 LOAD ONLY IF NEEDED
  loadAllIfNeeded() {

    if (this._loaded()) {
      return; // ⛔ déjà en cache
    }

    this.loadAll();
  }


getById(id: number, onLoaded?: (culte: CulteResponse) => void) {
  // 1. chercher dans le cache
  const cached = this._cultes().find(c => c.id === id);
  if (cached) {
    onLoaded?.(cached);
    return;
  }

  // 2. sinon API
  this._loading.set(true);
  this.culteService.getById(id).subscribe({
    next: (res) => {
      this._loading.set(false);
      // optionnel: ajouter dans le cache
      this._cultes.update(list => [...list, res]);
      onLoaded?.(res);
    },

    error: () => {
      this._loading.set(false);
      this._error.set('Culte introuvable');
    }
  });
}


  // 🔄 FORCE LOAD
  loadAll() {
    this._loading.set(true);
    this.culteService.getAll().subscribe({
      next: (response) => {
        this._cultes.set(response.data);
        this._loaded.set(true);
        this._loading.set(false);
        console.log('CulteStore: cultes chargés', response.data);
      },
      error: () => {
        this._error.set('Erreur chargement cultes');
        this._loading.set(false);
      }
    });
  }

  // 🧹 CLEAR CACHE (logout)
  clearCache() {
    this._cultes.set([]);
    this._loaded.set(false);
  }

  // CREATE
  create(formData: FormData, onSuccess?: () => void) {

  console.log('========== FormData envoyé ==========');

  formData.forEach((value, key) => {
    console.log(`${key} :`, value);
  });

  console.log('====================================');

  this._loading.set(true);

  this.culteService.create(formData).subscribe({
    next: (res) => {
      this._cultes.update(list => [res, ...list]);
      this._loading.set(false);
      onSuccess?.();
    },
    error: () => {
      this._error.set('Erreur création culte');
      this._loading.set(false);
    }
  });
}


  update(id: number, formData: FormData, onSuccess?: () => void) {
  this._loading.set(true);
  this.culteService.update(id, formData).subscribe({
    next: (res: any) => {
      // 🔥 update du cache (remplace l'ancien culte)
      const updated = res as CulteResponse;
      this._cultes.update(list => list.map(c => c.id === id ? updated : c));
      this._loading.set(false);
      onSuccess?.();
    },

    error: () => {

      this._error.set('Erreur modification culte');

      this._loading.set(false);

    }

  });

}
  resetError() {
    this._error.set(null);
  }

events = computed<EventInput[]>(() =>
  this._cultes().map(c => ({
    id: c.id.toString(),
    title: c.nom,
    start: c.dateDebut,
    end: c.dateFin,
    backgroundColor: this.getColor(c.nom),
    borderColor: this.getColor(c.nom),
    textColor: '#fff',
    extendedProps: c
  }))

);

private getColor(nom: string): string {
  const value = nom.toLowerCase();
  if (value.includes('enseignement')) return '#2563eb';
  if (value.includes('prière')) return '#16a34a';
  if (value.includes('jeunesse')) return '#f97316';
  if (value.includes('conférence')) return '#9333ea';
  return '#64748b';
}
}
