import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { finalize, Observable } from 'rxjs';

import { environment } from '../../../env';
import { LoaderService } from '../../../shared/loader-service';
import { AuthResponse } from '../../Auth/model/auth.model';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  nom: string;
  prenom: string;
  email: string;
  password: string;
}



@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private readonly API_AUTH_LOGIN = `${environment.BASIC_URL_AUTH_LOGIN}`;
    private readonly API_AUTH_REGISTER = `${environment.BASIC_URL_REGISTER}`;

  private readonly API_ADMIN = `${environment.BASIC_URL}/api/admin`;

  private readonly httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };

  constructor(
    private http: HttpClient,
    private loaderService: LoaderService
  ) {}

  login(payload: LoginRequest): Observable<AuthResponse> {
    this.loaderService.show();

    return this.http
      .post<AuthResponse>(
        `${this.API_AUTH_LOGIN}`,
        payload,
        this.httpOptions
      )
      .pipe(finalize(() => this.loaderService.hide()));
  }

  register(payload: RegisterRequest): Observable<AuthResponse> {
    this.loaderService.show();

    return this.http
      .post<AuthResponse>(
        `${this.API_AUTH_REGISTER}`,
        payload,
        this.httpOptions
      )
      .pipe(finalize(() => this.loaderService.hide()));
  }

  logout(): void {
    localStorage.removeItem('u_learning_token');
    localStorage.removeItem('u_learning_user');
  }

  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.API_ADMIN);
  }

  blockUser(userId: number): Observable<any> {
    return this.http.put(
      `${this.API_ADMIN}/${userId}/block`,
      {},
      this.httpOptions
    );
  }

  unblockUser(userId: number): Observable<any> {
    return this.http.put(
      `${this.API_ADMIN}/${userId}/unblock`,
      {},
      this.httpOptions
    );
  }

  assignRole(userId: number, role: string): Observable<any> {
    return this.http.put(
      `${this.API_ADMIN}/${userId}/role`,
      { role },
      this.httpOptions
    );
  }


}
