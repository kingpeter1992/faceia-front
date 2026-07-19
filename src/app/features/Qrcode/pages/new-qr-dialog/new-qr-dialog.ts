import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { GenerateQrRequest, QRType } from '../../models/QrModule';
import { GenerateQrResponse } from '../../../activites/models/culte.model';
import { QrManagementStore } from '../../services/qr-management.store';
import { Clipboard } from '@angular/cdk/clipboard'; // Vérifie l'import cdk
import { MessageService } from 'primeng/api';
import jsPDF from 'jspdf';


@Component({
  selector: 'app-new-qr-dialog',
  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    SelectModule,
    InputTextModule,
    ButtonModule

  ],
  templateUrl: './new-qr-dialog.html',
  styleUrl: './new-qr-dialog.css',
})
export class NewQrDialog {

private clipboard=inject(Clipboard);
private store=inject(QrManagementStore);
private toast=inject(MessageService);
generated=false;
loading=false;
result?:GenerateQrResponse;
constructor(public config: DynamicDialogConfig,public ref:DynamicDialogRef,
) {
  // Si le parent passe un ID, on l'injecte
  if (this.config.data?.culteId) {
    this.form.culteId = this.config.data.culteId;
  }
}





types = [
  {
    value: QRType.COMPTAGE,
    label: 'Comptage',
    icon: '📊',
    description: 'Comptage des fidèles'
  },
  {
    value: QRType.INSCRIPTION,
    label: 'Inscription',
    icon: '📝',
    description: 'Inscription visiteurs'
  },
  {
    value: QRType.EVENEMENT,
    label: 'Evènement',
    icon: '🎉',
    description: 'Evènement'
  },
  {
    value: QRType.OFFRANDE,
    label: 'Offrande',
    icon: '💰',
    description: 'Collecte'
  }
];

// Formulaire épuré (seulement les champs d'envoi)
// Initialisation propre typée
  form: GenerateQrRequest = {
    culteId: 0, // Ou l'ID du culte courant
    type: QRType.COMPTAGE, // Valeur initiale valide selon ton union type
    expirationMinutes: 1440,
    maxUses: 1,
    note: ''
  };


  selectType(type: QRType) {
    this.form.type = type;
}


save() {
  this.loading = true;

  // Création d'une copie du formulaire pour nettoyer les données avant envoi
  const payload: GenerateQrRequest = { ...this.form };

  // Si culteId est 0 ou null, on le retire ou on le met à null pour le backend
  if (!payload.culteId || payload.culteId <= 0) {
    payload.culteId = null as any;
  }

  this.store.generate(payload, (qr) => {
    this.loading = false;
    this.result = qr;
    this.generated = true;
    this.toast.add({severity: 'success', summary: 'Succès', detail: 'QR généré'});
  });
}

// Correction : Utilisation directe du Base64 du backend
  get qrImageBase64() {
    return this.result?.qrCode ? `data:image/png;base64,${this.result.qrCode}` : '';
  }

  copyLink() {
    if (!this.result?.url) return;
    this.clipboard.copy(this.result.url);
    this.toast.add({severity: 'info', summary: 'Copié', detail: 'Lien dans le presse-papier'});
  }

  downloadPNG() {
    if (!this.result?.qrCode) return;
    const link = document.createElement('a');
    link.href = this.qrImageBase64;
    link.download = `QR_${this.result.token}.png`;
    link.click();
  }

  downloadPDF() {
    if (!this.result?.qrCode) return;
    const doc = new jsPDF();
    doc.text("Code QR - Eglise", 10, 10);
    doc.addImage(this.qrImageBase64, 'PNG', 50, 30, 100, 100);
    doc.save(`QR_${this.result.token}.pdf`);
  }

  openLink() {
    if (this.result?.url) window.open(this.result.url, '_blank');
  }

  close() {
    // Si on a généré un QR, on envoie 'true' pour que le parent recharge
    this.ref.close(this.generated);
  }

}
