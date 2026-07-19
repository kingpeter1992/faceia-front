import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit, Optional } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { StoreMembre } from '../../services/StoreMembre';
import { LoaderComponent } from '../../../../shared/utilities/loader-component/loader-component';
import { Router } from '@angular/router';
import { Toast } from '../../../../shared/utilities/Toast';
import { MatIconModule } from '@angular/material/icon';
import { Membre } from '../../models/Membre';

@Component({
  selector: 'app-nouveau-composant',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    LoaderComponent,
    MatIconModule
  ],
  templateUrl: './nouveau-composant.html',
  styleUrl: './nouveau-composant.css',
})
export class NouveauComposant implements OnInit {
  form!: FormGroup;
  isLoading = false;
  isEditMode = false;

  // ✅ Déclaration explicite pour le template HTML
  public editData: any = null;
  // ✅ Variable pour stocker l'ID du culte s'il est présent
  public culteId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<NouveauComposant>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any, // On reçoit l'objet global ici
    public store: StoreMembre,
    private route: Router,
    private toast: Toast
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.email]],
      telephone: ['', Validators.required],
      adresse: ['', Validators.required],
      invite: [''],
      eglise: ['Non'],
      accueil: ['Excellent'],
      avis: ['']
    });

    // ✅ Analyse des données reçues à l'ouverture
    if (this.data) {
      // Cas 1 : C'est un update direct (l'objet data est le membre)
      if (this.data.id && !this.data.culteId) {
        this.isEditMode = true;
        this.editData = this.data;
        this.form.patchValue(this.editData);
      }
      // Cas 2 : Données encapsulées (ex: { user: membre } ou { culteId: 2 })
      else {
        if (this.data.user) {
          this.isEditMode = true;
          this.editData = this.data.user;
          this.form.patchValue(this.editData);
        }
        if (this.data.culteId) {
          this.culteId = this.data.culteId;
        }
      }
    }
  }

  close() {
    this.dialogRef.close();
  }

  resetForm() {
    if (this.isEditMode) {
      this.form.patchValue(this.editData);
    } else {
      this.form.reset({ eglise: 'Non', accueil: 'Excellent' });
    }
  }

  submitForm() {
  if (this.form.invalid) {
    this.form.markAllAsTouched();
    return;
  }

  this.isLoading = true;

  // Création du payload de base avec les valeurs du formulaire
  const formValues = this.form.value;

  if (this.isEditMode) {
    // ✏️ MODE MODIFICATION
    const updatedUser: Membre = { ...this.editData, ...formValues };

    // Structuration de la relation culte attendue par le backend
    if (this.culteId) {
      updatedUser.culte = { id: this.culteId };
    } else if (this.editData.culte) {
      updatedUser.culte = this.editData.culte; // Conserve le culte existant s'il y en avait un
    } else {
      updatedUser.culte = null;
    }

    this.store.update(
      this.editData.id,
      updatedUser,
      () => {
        this.isLoading = false;
        this.toast.success('✏️ Membre mis à jour avec succès');
        this.close();
      }
    );
  } else {
    // ➕ MODE CRÉATION
    const payload: Membre = { ...formValues };

    // ✅ Si l'ajout est lié à un culte, on l'encapsule dans l'objet attendu par Spring Boot
    if (this.culteId) {
      payload.culte = { id: this.culteId };
    } else {
      payload.culte = null; // Pas de culte lié
    }

    this.store.create(
      payload,
      () => {
        this.isLoading = false;
        this.resetForm();
        this.toast.success(
          this.culteId
            ? '✅ Visiteur enregistré et lié au culte avec succès'
            : '✅ Nouveau venu enregistré avec succès'
        );
        this.close();
        this.route.navigateByUrl('/membres/dashboard');
      }
    );
  }
}
}
