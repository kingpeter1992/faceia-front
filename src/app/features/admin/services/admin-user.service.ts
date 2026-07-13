import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../env';
import { UserResponse, AssignRoleRequest, RoleUser } from '../model/admin-user.model';


@Injectable({ providedIn: 'root' })
export class AdminUserService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.BASIC_URL}admin/users`;

  getAll(): Observable<UserResponse[]> {
    return this.http.get<UserResponse[]>(this.apiUrl);
  }

  getEnAttente(): Observable<UserResponse[]> {
    return this.http.get<UserResponse[]>(`${this.apiUrl}/en-attente`);
  }

  assignRole(userId: number, payload: { roles: RoleUser[] }): Observable<UserResponse> {
    return this.http.put<UserResponse>(`${this.apiUrl}/${userId}/roles`, payload);
  }

assignRoles(userId: number, roles: RoleUser[]) {
  return this.http.put<UserResponse>(
    `/api/users/${userId}/roles`,
    { roles }
  );
}


}
