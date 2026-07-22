import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
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
import { QrManagementStore } from '../../../Qrcode/services/qr-management.store';
import { CulteResponse, EgliseInfo, ValidateQrResponse } from '../../../activites/models/culte.model';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CulteStore } from '../../../activites/services/CulteStore';
import { MemberStore } from '../../services/MemberStore';
import { finalize } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-public-inscription-component',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatIconModule,
    MatProgressSpinnerModule

  ],
  templateUrl: './public-inscription-component.html',
  styleUrl: './public-inscription-component.css',
})
export class PublicInscriptionComponent implements OnInit {



  /* =====================================================
     INJECTIONS
  ===================================================== */
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private qrStore = inject(QrManagementStore);
  private culteStore = inject(CulteStore);
  private memberStore = inject(MemberStore);
  private snackBar = inject(MatSnackBar);
  private cdr = inject(ChangeDetectorRef);
  private messageService = inject(MessageService);



  /* =====================================================
     QR / EGLISE / CULTE
  ===================================================== */
  token!: string;
  qrInfo?: ValidateQrResponse;
  eglise?: EgliseInfo;
  culte?: CulteResponse;
  culteId: number | null = null;


  /* =====================================================
     FORM
  ===================================================== */
  form!: FormGroup;



  /* =====================================================
     UI
  ===================================================== */
  loadingQr = true;
  isLoading = false;
  currentStep = 1;
  progression = 33;


  /* =====================================================
     PHOTO
  ===================================================== */
  selectedPhoto?: File;
  photoPreview?: string;


  /* =====================================================
     RATING
  ===================================================== */
  stars = [1, 2, 3, 4, 5];
  rating = 0;


  /* =====================================================
     DEPARTEMENTS
  ===================================================== */
  departements = [
    'Accueil',
    'Louange',
    'Intercession',
    'Jeunesse',
    'Enfants',
    'Média',
    'Évangélisation',
    'Social',
    'Protocole',
    'Technique',
    'Administration',
    'Finance',
    'Autre'
  ];



  /* =====================================================
     INIT
  ===================================================== */
  ngOnInit(): void {
    this.token =
      this.route.snapshot.paramMap.get('token')!;
    this.initForm();
    this.loadQrInfo();
  }




  /* =====================================================
     FORMULAIRE
  ===================================================== */
  initForm() {
    this.form = this.fb.group({
      // identité
      nom: [
        '',
        Validators.required
      ],
      prenom: [

        '',
        Validators.required

      ],



      genre: [

        ''

      ],



      statutSocial: [

        ''

      ],



      profession: [

        ''

      ],



      telephone: [

        '',

        Validators.required

      ],



      email: [

        ''

      ],



      dateNaissance: [

        ''

      ],



      adresse: [

        ''

      ],







      // spirituel


      accepteJesus: [

        ''

      ],



      baptise: [

        ''

      ],



      ancienneteFoi: [

        ''

      ],



      ancienneEglise: [

        ''

      ],







      // église


      eglise: [

        'Non'

      ],



      invite: [

        ''

      ],



      departement: [

        ''

      ],



      domaineService: [

        ''

      ],



      culteId: [

        null

      ],



      egliseId: [

        null

      ],







      // expérience


      source: [

        ''

      ],



      accueil: [

        0

      ],



      avis: [

        ''

      ],






      // consentement


      acceptationDonnees: [

        false,

        Validators.requiredTrue

      ],







      // tracking


      qrToken: [

        ''

      ],



      deviceType: [

        ''

      ],



      browserLanguage: [

        ''

      ]




    });


  }










  /* =====================================================
     VALIDATION QR
  ===================================================== */
 loadQrInfo() {

  this.loadingQr = true;


  this.qrStore
    .validateToken(this.token)

    .subscribe({

      next: (res) => {


        console.log("QR RESPONSE", res);
       // ===============================
        // QR INVALIDE OU EXPIRE
        // ===============================

        if (res.valid === false) {


          this.forceStopQrLoader();



          this.messageService.add({

            severity:'error',

            summary:'QR Code invalide',

            detail: res.message ??
            'Ce QR Code est expiré ou invalide'

          });



          this.router.navigateByUrl(
            'public/token-expired'
          );


          return; // IMPORTANT

        }
        this.qrInfo = res;

        this.eglise = res.eglise;



        this.form.patchValue({

          qrToken: this.token,

          deviceType: this.detectDevice(),

          browserLanguage: navigator.language,

          egliseId: this.eglise?.id

        });



        /*
          FORCE ARRET DU LOADER
          après validation QR
        */

        this.forceStopQrLoader();




        if (!res.valid) {


          return;


        }




        // QR avec culte

        if(res.culteId){


          this.culteId = res.culteId;


          this.findCulte(res.culteId);


        }




      },


      error:(err)=>{


        console.error(err);


        this.forceStopQrLoader();



        this.messageService.add({

          severity:'error',

          summary:'Erreur',

          detail:'QR Code invalide'

        });



      }



    });



}




