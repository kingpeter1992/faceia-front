import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../env';
import { DonationRequest, DonationResponse } from '../models/DonationRequest';
import { ApiResponse } from '../../activites/models/culte.model';

@Injectable({ providedIn: 'root' })
export class DonationService {


  private api = environment.BASIC_URL + 'donations';

  constructor(private http: HttpClient) {}

  createMany(payload: DonationRequest[]): Observable<DonationResponse[]> {
    console.log('array', payload)
    return this.http.post<DonationResponse[]>(this.api + '/bulk', payload);
  }


  create(data: DonationRequest) {
  return this.http.post<DonationResponse>(this.api, data);
}

getAll(): Observable<ApiResponse<DonationResponse[]>> {
  return this.http.get<ApiResponse<DonationResponse[]>>(
    this.api + '/liste'
  );
}
update(id: number, data: DonationRequest) {
  return this.http.put<DonationResponse>(`${this.api}/${id}`, data);
}

delete(id: number) {
  return this.http.delete<void>(`${this.api}/${id}`);
}

getByCulte(culteId: number) {
  return this.http.get<DonationResponse[]>(`${this.api}/culte/${culteId}`);
}
}
