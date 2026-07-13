import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../../env';

import {
  AdminEtudiant,
  AdminFormationDisponible,
} from '../../model/admin-inscription.model';
import { InscriptionDetailResponse } from '../../model/admin-user.model';

@Injectable({
  providedIn: 'root'
})
export class AdminInscriptionService {
  private readonly http = inject(HttpClient);

  /**
   * BACKEND:
   * /api/admin/inscriptions/**
   */
  private readonly adminUrl =
    `${environment.BASIC_URL}admin/inscriptions`;

  /**
   * Liste des étudiants
   */
  getEtudiants(): Observable<AdminEtudiant[]> {

    return this.http.get<AdminEtudiant[]>(
      `${this.adminUrl}/etudiants`
    );
  }

  /**
   * Formations disponibles
   */
  getFormationsDisponibles(
    etudiantId: number
  ): Observable<AdminFormationDisponible[]> {

    return this.http.get<AdminFormationDisponible[]>(
      `${this.adminUrl}/etudiants/${etudiantId}/formations`
    );
  }

  /**
   * Inscription multiple
   */
  inscrireMultiple(
    etudiantId: number,
    formationIds: number[]
  ): Observable<any> {

    return this.http.post(
      `${this.adminUrl}/multiple`,
      {
        etudiantId,
        formationIds
      }
    );
  }
 desactiverInscription(etudiantId: number, formationId: number) {
  console.log(`Désactiver l'inscription de l'étudiant ${etudiantId} pour la formation ${formationId}`);
  return this.http.put(
    `${this.adminUrl}/inscriptions/desactiver`,
    { etudiantId, formationId }
  );
}
 /**
   * 📊 Récupérer toutes les inscriptions groupées par étudiant
   */
  getAllInscriptions(): Observable<InscriptionDetailResponse[]> {
    return this.http.get<InscriptionDetailResponse[]>(
      `${this.adminUrl}/all`
    );
  }

  /**
   * 📊 Récupérer détail d’un étudiant
   */
  getInscriptionByEtudiant(etudiantId: number): Observable<InscriptionDetailResponse> {
    return this.http.get<InscriptionDetailResponse>(
      `${this.adminUrl}/${etudiantId}`
    );
  }

}
