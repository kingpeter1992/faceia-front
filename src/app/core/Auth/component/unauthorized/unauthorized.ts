import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthStoreService } from '../../../service/auth/auth-store-service';

@Component({
  selector: 'app-unauthorized',
  imports: [],
  templateUrl: './unauthorized.html',
  styleUrl: './unauthorized.css',
})
export class Unauthorized implements OnInit {
  ngOnInit(): void {
  const roles = this.auth.roles();
    console.log('orle', roles)  }
  private readonly router = inject(Router);
  readonly auth = inject(AuthStoreService);

  goHome(): void {

    const roles = this.auth.roles();
    console.log('rorle', roles)

    if (roles.includes('ADMIN')) {
      this.router.navigate(['/']);
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
}
