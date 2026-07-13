import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { AuthStoreService } from '../../../service/auth/auth-store-service';
import { Toast } from '../../../../shared/utilities/Toast';
import { LoaderComponent } from '../../../../shared/utilities/loader-component/loader-component';
import { StorageService } from '../../../service/storage-service/storage-service';

@Component({
  selector: 'app-login-component',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    LoaderComponent
  ],
  templateUrl: './login-component.html',
  styleUrl: './login-component.css'
})
export class LoginComponent implements OnInit {

  readonly store = inject(AuthStoreService);

  private readonly fb = inject(FormBuilder);
  private readonly toast = inject(Toast);
  private readonly storageService = inject(StorageService);

  isLoggedIn = false;
  roles: string[] = [];

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  ngOnInit(): void {
    if (this.storageService.isLoggedIn()) {
      this.isLoggedIn = true;
      const user = this.storageService.getUser();
      this.roles = user?.role ? [user.role] : [];
    }
  }

  submit(): void {
    if (this.form.invalid) {
      this.toast.info('Veuillez remplir correctement le formulaire.');
      this.form.markAllAsTouched();
      return;
    }

    this.store.login({
      email: this.form.value.email!,
      password: this.form.value.password!
    });
  }
}
