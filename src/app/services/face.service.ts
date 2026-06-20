import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../env';

@Injectable({ providedIn: 'root' })
export class FaceService {

  private api = environment.BASIC_URL;

  constructor(private http: HttpClient) {}

  enroll(formData: FormData) {
    return this.http.post(`${this.api}persons/register`, formData);
  }

  recognize(blob: Blob) {
    const fd = new FormData();
    fd.append('file', blob);
    return this.http.post<any>(`${this.api}face/recognize`, fd);
  }

  getAllPersons() {
    return this.http.get(`${this.api}persons`);
  }
}
