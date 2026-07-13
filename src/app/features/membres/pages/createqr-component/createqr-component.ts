import { Component, inject } from '@angular/core';
// Imports PrimeNG & Bibliothèques tierces
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
// ✅ CORRECTION ICI : On importe QRCodeComponent au lieu de QRCodeModule
import { QRCodeComponent } from 'angularx-qrcode';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

// 1. L'import en haut du fichier doit être présent



@Component({
  selector: 'app-createqr-component',
imports: [
   CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    QRCodeComponent
  ],
  templateUrl: './createqr-component.html',
  styleUrl: './createqr-component.css',
})
export class CreateqrComponent {
}
