import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthStoreService } from '../../../service/auth/auth-store-service';

@Component({
  selector: 'app-register-component',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register-component.html',
  styleUrl: './register-component.css',
})
export class RegisterComponent {
  readonly store = inject(AuthStoreService);
  private readonly fb = inject(FormBuilder);

  form = this.fb.group({
    nom: ['', Validators.required],
    prenom: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.store.register({
      nom: this.form.value.nom!,
      prenom: this.form.value.prenom!,
      email: this.form.value.email!,
      password: this.form.value.password!
    });
  }

}
