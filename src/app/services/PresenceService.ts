import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../env";
import { Personne } from "../pages/model/personne";

@Injectable({ providedIn: 'root' })
export class PresenceService {

  private readonly apiUrl = environment.BASIC_URL;

  constructor(private http: HttpClient) {}

  markPresence(id: number) {
    return this.http.post(`${this.apiUrl}presence/${id}`, {});
  }

  getDetectedPerson(personId: number) {
  return this.http.get<Personne>(
    `${this.apiUrl}presence/detect?personId=${personId}`
  );
}

  getAll() {
    return this.http.get<any[]>(`${this.apiUrl}presence`);
  }


   getAllPersone() {
    return this.http.get<Personne[]>(`${this.apiUrl}persons`);
  }

  getLastPresenceByPerson(id: number) {
  return this.http.get<Personne[]>(
    `${this.apiUrl}presence/person/${id}`
  );
}

}
