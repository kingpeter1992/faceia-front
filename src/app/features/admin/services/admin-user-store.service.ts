import { Injectable, computed, inject, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { AdminUserService } from './admin-user.service';
import { RoleUser, UserResponse } from '../model/admin-user.model';

@Injectable({ providedIn: 'root' })
export class AdminUserStoreService {
  private readonly service = inject(AdminUserService);

  private _users = signal<UserResponse[]>([]);
  private _loading = signal(false);
  private _error = signal<string | null>(null);
  private _success = signal<string | null>(null);

  users = this._users.asReadonly();
  loading = this._loading.asReadonly();
  error = this._error.asReadonly();
  success = this._success.asReadonly();

  usersEnAttente = computed(() =>
    this._users().filter(u => u.roles === 'EN_ATTENTE')
  );

  totalUsers = computed(() => this._users().length);
  totalEnAttente = computed(() => this.usersEnAttente().length);


  loadAll(): void {
    this._loading.set(true);
    this._error.set(null);
    this.service.getAll()
      .pipe(finalize(() => this._loading.set(false)))
      .subscribe({
        next: res => {this._users.set(res || [])
          console.log('res', res)
        },
        error: err => this._error.set(err?.error?.message || 'Erreur lors du chargement des utilisateurs.')
      });
  }

  loadEnAttente(): void {
    this._loading.set(true);
    this._error.set(null);

    this.service.getEnAttente()
      .pipe(finalize(() => this._loading.set(false)))
      .subscribe({
        next: res => this._users.set(res || []),
        error: err => this._error.set(err?.error?.message || 'Erreur lors du chargement des comptes en attente.')
      });
  }

assignRoles(userId: number, roles: RoleUser[]): void {

  this._loading.set(true);
  this._error.set(null);
  this._success.set(null);

  this.service.assignRoles(userId, roles)
    .pipe(finalize(() => this._loading.set(false)))
    .subscribe({
      next: updated => {

        this._users.update(list =>
          list.map(u =>
            u.id === updated.id
              ? { ...updated }
              : u
          )
        );

        this._success.set('Rôles mis à jour avec succès.');
      },

      error: err =>
        this._error.set(err?.error?.message || 'Erreur lors de la mise à jour des rôles.')
    });
}

  clearMessages(): void {
    this._error.set(null);
    this._success.set(null);
  }
}
