import { Component, Inject, OnInit, computed } from '@angular/core'; // 👈 Changement ici : computed au lieu d'effect
import { FormGroup, FormBuilder, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { CulteResponse } from '../../../activites/models/culte.model';
import { CommonModule } from '@angular/common';
import { DonationStore } from '../../service/DonationStore';
import { Toast } from '../../../../shared/utilities/Toast';
import { Router } from '@angular/router';


@Component({
  selector: 'app-offrance-component',
  standalone: true,
  imports: [
   MatCardModule,
    MatButtonModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatTableModule,
    MatInputModule,
    MatIconModule,
    CommonModule,        // 👈 OBLIGATOIRE pour *ngFor
    ReactiveFormsModule  // 👈 OBLIGATOIRE pour formGroup/formArray
  ],
  templateUrl: './offrance-component.html',
  styleUrl: './offrance-component.css',
})
export class OffranceComponent {
  culte!: any;
  form: FormGroup;
  showExisting = false; // Gère l'état d'ouverture de la section déroulable

  // 🎯 CALCUL DE L'ID DU CULTE EN AMONT
  targetCulteId = computed(() => {
    return this.data?.culteId ?? this.data?.id ?? this.culte?.id ?? null;
  });

  // 💎 REACTION REACTIVE SANS CONTEXTE D'INJECTION (Résout NG0203 et NG0100)
  existingDonations = computed(() => {
    const id = this.targetCulteId();
    const tousLesDons = this.donationStore.donations();
    if (!id) return [];
    return tousLesDons.filter((d: any) => d.culteId === Number(id));
  });

  constructor(
    private fb: FormBuilder,
    private router: Router,
    public donationStore: DonationStore,
    private dialogRef: MatDialogRef<OffranceComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.culte = this.data?.culte ? this.data.culte : this.data;

    this.form = this.fb.group({
      rows: this.fb.array([])
    });

    this.addRow();
  }

  ngOnInit(): void {
    const targetCulteId = this.targetCulteId();
    if (targetCulteId) {
      // On déclenche simplement le chargement. Le computed s'occupe de la mise à jour fluide.
      this.donationStore.loadByCulte(Number(targetCulteId));
    }
  }

  get rows(): FormArray {
    return this.form.get('rows') as FormArray;
  }

  get totalUSD(): number {
    return this.rows.value
      .filter((r: any) => r.devise === 'USD')
      .reduce((sum: number, r: any) => sum + (+r.montant || 0), 0);
  }

  get totalCDF(): number {
    return this.rows.value
      .filter((r: any) => r.devise === 'CDF')
      .reduce((sum: number, r: any) => sum + (+r.montant || 0), 0);
  }

  createRow(): FormGroup {
    return this.fb.group({
      donateur: ['', Validators.required],
      montant: [0, [Validators.required, Validators.min(1)]],
      devise: ['USD'],
      date: [new Date().toISOString().substring(0, 10), Validators.required],
      operation: ['Espèces'],
      typeDon: ['offrande']
    });
  }

  addRow(): void {
    this.rows.push(this.createRow());
  }

  removeRow(index: number): void {
    this.rows.removeAt(index);
  }

  toggleExistingSection(): void {
    this.showExisting = !this.showExisting;
  }

  submit(): void {
    if (this.rows.length === 0) return;

    const validRows = this.rows.value.filter((r: any) =>
      r.donateur && r.montant > 0
    );

    if (validRows.length === 0) {
      return;
    }

    const targetCulteId = this.targetCulteId();

    this.donationStore.createMany(
      targetCulteId,
      validRows,
      () => {
        this.dialogRef.close();
        this.router.navigateByUrl('/dashboard');
      }
    );
  }

  close(): void {
    this.dialogRef.close();
  }
}
