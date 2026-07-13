import { CommonModule } from '@angular/common';
import { Component, effect, OnInit, ViewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { LoaderComponent } from '../../../../shared/utilities/loader-component/loader-component';
import { NouveauComposant } from '../nouveau-composant/nouveau-composant';
import { StoreMembre } from '../../services/StoreMembre';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { MatSort } from '@angular/material/sort';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { MatDialog } from '@angular/material/dialog';
import { debounceTime } from 'rxjs/operators';
import Chart from 'chart.js/auto';
import { MatTooltipModule } from '@angular/material/tooltip';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-admin-component-membre',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    LoaderComponent,
    MatProgressSpinnerModule,
    MatAutocompleteModule,
    MatTooltipModule, // 2. L'ajouter aux imports du composant
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,   // ✅ IMPORTANT
    MatInputModule,        // 👈 Ajouté ici
    MatDatepickerModule,

  ],
  templateUrl: './admin-component-membre.html',
  styleUrl: './admin-component-membre.css',
})
export class AdminComponentMembre implements OnInit {
  readonly Math = Math;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  users: any[] = [];
  filteredUsers: any[] = [];
  pagedUsers: any[] = [];

  totalActifs = 0;
  totalAccueil = 0;
  showChart = true;

  displayedColumns: string[] = ['id', 'user', 'invite', 'accueil', 'avis', 'action'];
  page = 1;
  pageSize = 10;
  totalPages = 1;

  searchControl = new FormControl('');

  // ✅ FormControls pour les filtres de date (6 mois par défaut)
  startDateControl = new FormControl<Date | null>(null);
  endDateControl = new FormControl<Date | null>(null);

  auth = { user: () => ({ roles: ['ADMIN'] }) };

  constructor(private dialog: MatDialog, public store: StoreMembre) {
    // ✅ Initialisation des 6 derniers mois par défaut
    const aujourdhui = new Date();
    const ilYA6Mois = new Date();
    ilYA6Mois.setMonth(aujourdhui.getMonth() - 6);
    this.startDateControl.setValue(ilYA6Mois);
    this.endDateControl.setValue(aujourdhui);

    effect(() => {
      const membres = this.store.membres();
      this.users = membres ?? [];

      setTimeout(() => {
        this.filterUsers();
      });
    });
  }

  ngOnInit(): void {
    this.store.loadAllIfNeeded();

    // Déclencheur sur la barre de recherche
    this.searchControl.valueChanges.pipe(debounceTime(300)).subscribe(() => this.filterUsers());

    // ✅ Déclencheurs sur les changements de date
    this.startDateControl.valueChanges.subscribe(() => this.filterUsers());
    this.endDateControl.valueChanges.subscribe(() => this.filterUsers());
  }

  hasRole(allowedRoles: string[]): boolean {
    const userRoles = this.auth.user()?.roles || [];
    return userRoles.some(role => allowedRoles.includes(role));
  }

  // ✅ Logique de filtrage combinée (Recherche + Dates)
  filterUsers(): void {
    const term = (this.searchControl.value ?? '').trim().toLowerCase();
    const dateDebut = this.startDateControl.value;
    const dateFin = this.endDateControl.value;

    this.filteredUsers = this.users.filter(user => {
      // 1. Filtre textuel
      const matchText =
        user.nom?.toLowerCase().includes(term) ||
        user.prenom?.toLowerCase().includes(term) ||
        user.email?.toLowerCase().includes(term) ||
        user.telephone?.toLowerCase().includes(term);

      // 2. Filtre par date (prend en compte createdAt, sinon laisse passer si pas de date)
      let matchDate = true;
      if (user.createdAt) {
        const userDate = new Date(user.createdAt);
        if (dateDebut) {
          matchDate = matchDate && userDate >= dateDebut;
        }
        if (dateFin) {
          // Ajuster la fin de journée pour inclure toute la date cible
          const finJournee = new Date(dateFin);
          finJournee.setHours(23, 59, 59, 999);
          matchDate = matchDate && userDate <= finJournee;
        }
      } else {
        // Optionnel : si le membre n'a pas de date (ex: ID 1 dans votre console),
        // vous pouvez choisir de l'afficher uniquement si aucune période stricte n'est sélectionnée.
        matchDate = !dateDebut && !dateFin;
      }

      return matchText && matchDate;
    });

    this.computeKPIs();
    this.page = 1;
    this.updatePagination();
    this.initCharts();
  }

  toggleChart(): void {
    this.showChart = !this.showChart;
    if (this.showChart) {
      setTimeout(() => this.initCharts());
    }
  }

  updatePagination(): void {
    this.totalPages = Math.max(1, Math.ceil(this.filteredUsers.length / this.pageSize));
    const start = (this.page - 1) * this.pageSize;
    this.pagedUsers = this.filteredUsers.slice(start, start + this.pageSize);
  }

  goToPage(page: number): void { if (page >= 1 && page <= this.totalPages) { this.page = page; this.updatePagination(); } }
  nextPage(): void { if (this.page < this.totalPages) { this.page++; this.updatePagination(); } }
  prevPage(): void { if (this.page > 1) { this.page--; this.updatePagination(); } }
  viewUser(user: any): void { console.log('Voir membre', user); }
  deleteUser(id: number): void { if (confirm('Voulez-vous supprimer ce membre ?')) { console.log('Suppression membre', id); } }

  openDialog(): void {
    this.dialog.open(NouveauComposant, { width: '90vw', height: '90vh', panelClass: 'premium-dialog-panel' });
  }

  editUser(user: any): void {
    this.dialog.open(NouveauComposant, { data: user, width: '80vw', height: '80vh', panelClass: 'premium-dialog-panel' });
  }

