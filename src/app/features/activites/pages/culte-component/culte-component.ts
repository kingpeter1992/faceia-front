import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from "@angular/router";
import { CulteStore } from '../../services/CulteStore';
import { CulteResponse } from '../../models/culte.model';
import { FormsModule } from '@angular/forms';
import { CulteDetailsComponent } from "../culte-details-component/culte-details-component";
import { LoaderComponent } from "../../../../shared/utilities/loader-component/loader-component";
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-culte-component',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    LoaderComponent
],
  templateUrl: './culte-component.html',
  styleUrl: './culte-component.css',
})
export class CulteComponent implements OnInit {
  // ✅ Étape 1 : Ajoutez cette ligne pour rendre l'objet Math accessible au HTML
  protected readonly Math = Math;
  isOpen = false;
  isLoading = false;

  currentPage = 1;
  itemsPerPage = 9;

  searchText = '';
  selectedFilter = 'all';

  selectedSort = 'recent';

  filteredCultes: CulteResponse[] = [];

  constructor(
    private router: Router,
    public culteStore: CulteStore,
      private dialog: MatDialog,

  ) { }



ngOnInit(): void {
  this.culteStore.loadAllIfNeeded();
  setTimeout(() => {
    this.applyFilters(); // ✅ important
  }, 500);
}

// À ajouter dans votre classe TypeScript :
get totalPages(): number {
  return Math.ceil(this.filteredCultes.length / this.itemsPerPage);
}

get maxItemIndex(): number {
  return Math.min(this.currentPage * this.itemsPerPage, this.filteredCultes.length);
}

  get paginatedCultes(): CulteResponse[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredCultes.slice(start, start + this.itemsPerPage);
  }


  get cultes(): CulteResponse[] {
    return this.culteStore.cultes();
  }

  gotToCreate(): void {
    this.router.navigateByUrl('/activites/addculte');
  }



  getStatus(culte: CulteResponse): string {

    const now = new Date();
    const debut = new Date(culte.dateDebut);
    const fin = new Date(culte.dateFin);

    if (now > fin) {
      return 'TERMINÉ';
    }

    if (now >= debut && now <= fin) {
      return 'EN COURS';
    }

    return 'PLANIFIÉ';
  }

  getStatusClass(culte: CulteResponse): string {

    const now = new Date();

    const debut = new Date(culte.dateDebut);
    const fin = new Date(culte.dateFin);

    if (now > fin) {
      return 'termine';
    }

    if (now >= debut && now <= fin) {
      return 'en-cours';
    }

    const diff = debut.getTime() - now.getTime();

    if (diff <= 24 * 60 * 60 * 1000) {
      return 'bientot';
    }

    return 'planifie';
  }


  searchCultes() {
    this.applyFilters();
  }

  selectedCulte!: CulteResponse | null;

openDialog(culte: CulteResponse) {
  const dialogRef = this.dialog.open(CulteDetailsComponent, {
    width: '950px',
    maxHeight: '90vh',
    panelClass: 'culte-dialog-panel',
    data: culte,
    enterAnimationDuration: '250ms',
    exitAnimationDuration: '200ms'
  });

  dialogRef.afterClosed().subscribe(result => {
    console.log('Dialog fermé', result);
  });
}

  closeDialog() {
    this.isOpen = false;
    this.selectedCulte = null;
  }

  sortCultes(): void {

    switch (this.selectedSort) {

      case 'recent':
        this.filteredCultes.sort((a, b) =>
          new Date(b.dateDebut).getTime() - new Date(a.dateDebut).getTime()
        );
        break;

      case 'ancien':
        this.filteredCultes.sort((a, b) =>
          new Date(a.dateDebut).getTime() - new Date(b.dateDebut).getTime()
        );
        break;

      case 'date':
        this.filteredCultes.sort((a, b) =>
          new Date(a.dateFin).getTime() - new Date(b.dateFin).getTime()
        );
        break;
    }

  }

  nextPage() {
    if (this.currentPage * this.itemsPerPage < this.filteredCultes.length) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }


  filterCultes(filter: string) {
    this.selectedFilter = filter;
    this.applyFilters();
  }


  get totalCultes(): number {
    return this.cultes.length;
  }

  get enCoursCount(): number {

    const now = new Date();

    return this.cultes.filter(c => {

      const debut = new Date(c.dateDebut);
      const fin = new Date(c.dateFin);

      return now >= debut && now <= fin;

    }).length;
  }

  get avenirCount(): number {

    const now = new Date();

    return this.cultes.filter(c =>
      new Date(c.dateDebut) > now
    ).length;
  }

  applyFilters(): void {

    const search = this.searchText.toLowerCase();
    const now = new Date();

    this.filteredCultes = this.cultes.filter(culte => {

      const debut = new Date(culte.dateDebut);
      const fin = new Date(culte.dateFin);

      const matchSearch =
        culte.nom?.toLowerCase().includes(search) ||
        culte.theme?.toLowerCase().includes(search) ||
        culte.orateur?.toLowerCase().includes(search) ||
        culte.moderateur?.toLowerCase().includes(search);

      let matchFilter = true;

      switch (this.selectedFilter) {
        case 'encours':
          matchFilter = now >= debut && now <= fin;
          break;

        case 'avenir':
          matchFilter = debut > now;
          break;

        case 'termine':
          matchFilter = fin < now;
          break;
      }

      return matchSearch && matchFilter;
    });

    this.currentPage = 1; // ✅ reset page
    this.sortCultes();
  }



}
