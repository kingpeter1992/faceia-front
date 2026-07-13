import { ChangeDetectorRef, Component, effect, Inject, Injector, OnInit, runInInjectionContext } from '@angular/core';
import { FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DonationStore } from '../service/DonationStore';
import { DonationResponse } from '../models/DonationRequest';
import { Toast } from '../../../shared/utilities/Toast';
import { CommonModule } from '@angular/common';
import { Chart } from 'chart.js/auto';
import { OffranceComponent } from '../pages/offrance-component/offrance-component';
import { AuthStoreService } from '../../../core/service/auth/auth-store-service';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; // 👈 Importation directe corrigée
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-admin-component-finance',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule

  ],
  templateUrl: './admin-component-finance.html',
  styleUrl: './admin-component-finance.css',
})
export class AdminComponentFinance implements OnInit {
searchForm!: FormGroup;
  filteredDonations: any[] = [];


  // KPI state
  totalCDF = 0;
  totalUSD = 0;
  countOffrande = 0;
  countDime = 0;
  countDon = 0;

  // UI & Charts
  chart!: Chart;
  showChart = true;
  isDarkMode = false;

  // Pagination & Sorting
  page = 1;
  pageSize = 5;
sortColumn: keyof DonationResponse = 'date';
  sortDirection: 'asc' | 'desc' = 'desc';

  get paginatedDonations() {
    const start = (this.page - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.filteredDonations.slice(start, end);
  }

  get totalPages() {
    return Math.max(1, Math.ceil(this.filteredDonations.length / this.pageSize));
  }

  constructor(
    public donationStore: DonationStore,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
    private injector: Injector,
    private dialog: MatDialog,
    private auth: AuthStoreService
  ) {
    this.initSearchForm();
  }

ngOnInit() {
  this.donationStore.loadAllIfNeeded();
  runInInjectionContext(this.injector, () => {
    effect(() => {
      // 1. On écoute le signal de manière réactive à la racine de l'effet
      const data = this.donationStore.donations();
      // 2. On repousse l'exécution des calculs et du tri au prochain cycle de rendu
      setTimeout(() => {
        this.applyFiltersAndSort();
      });
    });
  });
}



  initSearchForm() {
    this.searchForm = this.fb.group({
      searchQuery: [''],
      typeDon: ['ALL'],
      devise: ['ALL'],
      dateDebut: [''],
      dateFin: [''],
      culte: ['']
    });

    this.searchForm.valueChanges.subscribe(() => {
      this.applyFiltersAndSort();
    });
  }

  applyFiltersAndSort() {
    const rawData = this.donationStore.donations() || [];
    const filters = this.searchForm.value;

    let result = [...rawData];

    // 1. Filtre par texte (Donateur ou note)
    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      result = result.filter(d =>
        (d.donateur && d.donateur.toLowerCase().includes(q)) ||
        (d.note && d.note.toLowerCase().includes(q))
      );
    }

    // 2. Filtre Type de don
    if (filters.typeDon && filters.typeDon !== 'ALL') {
      result = result.filter(d => d.typeDon === filters.typeDon);
    }

    // 3. Filtre Devise
    if (filters.devise && filters.devise !== 'ALL') {
      result = result.filter(d => d.devise === filters.devise);
    }

    // 4. Filtre Dates
    if (filters.dateDebut) {
      result = result.filter(d => new Date(d.date) >= new Date(filters.dateDebut));
    }
    if (filters.dateFin) {
      result = result.filter(d => new Date(d.date) <= new Date(filters.dateFin));
    }

    // 5. Filtre Culte
    if (filters.culte) {
      const c = filters.culte.toLowerCase();
      result = result.filter(d => d.culteNom && d.culteNom.toLowerCase().includes(c));
    }

    // Tri des données
    // Tri des données
    result.sort((a, b) => {
      // On indique à TypeScript que sortColumn est bien une clé de DonationResponse
      const valA = a[this.sortColumn as keyof DonationResponse];
      const valB = b[this.sortColumn as keyof DonationResponse];

      // Sécurité si une valeur est indéfinie ou null
      if (valA === undefined || valA === null) return this.sortDirection === 'asc' ? -1 : 1;
      if (valB === undefined || valB === null) return this.sortDirection === 'asc' ? 1 : -1;

      if (typeof valA === 'string' && typeof valB === 'string') {
        return this.sortDirection === 'asc'
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      } else {
        // Transtypage en number pour rassurer le compilateur sur l'opération arithmétique
        return this.sortDirection === 'asc'
          ? (valA as number) - (valB as number)
          : (valB as number) - (valA as number);
      }
    });

    this.filteredDonations = result;
    this.computeKPI();
    this.page = 1;

    setTimeout(() => {
      this.initChart();
    });

  }

sortBy(column: keyof DonationResponse) {
  if (this.sortColumn === column) {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
  } else {
    this.sortColumn = column;
    this.sortDirection = 'desc';
  }
  this.applyFiltersAndSort();
}