  computeKPIs(): void {
    this.totalActifs = this.filteredUsers.filter(u => u.eglise === 'Oui').length;
    this.totalAccueil = this.filteredUsers.filter(u => u.accueil && u.accueil !== 'Non').length;
  }

  initCharts(): void {
    if (!this.showChart) return;

    const ctxMembers = document.getElementById('membersYearChart') as HTMLCanvasElement;
    if (ctxMembers) {
      const existingChart = Chart.getChart(ctxMembers);
      if (existingChart) existingChart.destroy();

      const inscriptionsParMois = new Array(12).fill(0);
      this.filteredUsers.forEach(u => {
        const dateTarget = u.createdAt;
        if (dateTarget) {
          const m = new Date(dateTarget).getMonth();
          if (m >= 0 && m < 12) inscriptionsParMois[m]++;
        }
      });

      new Chart(ctxMembers, {
        type: 'bar',
        data: {
          labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc'],
          datasets: [{
            label: 'Nouveaux membres',
            data: inscriptionsParMois,
            backgroundColor: '#4f46e5',
            borderRadius: 6
          }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
      });
    }

    const ctxStatus = document.getElementById('statusDistributionChart') as HTMLCanvasElement;
    if (ctxStatus) {
      const existingChart = Chart.getChart(ctxStatus);
      if (existingChart) existingChart.destroy();

      new Chart(ctxStatus, {
        type: 'bar',
        data: {
          labels: ['Disposent d\'une église', 'Sans église'],
          datasets: [{
            data: [this.totalActifs, this.filteredUsers.length - this.totalActifs],
            backgroundColor: ['#10b981', '#f59e0b'],
            borderRadius: 6,
            barThickness: 20
          }]
        },
        options: { indexAxis: 'y', responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
      });
    }
  }


  // ==========================================
  // 📄 EXPORTATION PDF PREMIUM
  // ==========================================
  exportToPDF(): void {
    if (this.filteredUsers.length === 0) {
      alert("Aucune donnée à exporter.");
      return;
    }

    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    // Éléments de Design Style CMP BEL'AIR-LSHI Corporate
    const primaryColor = '#4f46e5'; // Indigo
    const textColor = '#1e293b'; // Slate

    // Titre Principal
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.setTextColor(primaryColor);
    doc.text('CMP BEL\'AIR-LSHI – LISTE DES MEMBRES & VISITEURS', 14, 15);

    // Sous-titre & Métadonnées
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(textColor);

    const dateDebut = this.startDateControl.value ? this.startDateControl.value.toLocaleDateString() : 'Début';
    const dateFin = this.endDateControl.value ? this.endDateControl.value.toLocaleDateString() : 'Fin';
    doc.text(`Période filtrée : Du ${dateDebut} au ${dateFin}`, 14, 22);
    doc.text(`Généré le : ${new Date().toLocaleString()} | Total enregistrements : ${this.filteredUsers.length}`, 14, 27);

    // Préparation des lignes du tableau
    const bodyData = this.filteredUsers.map((u, index) => [
      index + 1,
      `${u.nom} ${u.prenom}`,
      u.email || 'N/A',
      u.telephone || 'N/A',
      u.adresse || 'N/A',
      u.invite || 'Aucun',
      u.accueil || 'Non spécifié',
      u.culte ? u.culte.nom : 'Hors culte'
    ]);

    // Génération automatique du tableau stylisé
    autoTable(doc, {
      startY: 32,
      head: [['#', 'Nom complet', 'Email', 'Téléphone', 'Adresse', 'Invité par', 'Accueil', 'Lien Culte']],
      body: bodyData,
      theme: 'grid',
      headStyles: {
        fillColor: [79, 70, 229], // #4f46e5
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        halign: 'left'
      },
      styles: {
        fontSize: 9,
        cellPadding: 3,
        textColor: [30, 41, 59]
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252] // Couleur de zébrure très légère
      },
      margin: { top: 30, left: 14, right: 14 }
    });

    // Téléchargement du document
    doc.save(`CMP BEL'AIR-LSHI_Membres_${new Date().toISOString().slice(0,10)}.pdf`);
  }

  // ==========================================
  // 📊 EXPORTATION EXCEL STRUCTURÉ
  // ==========================================
  exportToExcel(): void {
    if (this.filteredUsers.length === 0) {
      alert("Aucune donnée à exporter.");
      return;
    }

    // Extraction des lignes plates adaptées pour une structure de tableur Excel
    const excelRows = this.filteredUsers.map((u, index) => ({
      'N°': index + 1,
      'Nom': u.nom,
      'Prénom': u.prenom,
      'Email': u.email || '',
      'Téléphone': u.telephone || '',
      'Adresse': u.adresse || '',
      'Invité Par': u.invite || 'Aucun',
      'Qualité Accueil': u.accueil || 'Non spécifié',
      'Remarques / Avis': u.avis || '',
      'Lié au Culte': u.culte ? u.culte.nom : 'Non',
      'Date Inscription': u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'
    }));

    // Création de la feuille et du classeur
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(excelRows);
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Membres Filtrés');

    // Ajustement automatique de la largeur des colonnes pour un rendu propre
    const maxProps = [{ wch: 5 }, { wch: 18 }, { wch: 18 }, { wch: 25 }, { wch: 15 }, { wch: 30 }, { wch: 20 }, { wch: 15 }, { wch: 25 }, { wch: 22 }, { wch: 15 }];
    worksheet['!cols'] = maxProps;

    // Téléchargement du fichier
    XLSX.writeFile(workbook, `CMP BEL'AIR-LSHI_Membres_${new Date().toISOString().slice(0,10)}.xlsx`);
  }
}
