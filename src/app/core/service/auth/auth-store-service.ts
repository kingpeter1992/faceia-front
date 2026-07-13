import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';

import {
  AuthResponse,
  LoginRequest,
  RegisterRequest
} from '../../Auth/model/auth.model';

import { AuthService } from './auth-service';
import { Toast } from '../../../shared/utilities/Toast';
import { StorageService } from '../storage-service/storage-service';
import { RoleUser } from '../../../features/admin/model/admin-user.model';
import { CulteStore } from '../../../features/activites/services/CulteStore';
import { StoreMembre } from '../../../features/membres/services/StoreMembre';

@Injectable({
  providedIn: 'root',
})
export class AuthStoreService {

  private readonly service = inject(AuthService);
  private readonly router = inject(Router);
  private readonly toast = inject(Toast);
  private readonly storage = inject(StorageService);
  private readonly culteStore = inject(CulteStore)
  private readonly storeMemebre = inject(StoreMembre)

  private _user = signal<AuthResponse | null>(this.storage.getUser());
  private _loading = signal(false);
  private _error = signal<string | null>(null);

  user = this._user.asReadonly();
  loading = this._loading.asReadonly();
  error = this._error.asReadonly();

  isLoggedIn = computed(() => !!this._user()?.token);

  roles = computed<RoleUser[]>(() => this._user()?.roles ?? []);
  token = computed(() => this._user()?.token ?? null);

  login(payload: LoginRequest): void {
    this._loading.set(true);
    this._error.set(null);
    this.service.login(payload)
      .pipe(finalize(() => this._loading.set(false)))
      .subscribe({
        next: res => {
          this.saveSessionAndRedirect(res);
        },
        error: err => {
          const message =
            err?.error?.message || 'Email ou mot de passe incorrect.';

          this.toast.info(message);
          this._error.set(message);
        }
      });
  }

  register(payload: RegisterRequest): void {
    this._loading.set(true);
    this._error.set(null);
    this.service.register(payload)
      .pipe(finalize(() => this._loading.set(false)))
      .subscribe({
        next: res => {
          this.storage.saveUser(res);
          this._user.set(res);
          this.toast.success(
            'Compte créé avec succès. Votre compte est en attente de validation.'
          );
          this.router.navigate(['/attente-validation']);
        },
        error: err => {
          const message =
            err?.error?.message || 'Erreur lors de la création du compte.';

          this.toast.info(message);
          this._error.set(message);
        }
      });
  }

  logout(): void {
    this.storage.clean();
    this._user.set(null);
    this.router.navigate(['/login']);
  }

private saveSessionAndRedirect(res: AuthResponse): void {

  this.storage.saveUser(res);
  this._user.set(res);
  this.toast.success('Connecté');



    // 🚀 charger les cultes UNE SEULE FOISC
  this.culteStore.loadAllIfNeeded();
  this.storeMemebre.loadAll();


  const roles = res.roles;

  if (roles.includes('ADMIN')) {
    this.router.navigate(['/admin/dashboard']);
  }

  else if (roles.includes('RESPONSABLE_01')) {
    this.router.navigate(['/finances/dashboard']);
  }

  else if (roles.includes('RESPONSABLE_02')) {
    this.router.navigate(['/membres/dashboard']);
  }

  else {
    this.router.navigate(['/attente-validation']);
  }
}

hasRole(role: RoleUser): boolean {
  return this._user()?.roles?.includes(role) ?? false;
}

}