  /* =====================================================
     CHARGER CULTE
  ===================================================== */
findCulte(id:number){


  let termine = false;



  this.culteStore.getById(

    id,


    (data:CulteResponse)=>{


      termine = true;


      this.culte = data;



      this.forceStopQrLoader();



    }


  );



  // sécurité si le store bloque

  setTimeout(()=>{


    if(!termine){


      console.warn(
        "Chargement culte forcé terminé"
      );


      this.forceStopQrLoader();


    }


  },5000);



}



  /* =====================================================
     DEVICE
  ===================================================== */
  detectDevice():
    'MOBILE' | 'TABLET' | 'DESKTOP' {
    const ua =
      navigator.userAgent.toLowerCase();
    if (/mobile/.test(ua))
      return 'MOBILE';
    if (/tablet|ipad/.test(ua))
      return 'TABLET';
    return 'DESKTOP';
  }



  /* =====================================================
     PHOTO
  ===================================================== */
  selectPhoto(event: any) {
    const file =
      event.target.files[0];
    if (!file)
      return;
    this.selectedPhoto = file;
    const reader =
      new FileReader();
    reader.onload = () => {
      this.photoPreview =
        reader.result as string;
    };
    reader.readAsDataURL(file);
  }




  /* =====================================================
     STEPS
  ===================================================== */
  nextStep() {
    if (this.currentStep < 3) {
      this.currentStep++;
      this.updateProgression();
    }
  }
  previousStep() {


    if (this.currentStep > 1) {


      this.currentStep--;


      this.updateProgression();


    }


  }
  updateProgression() {
    switch (this.currentStep) {
      case 1:
        this.progression = 33;
        break;
      case 2:
        this.progression = 66;
        break;
      case 3:
        this.progression = 100;
        break;

    }



  }




  /* =====================================================
     RATING
  ===================================================== */


  setRating(value: number) {

    this.rating = value;
    this.form.patchValue({
      accueil: value
    });


  }



  /* =====================================================
     RESET
  ===================================================== */
  resetForm() {
    this.form.reset({
      eglise: 'Non',
      qrToken: this.token,
      deviceType: this.detectDevice(),
      browserLanguage: navigator.language
    });
    this.rating = 0;
    this.photoPreview = undefined;
    this.selectedPhoto = undefined;
    this.currentStep = 1;
    this.progression = 33;
  }









  /* =====================================================
     SUBMIT
  ===================================================== */
  submitForm() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const payload = {
      ...this.form.value,
      culteId:
        this.culte?.id ??
        this.culteId ??
        null,
      egliseId:
        this.eglise?.id,
      tracking: {
        qrToken: this.token,
        churchId: this.eglise?.id,
        culteId:
          this.culte?.id ??
          null,
        evenementId:
          this.qrInfo?.evenementId,
        deviceType:
          this.detectDevice(),
        browserLanguage:
          navigator.language,
        userAgent:
          navigator.userAgent,

        registrationDate:
          new Date().toISOString()
      }
    };

    const formData =
      new FormData();
    formData.append(
      'data',
      new Blob(
        [JSON.stringify(payload)],
        {
          type: 'application/json'
        }
      )
    );

    if (this.selectedPhoto) {
      formData.append(
        'photo',
        this.selectedPhoto
      );
    }

    this.memberStore.registerVisitor(
      formData,
      () => {
        this.isLoading = false;
        this.snackBar.open(
          '🎉 Inscription réalisée avec succès. Bienvenue !',
          'Fermer',
          {
            duration: 4000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          }
        );
        this.router.navigateByUrl(
          'public/success-inscrit'
        );
      },
      () => {
        this.isLoading = false;
        this.snackBar.open(
          "Impossible d'enregistrer votre inscription.",
          'Fermer',
          {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          }
        );
      }

    );



  }


  private forceStopQrLoader() {

  this.loadingQr = false;

  setTimeout(() => {

    this.cdr.detectChanges();

  }, 0);

}

}
