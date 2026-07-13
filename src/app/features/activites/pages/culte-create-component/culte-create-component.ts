import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { CulteStore } from '../../services/CulteStore';
import { LoaderComponent } from "../../../../shared/utilities/loader-component/loader-component";
import { ActivatedRoute, Router } from '@angular/router';
import { CulteService } from '../../services/CulteService';
import { Toast } from '../../../../shared/utilities/Toast';
import { CulteRequest, CulteResponse } from '../../models/culte.model';

@Component({
  selector: 'app-culte-create-component',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    LoaderComponent
  ],
  templateUrl: './culte-create-component.html',
  styleUrl: './culte-create-component.css',
})
export class CulteCreateComponent implements OnInit {
// États d'ouverture des sections d'accordéon
  open1 = true;
  open2 = false;
  open3 = false;

  loading = false;

  // Fichiers pour les affiches principales (file1 sert pour l'orateur principal)
  file1: File | null = null;
  file2!: File;

  id!: string;
  culte!: any;
  culteForm!: FormGroup;

  // Tableau servant à stocker localement les fichiers d'images de chaque intervenant secondaire
  intervenantFiles: (File | null)[] = [];

  // Injections de dépendances via l'API inject()
  private fb = inject(FormBuilder);
  public culteStore = inject(CulteStore);
  private route = inject(Router);
  private routeActive = inject(ActivatedRoute);
  private serviceCulte = inject(CulteService);
  private toast = inject(Toast);

  ngOnInit(): void {
    this.initForm();
    this.id = this.routeActive.snapshot.paramMap.get('id')!;

    // Si un ID est présent dans l'URL, nous passons en mode Modification
    if (this.id) {
      this.culteStore.getById(+this.id, (culte: any) => {
        this.culte = culte;
        this.patchForm(culte);
      });
    }
  }

  /**
   * Initialise le formulaire principal de création de culte
   */
  initForm(): void {
    this.culteForm = this.fb.group({
      nom: ['', Validators.required],
      sousTitre: [''],
      dateDebut: ['', Validators.required],
      dateFin: ['', Validators.required],
      theme: ['', Validators.required],
      sousTheme: [''],
      description: ['', Validators.required],
      orateur: ['', Validators.required],
      moderateur: [''],
      intervenants: this.fb.array([]) // Liste dynamique d'intervenants secondaires
    });
  }

  /**
   * Getter pratique pour accéder au FormArray des intervenants dans le template HTML
   */
  get intervenants(): FormArray {
    return this.culteForm.get('intervenants') as FormArray;
  }

  /**
   * Point d'entrée unique lors du clic sur le bouton de soumission du formulaire HTML
   */
  submit(): void {
    if (this.culteForm.invalid) {
      this.culteForm.markAllAsTouched();
      return;
    }

    // Détermination automatique du mode d'action
    if (this.id) {
      this.update();
    } else {
      this.save();
    }
  }

  /**
   * Enregistre un nouveau culte (Mode Création)
   */
  private save(): void {
    const formData = new FormData();

    // Structure de données conforme au modèle CulteRequest
    const data: CulteRequest = {
      nom: this.culteForm.value.nom,
      sousTitre: this.culteForm.value.sousTitre,
      dateDebut: this.culteForm.value.dateDebut,
      dateFin: this.culteForm.value.dateFin,
      theme: this.culteForm.value.theme,
      sousTheme: this.culteForm.value.sousTheme,
      description: this.culteForm.value.description,
      orateur: this.culteForm.value.orateur,
      moderateur: this.culteForm.value.moderateur,
      intervenants: this.intervenants.value.map((inter: any) => ({
        id: inter.id,
        nom: inter.nom,
        motif: inter.motif
      }))
    };

    formData.append(
      'data',
      new Blob([JSON.stringify(data)], { type: 'application/json' })
    );

    if (this.file1) {
      formData.append('orateurImage', this.file1);
    }

    this.appendIntervenantFiles(formData);

    this.culteStore.create(formData, () => {
      this.toast.success('Culte enregistré avec succès');
      this.resetForm();
      this.route.navigateByUrl('activites/cultes');
    });
  }

