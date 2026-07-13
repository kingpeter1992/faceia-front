import { Injectable, signal, inject } from '@angular/core';
import { ComptageService } from './ComptageService';
import { ComptageResponse } from '../models/culte.model';
import { Toast } from '../../../shared/utilities/Toast';

@Injectable({ providedIn: 'root' })
export class ComptageStore {

  private comptageService = inject(ComptageService);
  private  toast = inject(Toast)
  private _loading = signal(false);
  private _error = signal<string | null>(null);
  private _comptages = signal<any[]>([]); // S'adapte au type retourné par votre backend
  private _loaded = signal(false);

  // Expositions Readonly pour les composants
  loading = this._loading.asReadonly();
  error = this._error.asReadonly();
  comptages = this._comptages.asReadonly();

  /**
   * Charger tous les comptages si non présents en cache
   */
  loadAllIfNeeded() {
    if (this._loaded()) {
      return;
    }
    this.loadAll();
  }

  /**
   * Forcer le rechargement global
   */
  loadAll() {
    this._loading.set(true);
    this.comptageService.getAll().subscribe({
      next: (response) => {
        // ✅ CORRECTION : On affecte directement la réponse car le service retourne le tableau directement
        this._comptages.set(response);
        console.log('Comptages chargés avec succès :', response); // ✅ Log pour le succès
        this._loaded.set(true);
        this._loading.set(false);
      },
      error: () => {
        this._error.set('Erreur lors du chargement des comptages');
        this._loading.set(false);
      }
    });
  }

  /**
   * Récupérer ou charger le comptage d'un culte spécifique
   */
  getByCulteId(culteId: number, onLoaded?: (comptage: any) => void) {
    // 1. Recherche instantanée dans le cache local
    const cached = this._comptages().find(c => c.culteId === culteId);
    if (cached) {
      onLoaded?.(cached);
      return;
    }

    // 2. Si absent du cache, interrogation de l'API
    this._loading.set(true);
    // ✅ CORRECTION : Alignement sur le nom exact de la méthode du service (getByIdCulte)
    this.comptageService.getByIdCulte(culteId).subscribe({
      next: (res) => {
        this._loading.set(false);
        if (res) {
          this._comptages.update(list => [...list, res]);
          onLoaded?.(res);
        }
      },
      error: () => {
        this._loading.set(false);
        // Ne bloque pas l'application si aucun comptage n'a encore été créé pour ce culte
        this._error.set('Aucun enregistrement trouvé pour ce culte');
      }
    });
  }

  /**
   * Sauvegarder ou modifier un comptage (avec mise à jour du cache)
   */
  save(comptageData: any, onSuccess?: () => void) {
    this._loading.set(true);
    this.comptageService.saveOrUpdate(comptageData).subscribe({
      next: (res) => {
        const updated = res;
        // Si le comptage existait déjà dans la liste, on le remplace, sinon on l'ajoute
        this._comptages.update(list => {
          const exists = list.some(c => c.id === updated.id);
          if (exists) {
            return list.map(c => c.id === updated.id ? updated : c);
          } else {
            return [updated, ...list];
          }
        });

        this._loading.set(false);
        this.resetError();
        onSuccess?.();
        console.log('Comptage enregistré avec succès :', updated); // ✅ Log pour le succès
        this.toast.success('Comptage enregistré avec succès !'); // ✅ Notification de succès

      },
      error: () => {
        this._error.set("Erreur lors de l'enregistrement du comptage");
        this._loading.set(false);
      }
    });
  }

  /**
   * Supprimer un comptage du cache et de la base de données
   */
  delete(id: number, onSuccess?: () => void) {
    this._loading.set(true);
    this.comptageService.delete(id).subscribe({
      next: () => {
        this._comptages.update(list => list.filter(c => c.id !== id));
        this._loading.set(false);
        onSuccess?.();
      },
      error: () => {
        this._error.set('Erreur lors de la suppression du comptage');
        this._loading.set(false);
      }
    });
  }

  resetError() {
    this._error.set(null);
  }

  clearCache() {
    this._comptages.set([]);
    this._loaded.set(false);
  }
}
