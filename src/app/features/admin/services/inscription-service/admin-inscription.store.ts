import { Injectable, computed, inject, signal } from '@angular/core';
import { finalize } from 'rxjs';

import { AdminInscriptionService } from './admin-inscription.service';

import {
  AdminEtudiant,
  AdminFormationDisponible
} from '../../model/admin-inscription.model';

import { InscriptionDetailResponse } from '../../model/admin-user.model';
import { Toast } from '../../../../shared/utilities/Toast';

@Injectable({
  providedIn: 'root'
})
export class AdminInscriptionStore {

  private readonly service = inject(AdminInscriptionService);
  private readonly toast = inject(Toast);

  // =====================================================
  // PRIVATE STATE
  // =====================================================

  private _etudiants = signal<AdminEtudiant[]>([]);
  private _formations = signal<AdminFormationDisponible[]>([]);
  private _inscriptions = signal<InscriptionDetailResponse[]>([]);

  private _selectedEtudiantId = signal<number | null>(null);
  private _checkedFormationIds = signal<number[]>([]);

  private _search = signal('');
  private _studentSearch = signal('');

  private _loading = signal(false);
  private _error = signal<string | null>(null);
  private _success = signal<string | null>(null);

  // =====================================================
  // PUBLIC READONLY SIGNALS
  // =====================================================

  etudiants = this._etudiants.asReadonly();
  formations = this._formations.asReadonly();
  inscriptions = this._inscriptions.asReadonly();

  selectedEtudiantId = this._selectedEtudiantId.asReadonly();
  checkedFormationIds = this._checkedFormationIds.asReadonly();

  search = this._search.asReadonly();
  studentSearch = this._studentSearch.asReadonly();

  loading = this._loading.asReadonly();
  error = this._error.asReadonly();
  success = this._success.asReadonly();

  // =====================================================
  // COMPUTED
  // =====================================================

  formationsFiltrees = computed(() => {

    const q = this._search().toLowerCase().trim();

    return this._formations().filter(f =>
      !q ||
      f.titre?.toLowerCase().includes(q) ||
      f.description?.toLowerCase().includes(q) ||
      f.formateurNom?.toLowerCase().includes(q)
    );
  });

  totalChecked = computed(() =>
    this._checkedFormationIds().length
  );

  etudiantsFiltres = computed(() => {

    const q = this._studentSearch().toLowerCase().trim();

    return this._etudiants().filter(e =>
      e.role === 'ETUDIANT' &&
      (
        !q ||
        e.nom?.toLowerCase().includes(q) ||
        e.prenom?.toLowerCase().includes(q) ||
        e.email?.toLowerCase().includes(q)
      )
    );
  });

  selectedEtudiant = computed(() => {

    const id = this._selectedEtudiantId();

    return this._etudiants().find(e => e.id === id) || null;
  });

  // =====================================================
  // INIT
  // =====================================================

  init(): void {
    this.loadEtudiants();
    this.loadAllInscriptions();
  }

  // =====================================================
  // LOAD DATA
  // =====================================================

  loadEtudiants(): void {

    this._loading.set(true);
    this._error.set(null);

    this.service.getEtudiants()
      .pipe(
        finalize(() => this._loading.set(false))
      )
      .subscribe({

        next: (res) => {
          this._etudiants.set(res || []);
        },

        error: () => {
          this._error.set(
            'Impossible de charger les étudiants.'
          );
        }

      });
  }

  loadFormations(etudiantId: number): void {

    this._loading.set(true);
    this._error.set(null);

    this.service.getFormationsDisponibles(etudiantId)
      .pipe(
        finalize(() => this._loading.set(false))
      )
      .subscribe({

        next: (res) => {
          this._formations.set(res || []);
        },

        error: () => {
          this._error.set(
            'Impossible de charger les formations.'
          );
        }

      });
  }

  loadAllInscriptions(): void {

    this._loading.set(true);
    this._error.set(null);

    this.service.getAllInscriptions()
      .pipe(
        finalize(() => this._loading.set(false))
      )
      .subscribe({

        next: (data) => {

          console.log('INSCRIPTIONS => ', data);

          this._inscriptions.set(data || []);
        },

        error: () => {

          this._error.set(
            'Erreur chargement des inscriptions'
          );
        }

      });
  }

  // =====================================================
  // ETUDIANT
  // =====================================================

  selectEtudiant(etudiantId: number): void {

    const etudiant = this._etudiants()
      .find(e => e.id === etudiantId);

    this._selectedEtudiantId.set(etudiantId);

    this._checkedFormationIds.set([]);

    if (etudiant) {

      this._studentSearch.set(
        `${etudiant.prenom} ${etudiant.nom}`
      );
    }

    this.loadFormations(etudiantId);
  }

  clearEtudiant(): void {

    this._selectedEtudiantId.set(null);

    this._checkedFormationIds.set([]);

    this._formations.set([]);

    this._studentSearch.set('');
  }

  // =====================================================
  // FORMATIONS
  // =====================================================

  toggleFormation(
    formation: AdminFormationDisponible
  ): void {

    if (formation.dejaInscrit) {
      return;
    }

    this._checkedFormationIds.update(ids =>

      ids.includes(formation.id)
        ? ids.filter(id => id !== formation.id)
        : [...ids, formation.id]
    );
  }

  isChecked(id: number): boolean {

    return this._checkedFormationIds()
      .includes(id);
  }

  inscrireSelection(): void {

    const etudiantId =
      this._selectedEtudiantId();

    const formationIds =
      this._checkedFormationIds();

    if (!etudiantId || formationIds.length === 0) {

      this._error.set(
        'Veuillez sélectionner un étudiant et des formations.'
      );

      return;
    }

    this._loading.set(true);
    this._error.set(null);
    this._success.set(null);

    this.service
      .inscrireMultiple(etudiantId, formationIds)
      .pipe(
        finalize(() => this._loading.set(false))
      )
      .subscribe({

        next: () => {

          this._success.set(
            'Inscriptions effectuées avec succès.'
          );

          this._checkedFormationIds.set([]);

          this.loadFormations(etudiantId);

          // refresh dashboard
          this.loadAllInscriptions();
        },

        error: () => {
          this.toast.error(this._error()||'Erreur lors de l’inscription.');
          this._error.set(
            'Erreur lors de l’inscription.'
          );
        }

      });
  }

  // =====================================================
  // DESINSCRIPTION
  // =====================================================

  desinscrire(
    etudiantId: number,
    formationId: number
  ): void {

    this._loading.set(true);

    this._error.set(null);

    this._success.set(null);

    this.service
      .desactiverInscription(etudiantId, formationId)
      .pipe(
        finalize(() => this._loading.set(false))
      )
      .subscribe({

        next: () => {

          this._success.set(
            'Désinscription effectuée'
          );

          // refresh dashboard
          this.loadAllInscriptions();

          // refresh formations disponibles
          if (this._selectedEtudiantId() === etudiantId) {

            this.loadFormations(etudiantId);
          }
        },

        error: () => {

          this._error.set(
            'Erreur lors de la désinscription'
          );
        }

      });
  }

  // =====================================================
  // SEARCH
  // =====================================================

  setSearch(value: string): void {

    this._search.set(value || '');
  }

  setStudentSearch(value: string): void {

    this._studentSearch.set(value || '');
  }
}
