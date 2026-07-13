import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../env';
import { ApiResponse, ComptageResponse } from '../models/culte.model';

@Injectable({ providedIn: 'root' })
export class ComptageService {

  private http = inject(HttpClient);
  private api = environment.BASIC_URL + 'comptages';

  // Enregistrer ou mettre à jour un comptage (Upsert)
  saveOrUpdate(comptageData: any): Observable<ComptageResponse> {
    return this.http.post<ComptageResponse>(this.api + '/save', comptageData);
  }

  // Récupérer le comptage spécifique à un culte
  getByCulteId(culteId: number): Observable<ComptageResponse> {
    return this.http.get<ComptageResponse>(`${this.api}/culte/${culteId}`);
  }

  // Récupérer tous les comptages
  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.api);
  }

  // Récupérer par l'ID du comptage
  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.api}/${id}`);
  }

  // Récupérer par l'ID du culte
  getByIdCulte(culteId: number): Observable<any> {
    return this.http.get<any>(`${this.api}/culte/${culteId}`);
  }

  // Supprimer un comptage
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`);
  }
}
