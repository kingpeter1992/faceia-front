import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { Component, computed, inject, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DonationStore } from '../../../finances/service/DonationStore';
import { ComptageStore } from '../../services/ComptageStore';
import { CulteStore } from '../../services/CulteStore';
// 📜 IMPORTATION DES LIBRAIRIES DE GÉNÉRATION PDF
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-resume-component',
  standalone: true,
  imports: [CommonModule, DatePipe, DecimalPipe],
  providers: [DatePipe, DecimalPipe], // Utiles pour formater dans le code TS
  templateUrl: './resume-component.html',
  styleUrl: './resume-component.css',
})
export class ResumeComponent implements OnInit {
  public donationStore = inject(DonationStore);
  public culteStore = inject(CulteStore);
  public comptageStore = inject(ComptageStore);
  private dialogRef = inject(MatDialogRef<ResumeComponent>);
  private datePipe = inject(DatePipe);
  private decimalPipe = inject(DecimalPipe);

  today: Date = new Date();
  culteId!: number;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.culteId = Number(this.data?.culteId || this.data?.id);
  }

  ngOnInit(): void {
    // Chargement automatique des stores si nécessaire
    this.comptageStore.loadAllIfNeeded();
    this.culteStore.loadAllIfNeeded();
    this.donationStore.loadAllIfNeeded();
  }

  // 🏛️ Récupération réactive des détails du culte
  culte = computed(() => {
    return this.culteStore.cultes().find((c: any) => c.id === this.culteId);
  });

  // 👥 Récupération réactive de la fiche d'assistance
  assistance = computed(() => {
    return this.comptageStore.comptages().find((a: any) => a.culteId === this.culteId);
  });

  // 💎 Filtrage des donations liées
  culteDonations = computed(() => {
    return this.donationStore.donations().filter((d: any) => d.culteId === this.culteId);
  });

  // 📊 Totaux Financiers calculés
  get totalUSD(): number {
    return this.culteDonations()
      .filter((d: any) => d.devise === 'USD')
      .reduce((sum, d) => sum + (d.montant || 0), 0);
  }

  get totalCDF(): number {
    return this.culteDonations()
      .filter((d: any) => d.devise === 'CDF')
      .reduce((sum, d) => sum + (d.montant || 0), 0);
  }

