import {
  Component,
  ChangeDetectionStrategy,
  computed,
  inject,
  OnInit,
  HostBinding
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { QrManagementStore } from '../../services/qr-management.store';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { ToolbarModule } from 'primeng/toolbar';
import { DialogModule } from 'primeng/dialog';
import { DialogService } from 'primeng/dynamicdialog';
import { NewQrDialog } from '../new-qr-dialog/new-qr-dialog';
import jsPDF from 'jspdf';
import { ToastModule } from 'primeng/toast';
import { Toast } from '../../../../shared/utilities/Toast';

@Component({
  selector: 'app-dashboardqr',
  standalone: true,
  imports: [
CommonModule,
    CommonModule,
    FormsModule,
    CardModule,
    TableModule,
    ButtonModule,
    TagModule,
    SelectModule,
    InputTextModule,
    DialogModule,
    ToastModule
  ],
  templateUrl: './dashboardqr.html',
  styleUrl: './dashboardqr.css',
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class Dashboardqr implements OnInit {

  store = inject(QrManagementStore);
  dialog = inject(DialogService);
  toast =  inject(Toast)
  qrs = this.store.qrs;
  actifs = this.store.qrActifs;
  expires = this.store.qrExpires;
  utilises = this.store.qrUtilises;
  revokes = this.store.qrRevokes;
  isDarkMode = false;
  recherche = '';
  filtreType: any;
  filtreStatus: any;

  // Correction pour l'erreur TS2339
  stats = computed(() => [
    {
        label: 'Actifs',
        val: this.actifs(),
        icon: '🟢'
    },
    {
        label: 'Expirés',
        val: this.expires(),
        icon: '⏳'
    },
    {
        label: 'Utilisés',
        val: this.utilises(),
        icon: '✅'
    },
    {
        label: 'Révoqués',
        val: this.revokes(),
        icon: '🚫'
    }
]);
  loading() { return false; }
  // Pour appliquer la classe au conteneur host
  @HostBinding('class.dark-mode') get darkMode() { return this.isDarkMode; }



  typesQr = [
    {
      label: 'Inscription membre',
      value: 'INSCRIPTION'
    },
    {
      label: 'Comptage culte',
      value: 'COMPTAGE'
    },
    {
      label: 'Événement',
      value: 'EVENEMENT'
    },
    {
      label: 'Offrande',
      value: 'OFFRANDE'
    },
    {
      label: 'Visiteur',
      value: 'VISITEUR'
    }
  ];

  statusQr = [
    'ACTIVE',
    'USED',
    'EXPIRED',
    'REVOKED'
  ];

  ngOnInit() {

    this.store.load();

  }

  filteredQrs = computed(() => {

    return this.qrs()

      .filter(q => {

        const okType = !this.filtreType || q.type === this.filtreType;

        const okStatus = !this.filtreStatus || q.status === this.filtreStatus;

        const okRecherche =

          !this.recherche ||

          q.note?.toLowerCase().includes(this.recherche.toLowerCase()) ||

          q.token.toLowerCase().includes(this.recherche.toLowerCase());

        return okType && okStatus && okRecherche;

      });

  });



  getTypeIcon(type: string) {
    switch (type) {
      case 'COMPTAGE':
        return '⛪';
      case 'INSCRIPTION':
        return '👤';
      case 'EVENEMENT':
        return '🎉';
      case 'OFFRANDE':
        return '💰';
      case 'VISITEUR':
        return '🤝';
      default:
        return '📱';
    }

  }
  openNewQr() {
    this.dialog.open(NewQrDialog, {
      data: { isDarkMode: this.isDarkMode }, // On passe l'état
      styleClass: this.isDarkMode ? 'dark-mode-dialog' : '',
      width: '1000px'
    });
  }


  // Variables d'état
displayQrDialog = false;
selectedQr: any = null;

// Méthode pour ouvrir le dialogue
viewQr(qr: any) {
  this.selectedQr = qr;
  this.displayQrDialog = true;
}

// Méthodes d'action
copyLink(url: string) {
  navigator.clipboard.writeText(url);
  this.toast.info('Copié');
}

downloadPNG(qr: any) {
  const link = document.createElement('a');
  link.href = qr.qrCode; // Déjà en base64 selon ton JSON
  link.download = `QR_${qr.token}.png`;
  link.click();
}

downloadPDF(qr: any) {
  const doc = new jsPDF();
  doc.text("Code QR - Eglise", 10, 10);
  doc.addImage(qr.qrCode, 'PNG', 50, 30, 100, 100);
  doc.save(`QR_${qr.token}.pdf`);
}

openLink(url: string) {
  window.open(url, '_blank');
}
}