  computeKPI() {
    const data = this.filteredDonations;
    this.totalCDF = data.filter(d => d.devise === 'CDF').reduce((a, b) => a + b.montant, 0);
    this.totalUSD = data.filter(d => d.devise === 'USD').reduce((a, b) => a + b.montant, 0);
    this.countOffrande = data.filter(d => d.typeDon === 'offrande').length;
    this.countDime = data.filter(d => d.typeDon === 'dime').length;
    this.countDon = data.filter(d => d.typeDon === 'don').length;
  }

  initChart() {
  // --- Liste fixe des 12 mois de l'année ---
  const moisLabels = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc'];

  // --- GRAPHIQUE 1 : CASHFLOW MENSUEL COMPLET (Janvier à Décembre) ---
  const ctxCashflow = document.getElementById('cashflowChart') as HTMLCanvasElement;
  if (ctxCashflow) {
    const existingChart = Chart.getChart(ctxCashflow);
    if (existingChart) existingChart.destroy();

    const data = this.filteredDonations;

    // Initialisation d'un tableau de 12 zéros pour stocker les montants par mois
    const montantsParMois = new Array(12).fill(0);

    // Ventilation dynamique des dons réels dans le bon mois
    data.forEach(d => {
      if (d.date) {
        const dateObj = new Date(d.date);
        const moisIndex = dateObj.getMonth(); // Renvoie 0 pour Janvier, 1 pour Février, etc.

        if (moisIndex >= 0 && moisIndex < 12) {
          // Si c'est en USD, on peut appliquer un taux ou sommer séparément,
          // ici on convertit fictivement ou on somme la valeur absolue pour l'analyse brute
          montantsParMois[moisIndex] += d.montant;
        }
      }
    });

    new Chart(ctxCashflow, {
      type: 'bar',
      data: {
        labels: moisLabels,
        datasets: [{
          label: 'Flux Mensuel Recettes',
          data: montantsParMois, // Contient les vraies valeurs de Janv à Mai, et 0 pour le reste
          backgroundColor: '#6366f1',
          borderRadius: 6,
          barThickness: 'flex'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: { grid: { display: false }, ticks: { color: this.isDarkMode ? '#94a3b8' : '#64748b' } },
          y: { grid: { color: this.isDarkMode ? '#334155' : '#e2e8f0' }, ticks: { color: this.isDarkMode ? '#94a3b8' : '#64748b' } }
        }
      }
    });
  }

  // --- GRAPHIQUE 2 : RÉPARTITION PAR DEVISE (Barres Horizontales USD vs CDF) ---
  const ctxDevise = document.getElementById('deviseChart') as HTMLCanvasElement;
  if (ctxDevise) {
    const existingChart = Chart.getChart(ctxDevise);
    if (existingChart) existingChart.destroy();

    const data = this.filteredDonations;
    const totalCDF = data.filter(x => x.devise === 'CDF').reduce((a, b) => a + b.montant, 0);
    const totalUSD = data.filter(x => x.devise === 'USD').reduce((a, b) => a + b.montant, 0);

    new Chart(ctxDevise, {
      type: 'bar',
      data: {
        labels: ['USD', 'CDF'],
        datasets: [{
          data: [totalUSD, totalCDF],
          backgroundColor: ['#10b981', '#3b82f6'],
          borderRadius: 6,
          barThickness: 20
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: { grid: { color: this.isDarkMode ? '#334155' : '#e2e8f0' }, ticks: { color: this.isDarkMode ? '#94a3b8' : '#64748b' } },
          y: { grid: { display: false }, ticks: { color: this.isDarkMode ? '#94a3b8' : '#64748b' } }
        }
      }
    });
  }
}

  toggleChart() {
    this.showChart = !this.showChart;
    if (this.showChart) {
      setTimeout(() => this.initChart());
    }
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    setTimeout(() => this.initChart());
  }

openAddEditDialog(donation?: any) {
  this.dialog.open(OffranceComponent, {
    width: '80vw',
    height: '80vh',
    maxWidth: '85vw',
    maxHeight: '85vh',
    panelClass: 'premium-dialog-container',
    disableClose: true,
    // S'il y a un culte lié on passe son ID, sinon null pour une offrande libre
    data: {
      culteId: donation?.culteId || null,
      culteNom: donation?.culteNom || 'Hors Culte / Libre'
    }
  });
}

  deleteDonation(id: number) {
    if(confirm("Voulez-vous vraiment supprimer cette transaction ?")) {
      this.donationStore.delete(id);
    }
  }

  nextPage() { if (this.page < this.totalPages) this.page++; }
  prevPage() { if (this.page > 1) this.page--; }

  //roles: ['ADMIN', 'PASTEUR', 'RESPONSABLE_01', 'RESPONSABLE_02']

  hasRole(allowedRoles: string[]): boolean {
    const userRoles = this.auth.user()?.roles || [];
    return userRoles.some(
      role => allowedRoles.includes(role)
    );

  }



 // --- 🚀 1. GÉNÉRATION PDF PREMIUM ---
// --- 🚀 1. GÉNÉRATION PDF PREMIUM (PAYSAGE & COMPACT) ---// --- 🚀 1. GÉNÉRATION PDF PREMIUM (PAYSAGE, COMPACT & FORMAT CORRIGÉ) ---
  exportPDF(): void {
    const data = this.filteredDonations;
    if (data.length === 0) return;

    const doc = new jsPDF('l', 'mm', 'a4');

    const primaryColor = [79, 70, 229] as const;
    const slateColor = [15, 23, 42] as const;
    const grayText = [100, 116, 139] as const;
    const alternateBg = [248, 250, 252] as const;

    // Fonction locale de secours pour formater les montants sans causer de conflits d'encodage (remplace les espaces problématiques)
    const formatMontant = (val: number): string => {
      return val.toLocaleString('fr-FR').replace(/\s/g, ' ');
    };

    // En-tête
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('CMP BEL\'AIR-LSHI', 14, 20);

    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(grayText[0], grayText[1], grayText[2]);
    doc.text('Système de Gestion Financière', 14, 25);
    doc.text(`Généré le : ${new Date().toLocaleDateString('fr-FR')}`, 240, 20);

    doc.setDrawColor(226, 232, 240);
    doc.line(14, 28, 283, 28);

    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(slateColor[0], slateColor[1], slateColor[2]);
    doc.text('RAPPORT DES DONS ET ENTRÉES FILTRÉS', 14, 38);

    // --- BLOCS DE VUE KPI CORRIGÉS ---
    // Total USD
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(14, 44, 65, 18, 3, 3, 'F');
    doc.setFontSize(8);
    doc.setTextColor(grayText[0], grayText[1], grayText[2]);
    doc.text('TOTAL FILTRÉ USD', 18, 49);
    doc.setFontSize(12);
    doc.setTextColor(16, 185, 129);
    doc.text(`${formatMontant(this.totalUSD)} $`, 18, 57); // 💡 Applique le format nettoyé

    // Total CDF
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(94, 44, 65, 18, 3, 3, 'F');
    doc.setFontSize(8);
    doc.setTextColor(grayText[0], grayText[1], grayText[2]);
    doc.text('TOTAL FILTRÉ CDF', 98, 49);
    doc.setFontSize(12);
    doc.setTextColor(59, 130, 246);
    doc.text(`${formatMontant(this.totalCDF)} FC`, 98, 57); // 💡 Applique le format nettoyé

    // Nombre d'entrées
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(174, 44, 75, 18, 3, 3, 'F');
    doc.setFontSize(8);
    doc.setTextColor(grayText[0], grayText[1], grayText[2]);
    doc.text('RÉSULTATS DU FILTRE', 178, 49);
    doc.setFontSize(12);
    doc.setTextColor(slateColor[0], slateColor[1], slateColor[2]);
    doc.text(`${data.length} transactions enregistrées`, 178, 57);

    // --- CORPS DU TABLEAU CORRIGÉ ---
    const tableBody = data.map((d, index) => [
      index + 1,
      d.donateur,
      `${formatMontant(Number(d.montant))} ${d.devise === 'USD' ? '$' : 'FC'}`, // 💡 Changement ici
      d.typeDon ? d.typeDon.toUpperCase() : 'OFFRANDE',
      d.culteNom ? d.culteNom : 'Hors Culte (Libre)',
      d.date ? new Date(d.date).toLocaleDateString('fr-FR') : new Date().toLocaleDateString('fr-FR'),
      d.operation
    ]);

    autoTable(doc, {
      startY: 70,
      head: [['#', 'Donateur', 'Montant', 'Type de Don', 'Destination / Culte', 'Date', 'Opération']],
      body: tableBody,
      theme: 'grid',
      headStyles: {
        fillColor: primaryColor as any,
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        cellPadding: 2
      },
      alternateRowStyles: {
        fillColor: alternateBg as any
      },
      styles: {
        font: 'Helvetica',
        fontSize: 8,
        cellPadding: 2
      },
      columnStyles: {
        0: { cellWidth: 10 },
        2: { fontStyle: 'bold', cellWidth: 35 },
        5: { cellWidth: 30 }
      }
    });

    doc.save(`Rapport_Global_SmartChurch_${new Date().toISOString().slice(0, 10)}.pdf`);
  }
  // --- 🚀 2. EXPORT EXCEL PREMIUM FORMATÉ ---
  exportExcel(): void {
    const data = this.filteredDonations;
    if (data.length === 0) return;

    const dataRows = data.map((d, i) => ({
      'N°': i + 1,
      'Donateur': d.donateur,
      'Montant': d.montant,
      'Devise': d.devise,
      'Type de Contribution': (d.typeDon || '').toUpperCase(),
      'Contexte / Culte': d.culteNom || 'Hors Culte / Libre',
      'Date': d.date,
      'Mode de Paiement': d.operation
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Contributions');

    const nextRow = dataRows.length + 3;
    XLSX.utils.sheet_add_aoa(worksheet, [
      ['RÉSUMÉ DES ENTRÉES FILTRÉES', '', ''],
      ['Total Filtré USD :', `${this.totalUSD} $`],
      ['Total Filtré CDF :', `${this.totalCDF} FC`]
    ], { origin: `B${nextRow}` });

    worksheet['!cols'] = [
      { wch: 6 },  { wch: 22 }, { wch: 14 }, { wch: 10 },
      { wch: 22 }, { wch: 30 }, { wch: 15 }, { wch: 18 }
    ];

    XLSX.writeFile(workbook, `Excel_Global_SmartChurch_${new Date().toISOString().slice(0, 10)}.xlsx`);
  }

  // --- 🚀 3. IMPRESSION DU REÇU EN FORMAT TICKET (CORRIGÉ NaN & DEVISE) ---
  printReceipt(d: any): void {
  const printWindow = window.open('', '_blank', 'width=450,height=650');
  if (!printWindow) return;

  // Sécurité : si jamais Angular passe une référence réactive ou imbriquée
  const item = d.value ? d.value : d;

  const ctxCulte = item.culteNom ? `<b>Contexte:</b> ${item.culteNom}` : `<b>Contexte:</b> Versement Hors Culte`;
  const referenceId = item.id || Math.floor(1000 + Math.random() * 9000);

  // Conversion forcée et sécurisée du montant pour éviter le NaN
  const rawAmount = Number(item.montant);
  const formattedAmount = isNaN(rawAmount) ? '0' : rawAmount.toLocaleString('fr-FR');

  // Symbole de la devise de la ligne
  const currencySign = item.devise === 'USD' ? 'USD ($)' : 'CDF (FC)';

  printWindow.document.write(`
    <html>
    <head>
      <title>Reçu de Caisse - CMP BEL'AIR-LSHI</title>
      <style>
        @page { size: 80mm auto; margin: 0; }
        body {
          font-family: 'Courier New', Courier, monospace;
          width: 74mm; padding: 4mm 3mm; margin: 0;
          font-size: 12px; color: #000; line-height: 1.4;
        }
        .center { text-align: center; }
        .bold { font-weight: bold; }
        .header { font-size: 16px; font-weight: bold; margin-bottom: 2px; }
        .subtitle { font-size: 9px; text-transform: uppercase; margin-bottom: 12px; letter-spacing: 0.5px; }
        .divider { border-top: 1px dashed #000; margin: 8px 0; }
        .amount-card {
          border: 1px dashed #000; padding: 10px;
          text-align: center; font-size: 16px;
          font-weight: bold; margin: 12px 0;
        }
        .footer { font-size: 10px; margin-top: 18px; font-style: italic; }
      </style>
    </head>
    <body>
      <div class="center header">CMP BEL'AIR-LSHI</div>
      <div class="center subtitle">Caisse Centrale & Libéralités</div>

      <div><b>Reçu N°:</b> SC-2026-${referenceId}</div>
      <div><b>Date:</b> ${item.date ? new Date(item.date).toLocaleDateString('fr-FR') : new Date().toLocaleDateString('fr-FR')}</div>
      <div><b>Mode:</b> ${item.operation || 'Espèces'}</div>
      <div class="divider"></div>

      <div><b>Bien-aimé(e):</b> ${item.donateur || 'Anonyme'}</div>
      <div><b>Libellé:</b> ${(item.typeDon || 'OFFRANDE').toUpperCase()}</div>
      <div>${ctxCulte}</div>

      <div class="divider"></div>

      <div class="amount-card">
        NET PAYÉ : ${formattedAmount} ${currencySign}
      </div>

      <div class="divider"></div>
      <div class="center footer">
        Que l'Éternel se souvienne de votre obéissance.<br>
        « Donnez, et il vous sera donné »
      </div>

      <script>
        window.onload = function() {
          window.print();
          setTimeout(function() { window.close(); }, 300);
        };
      </script>
    </body>
    </html>
  `);
  printWindow.document.close();
}
}
