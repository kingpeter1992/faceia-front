import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';
import { Observable } from 'rxjs';

import { Toast } from '../../shared/utilities/Toast';
import { StorageService } from '../service/storage-service/storage-service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private storage: StorageService,
    private toast: Toast
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {

    const isLoggedIn = this.storage.isLoggedIn();
    const user = this.storage.getUser();

    if (!isLoggedIn || !user) {
      this.toast.info('Veuillez vous connecter.');
      return this.router.createUrlTree(['/login']);
    }

    const allowedRoles = route.data['roles'] as string[] | undefined;

    if (!allowedRoles?.length) {
      return true;
    }

    const userRoles = user.roles || [];

    console.log('Allowed:', allowedRoles);
    console.log('User:', userRoles);

    const hasRole = userRoles.some(
      (role: string) => allowedRoles.includes(role)
    );

    if (hasRole) {
      return true;
    }

    this.toast.error('Accès refusé.');
    return this.router.createUrlTree(['/unauthorized']);
  }
}
