import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RoleUser, UserResponse } from '../../model/admin-user.model';
import { AdminUserStoreService } from '../../services/admin-user-store.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-users-component',
  imports: [ FormsModule,CommonModule],
  templateUrl: './admin-users-component.html',
  styleUrl: './admin-users-component.css',
})
export class AdminUsersComponent implements OnInit {

   readonly store = inject(AdminUserStoreService);

  search = '';
  filterRole: RoleUser | 'ALL' = 'ALL';

  savingId: number | null = null;

  allRoles: RoleUser[] = [
    'ADMIN',
    'RESPONSABLE_01',
    'RESPONSABLE_02',
    'EN_ATTENTE'
  ];

  ngOnInit(): void {
    this.store.loadAll();
  }

  usersFiltres(): UserResponse[] {
    const term = this.search.toLowerCase().trim();

    return this.store.users().filter(u => {

      const matchSearch =
        !term ||
        u.nom?.toLowerCase().includes(term) ||
        u.prenom?.toLowerCase().includes(term) ||
        u.email?.toLowerCase().includes(term);

      const matchRole =
        this.filterRole === 'ALL' ||
        u.roles?.includes(this.filterRole as RoleUser);

      return matchSearch && matchRole;
    });
  }

  hasRole(user: UserResponse, role: RoleUser): boolean {
    return user.roles?.includes(role);
  }

 toggleRole(user: UserResponse, role: RoleUser, event: Event): void {

  const checked = (event.target as HTMLInputElement).checked;

  const currentRoles = [...(user.roles ?? [])];

  let updatedRoles: RoleUser[];

}


updateRoles(user: UserResponse, roles: RoleUser[]): void {

  const previousRoles = [...(user.roles ?? [])];

  this.savingId = user.id;

}


refresh(): void {
    this.store.loadAll();
  }
}
