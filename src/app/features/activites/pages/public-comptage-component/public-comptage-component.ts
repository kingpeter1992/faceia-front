import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { QrAccessStore } from '../../../membres/services/QrAccessStore';
import { PublicComptageRequest } from '../../models/culte.model';

@Component({
  selector: 'app-public-comptage-component',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './public-comptage-component.html',
  styleUrl: './public-comptage-component.css'
})
export class PublicComptageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private store = inject(QrAccessStore);

  token = signal<string>('');
  comptageForm!: FormGroup;

  // Sécurisation de l'état via le Store Angular Signals existant
  qrValid = computed(() => this.store.validation()?.valid ?? false);
  loading = computed(() => this.store.loading());
  errorMessage = computed(() => this.store.error());

  ngOnInit() {
    this.initForm();
    const tokenParam = this.route.snapshot.paramMap.get('token');
    console.log('TOKEN = ', tokenParam);
    if (tokenParam) {
      this.token.set(tokenParam);
      // Appel de la validation via le store réactif
      this.store.validate(tokenParam);
    }
  }

private initForm(){

this.comptageForm=this.fb.group({

hommes:[0],

femmes:[0],

jeunes:[0],

enfants:[0],

visiteurs:[0]

});


}

  adjust(controlName: string, amount: number) {
    const control = this.comptageForm.get(controlName);
    if (control) {
      const newValue = (control.value || 0) + amount;
      if (newValue >= 0) {
        control.setValue(newValue);
      }
    }
  }

  sendMetrics() {
    if (this.comptageForm.invalid || !this.token()) return;

    const payload: PublicComptageRequest = {
      hommes: Number(this.comptageForm.value.hommes),
      femmes: Number(this.comptageForm.value.femmes),
      jeunes: Number(this.comptageForm.value.jeunes),
      enfants: Number(this.comptageForm.value.enfants)
    };

    this.store.submit(this.token(), payload, () => {
      // Callback de succès configuré dans le QrAccessStore
      this.router.navigate(['/success-page']);
    });
  }
}