  /**
   * Modifie un culte existant (Mode Édition)
   */
  private update(): void {
    const formData = new FormData();

    // Structure de données conforme au modèle CulteRequest incluant l'ID
    const data: CulteRequest = {
      id: this.culte.id,
      nom: this.culteForm.value.nom,
      sousTitre: this.culteForm.value.sousTitre,
      dateDebut: this.culteForm.value.dateDebut,
      dateFin: this.culteForm.value.dateFin,
      theme: this.culteForm.value.theme,
      sousTheme: this.culteForm.value.sousTheme,
      description: this.culteForm.value.description,
      orateur: this.culteForm.value.orateur,
      moderateur: this.culteForm.value.moderateur,
      intervenants: this.intervenants.value.map((inter: any) => ({
        id: inter.id,
        nom: inter.nom,
        motif: inter.motif
      }))
    };

    formData.append(
      'data',
      new Blob([JSON.stringify(data)], { type: 'application/json' })
    );

    if (this.file1) {
      formData.append('orateurImage', this.file1);
    }

    this.appendIntervenantFiles(formData);

    this.culteStore.update(this.culte.id, formData, () => {
      this.toast.success('Culte modifié avec succès');
      this.route.navigateByUrl('/activites/cultes');
    });
  }

  /**
   * Intercepte la sélection de la photo/affiche pour l'Orateur Principal
   */
  onOrateurImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.file1 = file;
    }
  }

  /**
   * Ajoute un nouvel intervenant secondaire au FormArray (vide ou pré-rempli)
   */
  addIntervenant(intervenant?: any): void {
    const intervenantForm = this.fb.group({
      id: [intervenant ? intervenant.id : null],
      nom: [intervenant ? intervenant.nom : '', Validators.required],
      motif: [intervenant ? intervenant.motif : '', Validators.required],
      affichage: [intervenant ? intervenant.affichage : null]
    });

    this.intervenants.push(intervenantForm);
    this.intervenantFiles.push(null);
  }

  /**
   * Supprime un intervenant secondaire à un index précis
   */
  removeIntervenant(index: number): void {
    this.intervenants.removeAt(index);
    this.intervenantFiles.splice(index, 1);
  }

  /**
   * Intercepte l'événement d'upload de fichier propre à chaque ligne d'intervenant secondaire
   */
  onIntervenantImageSelected(event: any, index: number): void {
    const file = event.target.files[0];
    if (file) {
      this.intervenantFiles[index] = file;
    }
  }

  /**
   * Helper pour injecter les fichiers d'images secondaires et leurs index correspondants
   */
  private appendIntervenantFiles(formData: FormData): void {
    this.intervenantFiles.forEach((file, index) => {
      if (file) {
        formData.append(`intervenantImages`, file);
        formData.append(`intervenantIndexes`, index.toString());
      }
    });
  }

  /**
   * Remplit le formulaire réactif avec les données reçues de l'API en mode Édition
   */
  private patchForm(culte: any): void {
    this.culteForm.patchValue({
      nom: culte.nom,
      theme: culte.theme,
      sousTitre: culte.sousTitre,
      orateur: culte.orateur,
      moderateur: culte.moderateur,
      dateDebut: culte.dateDebut,
      dateFin: culte.dateFin,
      sousTheme: culte.sousTheme,
      description: culte.description
    });

    this.intervenants.clear();
    this.intervenantFiles = [];

    if (culte.intervenants && culte.intervenants.length > 0) {
      culte.intervenants.forEach((inter: any) => this.addIntervenant(inter));
    }
  }

  /**
   * Helper de validation retournant 'true' si le champ spécifié est invalide et touché
   */
  isInvalid(field: string): boolean {
    const control = this.culteForm.get(field);
    return !!(control && control.invalid && (control.touched || control.dirty));
  }

  /**
   * Réinitialise complètement le formulaire ainsi que les fichiers liés
   */
  resetForm(): void {
    this.culteForm.reset();
    this.intervenants.clear();
    this.intervenantFiles = [];
    this.file1 = null;
  }

  /**
   * Gère le basculement (Ouverture / Fermeture) des volets d'accordéons
   */
  toggle(section: number): void {
    if (section === 1) this.open1 = !this.open1;
    if (section === 2) this.open2 = !this.open2;
    if (section === 3) this.open3 = !this.open3;
  }
}
