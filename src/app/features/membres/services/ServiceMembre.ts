import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { inject } from "@angular/core/primitives/di";
import { environment } from "../../../env";
import { Observable } from "rxjs";
import { Membre } from "../models/Membre";

@Injectable({ providedIn: 'root' })
export class ServiceMembre {

  private http = inject(HttpClient);

  private apiUrl = environment.BASIC_URL + 'membres';




 /* GET ALL */
  getAll(): Observable<Membre[]> {
    return this.http.get<Membre[]>(this.apiUrl);
  }

  /* GET BY ID */
  getById(id: number): Observable<Membre> {
    return this.http.get<Membre>(`${this.apiUrl}/${id}`);
  }

  /* CREATE */
  create(data: Membre): Observable<Membre> {
    return this.http.post<Membre>(this.apiUrl, data);
  }

  /* UPDATE */
  update(id: number, data: Membre): Observable<Membre> {
    return this.http.put<Membre>(`${this.apiUrl}/${id}`, data);
  }

}
