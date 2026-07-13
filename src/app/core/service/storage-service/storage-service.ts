import { Injectable } from '@angular/core';

const TOKEN_KEY = 'u_learning_token';
const USER_KEY = 'u_learning_user';

@Injectable({
  providedIn: 'root',
})
export class StorageService {

  clean(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  saveUser(user: any): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user));

    if (user?.token) {
      localStorage.setItem(TOKEN_KEY, user.token);
    }
  }

  getUser(): any {
    const user = localStorage.getItem(USER_KEY);

    if (!user) {
      return null;
    }

    try {
      return JSON.parse(user);
    } catch {
      return null;
    }
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
