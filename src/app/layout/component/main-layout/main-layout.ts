import { Component, computed, inject, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthStoreService } from '../../../core/service/auth/auth-store-service';
import { CommonModule } from '@angular/common';
import { CulteStore } from '../../../features/activites/services/CulteStore';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { ChurchSessionStore } from '../../../features/public/egliseInfos/services/church-session.store';

export interface MenuChild {
  label: string;
  icon: string;
  route: string;
  roles: string[];
}

export interface MenuItem1 {
  label: string;
  icon: string;
  roles: string[];
  route?: string;
  expanded?: boolean;
  children?: MenuChild[];
}

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    MenubarModule
  ],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayout implements OnInit {
  items1: MenuItem[] | undefined;
  isDropdownOpen = false;
  sidebarOpen = true;

  readonly auth = inject(AuthStoreService);
  readonly culteStore = inject(CulteStore);
  readonly router = inject(Router);
  readonly churchStore = inject(ChurchSessionStore);
  eglise = this.churchStore.eglise;


  menuItems: MenuItem1[] = [
    {
      label: 'Tableau de bord',
      icon: 'pi pi-home',
      route: '/dashboard',
      roles: ['ADMIN', 'PASTEUR', 'RESPONSABLE_01', 'RESPONSABLE_02']
    },
    {
      label: 'Administration',
      icon: 'pi pi-cog',
      roles: ['ADMIN'],
      children: [
        { label: 'Utilisateurs', icon: 'pi pi-users', route: '/admin/users', roles: ['ADMIN'] },
        { label: 'Rôles', icon: 'pi pi-shield', route: '/admin/roles', roles: ['ADMIN'] }
      ]
    },
    {
      label: 'Activités',
      icon: 'pi pi-calendar',
      roles: ['ADMIN', 'RESPONSABLE_01', 'RESPONSABLE_02'],
      children: [
        { label: 'Calendrier', icon: 'pi pi-calendar-plus', route: '/activites/calendrier', roles: ['ADMIN', 'RESPONSABLE_01', 'RESPONSABLE_02'] },
        { label: 'Cultes', icon: 'pi pi-clock', route: '/activites/cultes', roles: ['ADMIN', 'RESPONSABLE_01', 'RESPONSABLE_02'] },
        { label: 'Assistance', icon: 'pi pi-clock', route: '/activites/assistance', roles: ['ADMIN', 'RESPONSABLE_01', 'RESPONSABLE_02'] },
      ]
    },
    {
      label: 'Communication',
      icon: 'pi pi-megaphone',
      roles: ['ADMIN', 'RESPONSABLE_01', 'RESPONSABLE_02'],
      children: [
        { label: 'Annonces', icon: 'pi pi-volume-up', route: '/communication', roles: ['ADMIN', 'RESPONSABLE_01', 'RESPONSABLE_02'] },
        { label: 'Notifications', icon: 'pi pi-bell', route: '/communication/notifications', roles: ['ADMIN', 'RESPONSABLE_01', 'RESPONSABLE_02'] }
      ]
    },
    {
      label: 'Départements',
      icon: 'pi pi-sitemap',
      roles: ['ADMIN', 'RESPONSABLE_01', 'RESPONSABLE_02'],
      children: [
        { label: 'Gestion des départements', icon: 'pi pi-building', route: '/departement', roles: ['ADMIN', 'RESPONSABLE_01', 'RESPONSABLE_02'] }
      ]
    },
    {
      label: 'Enseignements',
      icon: 'pi pi-book',
      roles: ['ADMIN', 'RESPONSABLE_01', 'RESPONSABLE_02'],
      children: [
        { label: 'Cours', icon: 'pi pi-bookmark', route: '/enseignements', roles: ['ADMIN', 'RESPONSABLE_01', 'RESPONSABLE_02'] },
        { label: 'Prédications', icon: 'pi pi-video', route: '/enseignements/predications', roles: ['ADMIN', 'RESPONSABLE_01', 'RESPONSABLE_02'] }
      ]
    },
    {
      label: 'Documents',
      icon: 'pi pi-folder',
      roles: ['ADMIN', 'RESPONSABLE_01', 'RESPONSABLE_02'],
      children: [
        { label: 'Bibliothèque', icon: 'pi pi-file', route: '/documents', roles: ['ADMIN', 'RESPONSABLE_01', 'RESPONSABLE_02'] },
        { label: 'Archives', icon: 'pi pi-folder-open', route: '/documents/archives', roles: ['ADMIN', 'RESPONSABLE_01', 'RESPONSABLE_02'] }
      ]
    },
    {
      label: 'Finances',
      icon: 'pi pi-wallet',
      roles: ['ADMIN', 'RESPONSABLE_01', 'RESPONSABLE_02'],
      children: [
        { label: 'Offrandes', icon: 'pi pi-dollar', route: '/finances/offrandes', roles: ['ADMIN', 'RESPONSABLE_01', 'RESPONSABLE_02'] },
        { label: 'Dépenses', icon: 'pi pi-credit-card', route: '/finances/depenses', roles: ['ADMIN', 'RESPONSABLE_01', 'RESPONSABLE_02'] },
        { label: 'Rapports financiers', icon: 'pi pi-chart-line', route: '/finances/rapports', roles: ['ADMIN', 'RESPONSABLE_01', 'RESPONSABLE_02'] }
      ]
    },
    {
      label: 'Membres',
      icon: 'pi pi-users',
      roles: ['ADMIN', 'RESPONSABLE_01', 'RESPONSABLE_02'],
      children: [
        { label: 'Invités', icon: 'pi pi-list', route: '/invites', roles: ['ADMIN', 'RESPONSABLE_01', 'RESPONSABLE_02'] },
        { label: 'Comptages', icon: 'pi pi-chart-bar', route: '/membres/comptage', roles: ['ADMIN', 'RESPONSABLE_01', 'RESPONSABLE_02'] },
        { label: 'qrcode', icon: 'pi pi-chart-bar', route: '/membres/qrcode', roles: ['ADMIN', 'RESPONSABLE_01', 'RESPONSABLE_02'] }
      ]
    },
    {
      label: 'Responsables',
      icon: 'pi pi-id-card',
      roles: ['ADMIN'],
      children: [
        { label: 'Gestion responsables', icon: 'pi pi-briefcase', route: '/responsables', roles: ['ADMIN'] },
        { label: 'Affectations', icon: 'pi pi-send', route: '/responsables/affectations', roles: ['ADMIN'] }
      ]
    },
     {
      label: 'Qr Code Management',
      icon: 'pi pi-id-card',
      roles: ['ADMIN'],
      children: [
        { label: 'Gestion de Qr code', icon: 'pi pi-briefcase', route: '/qrcode', roles: ['ADMIN'] },
      ]
    }
  ];

  // Filtre réactif basé sur les rôles du Signal 'auth.user'
  filteredMenuItems = computed(() => {
    return this.menuItems
      .filter(item => this.hasRole(item.roles))
      .map(item => ({
        ...item,
        children: item.children ? item.children.filter(child => this.hasRole(child.roles)) : []
      }));
  });

ngOnInit() {
  const user = this.auth.user();
  const initials = user ? `${user.prenom?.charAt(0) || ''}${user.nom?.charAt(0) || ''}` : 'User';
  const fullName = user ? `${user.prenom || ''} ${user.nom || ''}` : 'Admin';
  const role = user?.roles?.[0] || 'ADMINISTRATOR';

  this.items1 = [
    {
      label: fullName,
      data: {
        initials: initials,
        role: `Role: ${role}`
      },
      items: [
        { label: 'Profil', icon: 'pi pi-id-card', routerLink: '/profile' },
        { label: 'Déconnexion', icon: 'pi pi-sign-out', command: () => this.logout() }
      ]
    }
  ];
}

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  toggleMenu(item: MenuItem1) {
    item.expanded = !item.expanded;
  }

  hasRole(allowedRoles: string[]): boolean {
    const userRoles = this.auth.user()?.roles || [];
    return userRoles.some(role => allowedRoles.includes(role));
  }

  logout(): void {
    this.culteStore.clearCache();
    this.auth.logout();
  }
}
