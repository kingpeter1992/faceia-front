import { Component, effect, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComptageStore } from '../../services/ComptageStore';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { NgApexchartsModule, ChartComponent } from 'ng-apexcharts';
import { CulteStore } from '../../services/CulteStore';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ChurchComptage } from '../church-comptage/church-comptage';
@Component({
  selector: 'app-assistance-culte',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    InputTextModule,
    ButtonModule,
    NgApexchartsModule, // <-- Ajouté ici
    // 👈 Doit être présent ici
    IconFieldModule,
    InputIconModule,
    CommonModule,
    ReactiveFormsModule
  ],
  providers: [DialogService], // 🌟 Obligatoire pour utiliser le service de fenêtres dynamiques
  templateUrl: './assistance-culte.html',
  styleUrl: './assistance-culte.css',
})
export class AssistanceCulte implements OnInit {
  @ViewChild('chart') chart!: ChartComponent;
  private fb = inject(FormBuilder);
  // À ajouter au niveau des propriétés de votre classe
  displayEditDialog: boolean = false;
  selectedComptage: any = null;

  private dialogService = inject(DialogService); // 🌟 Injection du service
private ref: DynamicDialogRef<any> | null | undefined;
  showChart = true;
  searchForm!: FormGroup;
  filteredComptages: any[] = [];
  isDarkMode = false;
  public chartOptions: any;

  // KPI States
  totalPresences = 0;
  totalHommes = 0;
  totalFemmes = 0;
  totalJeunes = 0;
  totalEnfants = 0;

  // Pagination
  page = 1;
  pageSize = 5;

  constructor(private comptageStore: ComptageStore, private culteStore: CulteStore) {
    // Écoute réactive des changements sur les stores
    effect(() => {
      this.applyFilters();
    });
  }