// 🖨️ MOTEUR DE GÉNÉRATION PDF PROFESSIONNEL (jsPDF + AutoTable)
imprimerPdf(): void {
    const doc = new jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: 'a4'
    });

    const c = this.culte();
    const a = this.assistance();
    const donations = this.culteDonations();

    // --- 1. EN-TÊTE CORPORATE ---
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139); // Slate Grey
    doc.text('E-CHURCH MANAGEMENT SYSTEM', 14, 15);

    doc.setFontSize(8);
    doc.setFont('Helvetica', 'normal');
    doc.text(`Généré le : ${this.datePipe.transform(this.today, 'dd/MM/yyyy à HH:mm')}`, 196, 15, { align: 'right' });

    // Ligne de séparation supérieure fine
    doc.setDrawColor(15, 23, 42); // Navy / Charcoal
    doc.setLineWidth(0.5);
    doc.line(14, 18, 196, 18);

    // Titre principal du document
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(15, 23, 42);
    doc.text(c?.nom || 'RAPPORT DE SYNTHÈSE', 14, 28);

    // Métadonnées du Culte (Sous-titre / Thématique)
    doc.setFontSize(11);
    doc.setFont('Helvetica', 'italic');
    doc.setTextColor(71, 85, 105);
    doc.text(`Session du ${this.datePipe.transform(c?.dateDebut, 'EEEE dd MMMM yyyy')} — Thème : « ${c?.theme || 'Non spécifié'} »`, 14, 34);

    // --- 2. SECTION CONFIGURATION & HORAIRES ---
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.text('1. Planification & Équipe de Service', 14, 46);

    autoTable(doc, {
      startY: 49,
      theme: 'plain',
      head: [],
      body: [
        ['Type de Session :', c?.sousTitre || 'N/A', 'Orateur / Prédicateur :', c?.orateur || 'N/A'],
        ['Heure Début :', this.datePipe.transform(c?.dateDebut, 'HH:mm') || 'N/A', 'Modérateur :', c?.moderateur || 'N/A'],
        ['Heure Fin Clôture :', this.datePipe.transform(c?.dateFin, 'HH:mm') || 'N/A', 'Description :', c?.description || 'N/A']
      ],
      styles: { fontSize: 9, cellPadding: 3, textColor: [51, 65, 85] },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 30 },
        1: { cellWidth: 60 },
        2: { fontStyle: 'bold', cellWidth: 40 },
        3: { cellWidth: 60 }
      }
    });

    // On récupère proprement la fin du premier tableau
    let currentY = (doc as any).lastAutoTable.finalY || 90;

    // --- 3. SECTION ASSISTANCE ---
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.text('2. Statistiques d\'Assistance Démographique', 14, currentY + 12);

    autoTable(doc, {
      startY: currentY + 17,
      theme: 'striped',
      headStyles: { fillColor: [30, 41, 59], textColor: [255, 255, 255], fontStyle: 'bold' },
      head: [['Hommes', 'Femmes', 'Jeunes', 'Enfants', 'Audience Globale']],
      body: [[
        a?.hommes || 0,
        a?.femmes || 0,
        a?.jeunes || 0,
        a?.enfants || 0,
        { content: `${a?.total || 0} Fidèles`, fontStyle: 'bold', textColor: [79, 70, 229] }
      ]],
      styles: { halign: 'center', fontSize: 10, cellPadding: 5 }
    });

    currentY = (doc as any).lastAutoTable.finalY;

    // --- 4. SECTION FINANCES (RÉSUMÉ DES RECETTES) ---
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.text('3. Situation Synthétique des Libéralités', 14, currentY + 12);

    autoTable(doc, {
      startY: currentY + 17,
      theme: 'grid',
      headStyles: { fillColor: [71, 85, 105], textColor: [255, 255, 255] },
      head: [['Indicateur Financier', 'Volume de Transactions', 'Montant Global Arrêté']],
      body: [
        ['Recettes Clôturées en Dollar Américain (USD)', `${donations.filter(d => d.devise === 'USD').length}`, `${this.decimalPipe.transform(this.totalUSD, '1.2-2')} $`],
        ['Recettes Clôturées en Franc Congolais (CDF)', `${donations.filter(d => d.devise === 'CDF').length}`, `${this.decimalPipe.transform(this.totalCDF, '1.0-0')} FC`]
      ],
      styles: { fontSize: 10, cellPadding: 4 },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 95 },
        1: { halign: 'center', cellWidth: 45 },
        2: { fontStyle: 'bold', halign: 'right', cellWidth: 42 }
      }
    });

    currentY = (doc as any).lastAutoTable.finalY;

    // --- 5. JOURNAL DE CAISSE DE CULTE (TABLEAU COMPTABLE) ---
    if (donations.length > 0) {
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(15, 23, 42);
      doc.text('4. Grand Livre des Entrées (Détails Saisis)', 14, currentY + 12);

      const tableBody = donations.map(item => [
        item.donateur,
        (item.typeDon || '').split('_').join(' ').toUpperCase(),
        item.operation || 'Espèces',
        `${this.decimalPipe.transform(item.montant, '1.2-2')} ${item.devise}`
      ]);

      autoTable(doc, {
        startY: currentY + 17,
        theme: 'striped',
        headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255] },
        head: [['Donateur / Libellé', 'Catégorie de Don', 'Mode de Flux', 'Montant Alloué']],
        body: tableBody,
        styles: { fontSize: 9, cellPadding: 3.5 },
        columnStyles: {
          0: { cellWidth: 65 },
          1: { cellWidth: 50 },
          2: { cellWidth: 35 },
          3: { halign: 'right', fontStyle: 'bold', cellWidth: 32 }
        }
      });

      currentY = (doc as any).lastAutoTable.finalY;
    }

    // --- 6. BLOC DE SIGNATURE ADMINISTRATIVE ---
    const finalY = currentY + 25;
    if (finalY < 240) {
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(51, 65, 85);
      doc.text('Le Trésorier de Culte', 40, finalY, { align: 'center' });
      doc.text('Le Secrétariat Administratif', 150, finalY, { align: 'center' });

      doc.setDrawColor(148, 163, 184);
      doc.setLineWidth(0.2);
      doc.line(15, finalY + 20, 65, finalY + 20);
      doc.line(125, finalY + 20, 175, finalY + 20);
    }

    // Sauvegarde & Téléchargement
    doc.save(`Resume_Culte_${c?.nom ? c.nom.replace(/\s+/g, '_') : 'Session'}.pdf`);
  }

  close(): void {
    this.dialogRef.close();
  }
}
