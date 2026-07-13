import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
interface Department {
  id: number;
  name: string;
  icon: string;
  hasResponsable: boolean;
  hasMembers: boolean;
}
@Component({
  selector: 'app-admin-component-departement',
standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-component-departement.html',
  styleUrl: './admin-component-departement.css',
})
export class AdminComponentDepartement implements OnInit {

  // Les 25 départements structurés selon les critères u-church (sans violet)
  departments: Department[] = [
    { id: 1, name: 'Pastorat', icon: '👔', hasResponsable: true, hasMembers: false },
    { id: 3, name: 'Administration', icon: '📁', hasResponsable: true, hasMembers: true },
    { id: 4, name: 'Partenaire', icon: '💰', hasResponsable: true, hasMembers: true },
    { id: 5, name: 'Intercession', icon: '🛐', hasResponsable: true, hasMembers: true },
    { id: 7, name: 'Chorale', icon: '🎶', hasResponsable: true, hasMembers: true },
    { id: 9, name: 'Évangélisation', icon: '📢', hasResponsable: true, hasMembers: true },
    { id: 10, name: 'Jeunesse', icon: '🧑', hasResponsable: true, hasMembers: true },
    { id: 11, name: 'Enfance', icon: '👶', hasResponsable: true, hasMembers: true },
    { id: 12, name: 'Femmes', icon: '👩', hasResponsable: true, hasMembers: true },
    { id: 13, name: 'Hommes', icon: '👨', hasResponsable: true, hasMembers: true },
    { id: 14, name: 'Famille', icon: '🏠', hasResponsable: true, hasMembers: true },
    { id: 15, name: 'École Biblique', icon: '📖', hasResponsable: true, hasMembers: true },
    { id: 16, name: 'Médias & Communication', icon: '📸', hasResponsable: true, hasMembers: true },
    { id: 17, name: 'Informatique', icon: '💻', hasResponsable: true, hasMembers: true },
    { id: 18, name: 'Protocole', icon: '🛡️', hasResponsable: true, hasMembers: true },
    { id: 19, name: 'Sécurité', icon: '🚨', hasResponsable: true, hasMembers: true },
    { id: 20, name: 'Logistique', icon: '📦', hasResponsable: true, hasMembers: true },
    { id: 21, name: 'Hospitalité', icon: '🛎️', hasResponsable: true, hasMembers: true },
    { id: 22, name: 'Action Sociale', icon: '❤️', hasResponsable: true, hasMembers: true },
    { id: 23, name: 'Cellules de Maison', icon: '🏘️', hasResponsable: true, hasMembers: true },
    { id: 24, name: 'Missions', icon: '🌍', hasResponsable: true, hasMembers: true },
    { id: 25, name: 'Santé', icon: '⚕️', hasResponsable: true, hasMembers: true }

  ];

  selectedDepartmentId: number | null = null;

  ngOnInit(): void {}

  selectDepartment(dept: Department): void {
    this.selectedDepartmentId = dept.id;
    console.log(`U-Churche Navigation -> Département cible : ${dept.name}`);
  }

  openAddDepartmentModal(): void {
    console.log('Ouverture du formulaire de création de département');
  }

}