  get paginatedComptages() {
    const start = (this.page - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.filteredComptages.slice(start, end);
  }

  get totalPages() {
    return Math.max(1, Math.ceil(this.filteredComptages.length / this.pageSize));
  }

  ngOnInit() {
    this.initSearchForm();
    this.initChartStructure();

    // Chargement des données
    this.comptageStore.loadAllIfNeeded();
    this.culteStore.loadAllIfNeeded();
  }

  initSearchForm() {
    this.searchForm = this.fb.group({
      searchTerm: [''],
      dateDebut: [''],
      dateFin: ['']
    });

    this.searchForm.valueChanges.subscribe(() => {
      this.applyFilters();
    });
  }

  initChartStructure() {
    this.chartOptions = {
      series: [],
      chart: {
        height: 380,
        type: 'line',
        stacked: false,
        toolbar: { show: false },
        fontFamily: 'Inter, sans-serif'
      },
      colors: ['#3b82f6', '#10b981', '#f43f5e', '#8b5cf6'],
      stroke: {
        width: [0, 3, 3, 3], // 0 pour la colonne (Total), 3 pour les lignes de tendances
        curve: 'smooth'
      },
      plotOptions: {
        bar: {
          columnWidth: '40%',
          borderRadius: 6
        }
      },
      dataLabels: {
        enabled: false
      },
      xaxis: {
        type: 'category',
        categories: [
          'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
          'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
        ],
        labels: { style: { colors: '#64748b', fontWeight: 500 } }
      },
      yaxis: {
        labels: { style: { colors: '#64748b' } },
        title: { text: "Nombre de personnes", style: { color: '#64748b' } }
      },
      grid: { borderColor: '#e2e8f0' },
      tooltip: { shared: true, intersect: false }
    };
  }

  updateChartData() {
    // 1. Initialiser des tableaux vides pour les 12 mois de l'année (index 0 à 11)
    const mensuelTotal = Array(12).fill(0);
    const mensuelHommes = Array(12).fill(0);
    const mensuelFemmes = Array(12).fill(0);
    const mensuelJeunesEnfants = Array(12).fill(0);

    // 2. Accumuler les données par mois
    this.filteredComptages.forEach(c => {
      if (c.dateCulte) {
        const date = new Date(c.dateCulte);
        const mois = date.getMonth();

        if (mois >= 0 && mois < 12) {
          mensuelTotal[mois] += (c.total || 0);
          mensuelHommes[mois] += (c.hommes || 0);
          mensuelFemmes[mois] += (c.femmes || 0);
          mensuelJeunesEnfants[mois] += ((c.jeunes || 0) + (c.enfants || 0));
        }
      }
    });

    // 3. Injection des données mixées
    this.chartOptions = {
      ...this.chartOptions,
      series: [
        {
          name: 'Total Général',
          type: 'column',
          data: mensuelTotal
        },
        {
          name: 'Hommes 👨',
          type: 'line',
          data: mensuelHommes
        },
        {
          name: 'Femmes 👩',
          type: 'line',
          data: mensuelFemmes
        },
        {
          name: 'Jeunes & Enfants 🧑‍🦱',
          type: 'line',
          data: mensuelJeunesEnfants
        }
      ]
    };
  }

  applyFilters() {
    const rawComptages = this.comptageStore.comptages() || [];
    const listeDesCultes = this.culteStore.cultes() || [];

    // Jointure dynamique
    let list = rawComptages.map(comptage => {
      const culteInfo = listeDesCultes.find((c: any) => c.id === comptage.culteId);

      return {
        ...comptage,
        culteNom: culteInfo ? culteInfo.nom : `Réunion #${comptage.culteId}`,
        dateCulte: culteInfo ? culteInfo.dateDebut : null
      };
    });

    // Gestion des filtres du formulaire
    const filters = this.searchForm?.value || {};

    if (filters.searchTerm) {
      const search = filters.searchTerm.toLowerCase();
      list = list.filter(c => c.culteNom?.toLowerCase().includes(search));
    }
    if (filters.dateDebut && filters.dateDebut !== '') {
      list = list.filter(c => c.dateCulte && new Date(c.dateCulte) >= new Date(filters.dateDebut));
    }
    if (filters.dateFin && filters.dateFin !== '') {
      list = list.filter(c => c.dateCulte && new Date(c.dateCulte) <= new Date(filters.dateFin));
    }

    this.filteredComptages = list;
    this.computeKPI();
    this.updateChartData();
    this.page = 1;
  }

  computeKPI() {
    const data = this.filteredComptages;
    this.totalPresences = data.reduce((acc, curr) => acc + (curr.total || 0), 0);
    this.totalHommes = data.reduce((acc, curr) => acc + (curr.hommes || 0), 0);
    this.totalFemmes = data.reduce((acc, curr) => acc + (curr.femmes || 0), 0);
    this.totalJeunes = data.reduce((acc, curr) => acc + (curr.jeunes || 0), 0);
    this.totalEnfants = data.reduce((acc, curr) => acc + (curr.enfants || 0), 0);
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    this.chartOptions.grid = { borderColor: this.isDarkMode ? '#334155' : '#e2e8f0' };
  }

  nextPage() { if (this.page < this.totalPages) this.page++; }
  prevPage() { if (this.page > 1) this.page--; }
  exportExcel() {
    if (this.filteredComptages.length === 0) {
      alert("Aucune donnée à exporter.");
      return;
    }

    // 1. Formatage des données pour Excel
    const dataToExport = this.filteredComptages.map((c, index) => ({
      'N°': index + 1,
      'Culte / Réunion': c.culteNom,
      'Date': c.dateCulte ? new Date(c.dateCulte).toLocaleDateString('fr-FR') : 'N/A',
      'Hommes': c.hommes || 0,
      'Femmes': c.femmes || 0,
      'Jeunes': c.jeunes || 0,
      'Enfants': c.enfants || 0,
      'Total': c.total || 0
    }));

    // 2. Création du classeur Excel
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Assistance');

    // Ajustement automatique de la largeur des colonnes
    const maxProps = [{ wch: 5 }, { wch: 30 }, { wch: 15 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }];
    worksheet['!cols'] = maxProps;

    // 3. Génération et téléchargement du fichier
    const dateStr = new Date().toISOString().split('T')[0];
    XLSX.writeFile(workbook, `Rapport_Assistance_${dateStr}.xlsx`);
  }

  exportPdf() {
    if (this.filteredComptages.length === 0) {
      alert("Aucune donnée à exporter.");
      return;
    }

    const doc = new jsPDF();
    const dateStr = new Date().toLocaleDateString('fr-FR');

    // 1. En-tête du document style Premium Finance
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(20);
    doc.setTextColor(79, 70, 229); // Couleur Indigo d'E-Church
    doc.text('CMP BEL\'AIR', 14, 20);

    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(14);
    doc.setTextColor(100, 116, 139); // Slate muted
    doc.text('Rapport Analytique des Présences et Assistances', 14, 28);

    doc.setFontSize(10);
    doc.text(`Généré le : ${dateStr}`, 14, 35);

    // Ligne de séparation
    doc.setDrawColor(226, 232, 240);
    doc.line(14, 38, 196, 38);

    // 2. Préparation des lignes du tableau
    const tableRows = this.filteredComptages.map((c, index) => [
      index + 1,
      c.culteNom,
      c.dateCulte ? new Date(c.dateCulte).toLocaleDateString('fr-FR') : 'N/A',
      c.hommes || 0,
      c.femmes || 0,
      c.jeunes || 0,
      c.enfants || 0,
      c.total || 0
    ]);

    // 3. Génération du tableau avec jsPDF-AutoTable
    autoTable(doc, {
      startY: 45,
      head: [['N°', 'Culte / Réunion', 'Date', 'H', 'F', 'J', 'E', 'Total']],
      body: tableRows,
      theme: 'grid',
      headStyles: {
        fillColor: [79, 70, 229], // Fond Indigo pour les entêtes
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        halign: 'center'
      },
      columnStyles: {
        0: { cellWidth: 10, halign: 'center' },
        1: { cellWidth: 60 },
        2: { cellWidth: 25, halign: 'center' },
        3: { halign: 'center' },
        4: { halign: 'center' },
        5: { halign: 'center' },
        6: { halign: 'center' },
        7: { fontStyle: 'bold', halign: 'center', fillColor: [243, 244, 246] } // Total mis en valeur
      },
      styles: {
        font: 'Helvetica',
        fontSize: 10,
        cellPadding: 4
      },
      alternateRowStyles: {
        fillColor: [249, 250, 251] // Lignes alternées grises claires
      }
    });

    // 4. Sauvegarde du PDF
    const fileDate = new Date().toISOString().split('T')[0];
    doc.save(`Rapport_Assistance_${fileDate}.pdf`);
  }


  // 📝 Action : Modifier un comptage
  editComptage(comptage: any) {
    console.log("Ouverture du formulaire ChurchComptage pour :", comptage);

    // 🌟 Ouverture dynamique du composant ChurchComptage dans un Modal PrimeNG
    this.ref = this.dialogService.open(ChurchComptage, {
      header: `Modifier les présences - ${comptage.culteNom}`,
      width: '50%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true,
      // On passe les données du comptage actuel au composant enfant via la config data
      data: {
        comptage: comptage
      }
    });

    // Écoute de la fermeture du modal (quand l'utilisateur clique sur Enregistrer)
    this.ref?.onClose.subscribe((dataSaved: boolean) => {
      if (dataSaved) {
        this.applyFilters(); // Recalcule les KPI et rafraîchit le graphique automatiquement !
      }
    });
  }


  // ❌ Action : Supprimer un comptage
  deleteComptage(comptage: any) {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le comptage pour "${comptage.culteNom}" ?`)) {
      console.log("Supprimer l'ID :", comptage.id);
      // Exemple d'appel au store si la méthode existe :
      // this.comptageStore.delete(comptage.id);
    }
  }

  // 🖨️ Action : Imprimer un reçu au format Ticket de caisse / Reçu de caisse condensé
  printReceipt(c: any) {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [80, 150] // Format ticket standard de 80mm de large
    });

    const dateStr = c.dateCulte ? new Date(c.dateCulte).toLocaleDateString('fr-FR') : 'N/A';
    const heureStr = c.dateCulte ? new Date(c.dateCulte).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : '';

    // En-tête du ticket
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('BEL\'AIR', 40, 12, { align: 'center' });

    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(9);
    doc.text('FICHE D\'ASSISTANCE', 40, 18, { align: 'center' });
    doc.text('-------------------------------------------------------', 40, 22, { align: 'center' });

    // Détails du Culte
    doc.setFontSize(9);
    doc.text(`Culte : ${c.culteNom}`, 10, 28);
    doc.text(`Date  : ${dateStr} ${heureStr}`, 10, 34);
    doc.text('-------------------------------------------------------', 40, 40, { align: 'center' });

    // Tableau des présences
    doc.setFont('Helvetica', 'bold');
    doc.text('Catégorie', 10, 46);
    doc.text('Présents', 70, 46, { align: 'right' });
    doc.setFont('Helvetica', 'normal');

    doc.text('Hommes', 10, 54);
    doc.text(`${c.hommes || 0}`, 70, 54, { align: 'right' });

    doc.text('Femmes', 10, 60);
    doc.text(`${c.femmes || 0}`, 70, 60, { align: 'right' });

    doc.text('Jeunes', 10, 66);
    doc.text(`${c.jeunes || 0}`, 70, 66, { align: 'right' });

    doc.text('Enfants', 10, 72);
    doc.text(`${c.enfants || 0}`, 70, 72, { align: 'right' });

    doc.text('-------------------------------------------------------', 40, 78, { align: 'center' });

    // Total Général
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('TOTAL GÉNÉRAL', 10, 86);
    doc.text(`${c.total || 0}`, 70, 86, { align: 'right' });

    doc.setFont('Helvetica', 'italic');
    doc.setFontSize(8);
    doc.text('Validé par le Secrétariat', 40, 100, { align: 'center' });

    // Lancement direct de la boîte d'impression native du navigateur
    doc.autoPrint();
    doc.output('dataurlnewwindow');
  }
}
