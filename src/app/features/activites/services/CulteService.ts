import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, CulteResponse } from '../models/culte.model';
import { environment } from '../../../env';

@Injectable({ providedIn: 'root' })
export class CulteService {

  private http = inject(HttpClient);

  private api = environment.BASIC_URL + 'cultes';

  create(formData: FormData): Observable<CulteResponse> {
    return this.http.post<CulteResponse>(this.api+'/create', formData);
  }

  update(id: number, formData: FormData) {
  return this.http.put(
    `${this.api}/${id}`,
    formData
  );

}

  getById(id: number) {
    return this.http.get<CulteResponse>(
      `${this.api}/${id}`
    );
  }

getAll(): Observable<ApiResponse<CulteResponse[]>> {
  return this.http.get<ApiResponse<CulteResponse[]>>(
    this.api + '/liste'
  );
}
}
