import { ChangeDetectionStrategy, ChangeDetectorRef, Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { QRCodeComponent } from 'angularx-qrcode';
import { InputNumberModule } from 'primeng/inputnumber';
import { ActivatedRoute, Router } from '@angular/router';
import { QrAccessStore } from '../../../membres/services/QrAccessStore';
import { Toast } from '../../../../shared/utilities/Toast';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-church-comptage',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputNumberModule, QRCodeComponent],
  templateUrl: './church-comptage.html',
  styleUrl: './church-comptage.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChurchComptage implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private store = inject(QrAccessStore);
  private toast = inject(Toast);
  private cdr = inject(ChangeDetectorRef); // 🌟 AJOUT : Pour forcer le rafraîchissement OnPush
private dialogData = inject(MAT_DIALOG_DATA);
  culteId = signal<number | null>(null);
  comptageForm!: FormGroup;



  loading = computed(() => this.store.loading());
  comptageData = computed(() => this.store.selected()); // Vos données chargées depuis le Store
 qrToken = computed(() => this.store.qr()?.token ?? null);

  qrPublicUrl = computed(() => this.store.qr()?.url ?? '');

  qrImage = computed(() => this.store.qr()?.qrCode ?? '');

  qrExpiration = computed(() => this.store.qr()?.expiresAt ?? '');




  // Calcul du total en temps réel via un Signal Computé basé sur la valeur du formulaire
  formValueSignal = signal({ hommes: 0, femmes: 0, jeunes: 0, enfants: 0, visiteurs: 0 });

  totalPresences = computed(() => {
    const val = this.formValueSignal();
    return (val.hommes || 0) + (val.femmes || 0) + (val.jeunes || 0) + (val.enfants || 0) + (val.visiteurs || 0);
  });

  constructor() {
    this.initForm();

    // Effet de synchronisation Store -> Formulaire local
    effect(() => {
      const data = this.comptageData();
      if (data) {
        this.comptageForm.patchValue({
          hommes: data.hommes || 0,
          femmes: data.femmes || 0,
          jeunes: data.jeunes || 0,
          enfants: data.enfants || 0,
          visiteurs: data.visiteurs || 0
        }, { emitEvent: false });
        this.updateFormSignal();
        this.cdr.markForCheck(); // 🌟 Sécurité rendu
      }
    });

    // 🌟 AJOUT : Écouter réactivement les changements du QR Code pour forcer le template à se redessiner
    effect(() => {
      if (this.store.qr()) {
        this.cdr.markForCheck();
      }
    });

  }



  ngOnInit(): void {
     const id = this.dialogData.culteId;

  console.log('culte sélectionné', id);

    if (id) {
      this.culteId.set(id);
      this.store.loadByCulte(id);
    }
    this.comptageForm.valueChanges.subscribe(() => {
      this.updateFormSignal();
      this.cdr.markForCheck(); // 🌟 Recalculer le total visuel immédiatement
    });
  }



  private initForm() {
    this.comptageForm = this.fb.group({
      hommes: [0, [Validators.required, Validators.min(0)]],
      femmes: [0, [Validators.required, Validators.min(0)]],
      jeunes: [0, [Validators.required, Validators.min(0)]],
      enfants: [0, [Validators.required, Validators.min(0)]],
      visiteurs: [0, [Validators.required, Validators.min(0)]]
    });
  }

  private updateFormSignal() {
    this.formValueSignal.set(this.comptageForm.value);
  }

  genererNouveauTokenQR() {
    const id = this.culteId();
    if (!id) {
      this.toast.error(
        "Aucun culte sélectionné"
      );
      return;
    }
    this.store.generate(
      id,
      () => {
        this.toast.success(
          "QR Code généré avec succès"
        );
        this.cdr.markForCheck();
      }
    );
  }
downloadQRCode() {

  const image = this.qrImage();

  if (!image) {

    this.toast.error(
      "QR Code indisponible."
    );

    return;

  }

  const link = document.createElement('a');

  link.href = image;

  link.download = `QR_Culte_${this.culteId()}.png`;

  link.click();

}

 copyLink() {

  const url = this.qrPublicUrl();

  if (!url) {
    this.toast.error("Aucun lien disponible.");
    return;
  }

  navigator.clipboard.writeText(url);

  this.toast.success("Lien copié dans le presse-papiers");

}

  save() {
    if (this.comptageForm.invalid || !this.culteId()) {
      this.toast.info('Veuillez remplir correctement les champs du formulaire.');
      return;
    }

    const payload = {
      ...this.comptageForm.value,
      id: this.comptageData()?.id || null,
      culteId: this.culteId(),
      total: this.totalPresences()
    };

    this.store.save(payload).subscribe({
      next: () => this.toast.success('Statistiques de présences sauvegardées !'),
      error: () => this.toast.error('Erreur lors de la sauvegarde.')
    });
  }

  reset() {
    this.comptageForm.reset({ hommes: 0, femmes: 0, jeunes: 0, enfants: 0, visiteurs: 0 });
  }

  back() {
    this.router.navigate(['/activites/cultes']);
  }
}
