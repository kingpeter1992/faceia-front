import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../../env';

@Component({
  selector: 'app-public-comptage',
standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './public-comptage.html',
  styleUrl: './public-comptage.css',
})
export class PublicComptage implements OnInit {
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);
  private fb = inject(FormBuilder);
    private api = environment.BASIC_URL + 'public/comptage/';


  token!: string;
  form!: FormGroup;
  state: 'LOADING' | 'VALID' | 'EXPIRED' = 'LOADING';

  ngOnInit() {
    this.token = this.route.snapshot.paramMap.get('token') || '';
    this.form = this.fb.group({
      hommes: [0, [Validators.required, Validators.min(0)]],
      femmes: [0, [Validators.required, Validators.min(0)]],
      jeunes: [0, [Validators.required, Validators.min(0)]],
      enfants: [0, [Validators.required, Validators.min(0)]]
    });

    // Étape 1 : Vérification de la validité du jeton auprès du Backend
    this.http.get(`${this.api}validate/${this.token}`)
      .subscribe({
        next: () => this.state = 'VALID',
        error: () => this.state = 'EXPIRED'
      });
  }

  submit() {
    // Étape 2 : Envoi des chiffres au backend public
    this.http.post(`${this.api}/submit/${this.token}`, this.form.value)
      .subscribe({
        next: () => {
          alert('Merci ! Vos chiffres ont été transmis.');
          this.state = 'EXPIRED'; // Désactive l'affichage local immédiatement
        },
        error: () => alert('Erreur lors de la transmission.')
      });
  }
}
