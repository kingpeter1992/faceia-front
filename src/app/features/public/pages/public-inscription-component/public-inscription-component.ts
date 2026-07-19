import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Toast } from '../../../../shared/utilities/Toast';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { LoaderComponent } from '../../../../shared/utilities/loader-component/loader-component';
import { PublicQrInfo } from '../../../Qrcode/models/PublicQrInfo';
import { QrManagementStore } from '../../../Qrcode/services/qr-management.store';
import { CulteResponse, ValidateQrResponse } from '../../../activites/models/culte.model';
import { ChurchSessionStore } from '../../egliseInfos/services/church-session.store';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CulteStore } from '../../../activites/services/CulteStore';

@Component({
  selector: 'app-public-inscription-component',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    LoaderComponent,
    MatIconModule,
    MatProgressSpinnerModule

  ],
  templateUrl: './public-inscription-component.html',
  styleUrl: './public-inscription-component.css',
})
export class PublicInscriptionComponent implements OnInit {

  // ==============================
  // VARIABLES
  // ==============================

  token!: string;
  form!: FormGroup;
  qrInfo?: ValidateQrResponse;
  editData: any = null;
  culteId: number | null = null;

  // Etats UI
  isLoading = false;
  loadingQr = true;
  isEditMode = false;

  readonly churchStore = inject(ChurchSessionStore);
  eglise = this.churchStore.eglise;
  culte?: CulteResponse;
  // ==============================
  // CONSTRUCTOR
  // ==============================
  constructor(
    private fb: FormBuilder,
    private storeQrcode: QrManagementStore,
    private router: Router,
    private toast: Toast,
    private route: ActivatedRoute,
    private culteStore: CulteStore
  ) { }


  // ==============================
  // INIT
  // ==============================

  ngOnInit(): void {
    this.token = this.route.snapshot.paramMap.get('token')!;
    console.log('QR Token : ', this.token);

    // 1 - Création formulaire
    this.initForm();

    // 2 - Validation QR
    this.loadQrInfo();


  }

  // ==============================
  // FORMULAIRE
  // ==============================

  initForm(): void {
    this.form = this.fb.group({
      nom: ['',Validators.required],
      prenom: ['',Validators.required],
      email: ['',Validators.required],
      telephone: ['',Validators.required],
      adresse: ['',Validators.required],
      invite: [''],
      eglise: ['Non'],
      accueil: ['Excellent'],
      avis: ['']
    });

  }

  resetForm(): void {
    if (this.isEditMode) {
      this.form.patchValue(this.editData);
    }
    else {
      this.form.reset({
        eglise: 'Non',
        accueil: 'Excellent'
      });
    }
  }



  // ==============================
  // QR VALIDATION
  // ==============================
  loadQrInfo(): void {
    this.storeQrcode
      .validateToken(this.token)
      .subscribe({
        next: (res) => {
          this.qrInfo = res;

          // Vérifier si le QR concerne un culte
          if(res.valid && res.culteId){

              this.findCulte(res.culteId);

          }
          else{

              // QR valide mais sans culte

              this.loadingQr = false;

          }

          this.loadingQr = false;
          console.log('qr validé', this.qrInfo)
        },
        error: () => {
          this.loadingQr = false;
          this.router.navigate(['/public/token-expired']);
        }
      });
  }
  findCulte(id: number): void {
    this.culteStore.getById(
      id,
      (culte: CulteResponse) => {
        this.culte = culte;
        this.loadingQr = false;
        console.log(
          "Culte chargé :",
          this.culte
        );
      }
    );
  }

  // ==============================
  // SUBMIT
  // ==============================
  submitForm(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;

    }
    const payload = {
      ...this.form.value,
      token: this.token,
      culteId: this.qrInfo?.culteId
    };

    console.log("Payload inscription :", payload);
    this.isLoading = true;

    /*
      Ici appel service/store
      exemple :
      this.storeQrcode.inscrire(payload)
          .subscribe(...)
    */

  }


}
