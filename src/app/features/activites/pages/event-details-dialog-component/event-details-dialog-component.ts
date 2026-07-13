import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';

import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { CalendarFacade } from '../../../../shared/calendar/calendar.facade';
import { Router } from '@angular/router';
import { OffranceComponent } from '../../../finances/pages/offrance-component/offrance-component';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { CulteResponse } from '../../models/culte.model';
import { CulteDetailsComponent } from '../culte-details-component/culte-details-component';
import { AuthStoreService } from '../../../../core/service/auth/auth-store-service';
@Component({
  selector: 'app-event-details-dialog-component',
    standalone: true,
  imports: [
  CommonModule,
  DialogModule,
  ButtonModule,
  CardModule,
  DividerModule,
  TagModule
  ],
  templateUrl: './event-details-dialog-component.html',
  styleUrl: './event-details-dialog-component.css',
})
export class EventDetailsDialogComponent implements OnInit {

  @Input() visible = false;
  @Input() event: any;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() delete = new EventEmitter<any>();

  participantsCount = 0;
  constructor(private router: Router, private facade: CalendarFacade,private authStore: AuthStoreService) {}

  get culte() {
    // Permet d'extraire proprement l'objet CulteResponse peu importe sa provenance du calendrier
    return this.event?.extendedProps ?? this.event;
  }

  ngOnInit() {
    this.participantsCount = Math.floor(Math.random() * 200);
  }

  close() {
    this.visibleChange.emit(false);
  }

  edit() {
    this.router.navigate(['/activites/editculte', this.culte.id]);
    this.close();
  }

  duplicate() {
    this.router.navigate(['/activites/duplicate', this.culte.id]);
    this.close();
  }

  invite() {
    this.router.navigate(['/communication/invitation', this.culte.id]);
    this.close();
  }

  nouveau() {
    this.router.navigate(['/membres']);
    this.close();
  }

  offrande() {
    this.facade.openOffrande(this.event);
    this.close();
  }

  ouvrirComptage() {
    // Si la façade de votre calendrier propose une méthode dédiée, utilisez-la, sinon vous pouvez directement appeler le dialogue ici
    this.close();
  }

  getStatus(): string {
    if (!this.culte) return 'PROGRAMMÉ';
    const now = new Date();
    const d1 = new Date(this.culte.dateDebut);
    const d2 = new Date(this.culte.dateFin);

    if (now > d2) return 'TERMINÉ';
    if (now >= d1) return 'EN COURS';
    return 'PROGRAMMÉ';
  }

  getStatusClass(): string {
    const status = this.getStatus();
    if (status === 'TERMINÉ') return 'bg-termine';
    if (status === 'EN COURS') return 'bg-encours';
    return 'bg-programme';
  }

  /**
   * Vérifie si le culte a commencé ou est terminé (la date de début est passée)
   */
  isCulteAccessible(): boolean {
    if (!this.culte || !this.culte.dateDebut) return false;
    const now = new Date();
    const debut = new Date(this.culte.dateDebut);
    return now >= debut;
  }

  /**
   * Vérifie si l'utilisateur connecté possède le rôle ADMIN
   */
  isAdmin(): boolean {
    return this.hasRole(['ADMIN']);
  }

  hasRole(allowedRoles: string[]): boolean {
    const userRoles = this.authStore.user()?.roles || [];
    return userRoles.some((role: string) => allowedRoles.includes(role));
  }

  /**
   * Condition globale pour activer le clic sur les boutons d'enregistrement
   */
  canExecuteAction(): boolean {
    return this.isAdmin() && this.isCulteAccessible();
  }
}
