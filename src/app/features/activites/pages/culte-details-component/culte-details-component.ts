import { Component, computed, inject, Inject,  OnChanges, OnInit, SimpleChanges } from '@angular/core';
import {  Router } from '@angular/router';
import { CulteResponse } from '../../models/culte.model';
import { CommonModule, DatePipe } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ChangeDetectorRef } from '@angular/core';
import { OffranceComponent } from '../../../finances/pages/offrance-component/offrance-component';
import { NouveauComposant } from '../../../membres/pages/nouveau-composant/nouveau-composant';
import { ChurchComptage } from '../church-comptage/church-comptage';
import { AuthStoreService } from '../../../../core/service/auth/auth-store-service';
import { ResumeComponent } from '../resume-component/resume-component';
import { ComptageStore } from '../../services/ComptageStore';

@Component({
  selector: 'app-culte-details-component',
  standalone: true,
  imports: [DatePipe, CommonModule],
  templateUrl: './culte-details-component.html',
  styleUrl: './culte-details-component.css',
})

export class CulteDetailsComponent implements OnInit {
  loading = true;
  evenmentcloture : boolean = false;
  readonly auth = inject(AuthStoreService);
  public comptageStore = inject(ComptageStore);

// 1. Déclaration du computed réactif
  participantsCount = computed(() => {
    if (!this.culte?.id) return 0;
    const assistance = this.comptageStore.comptages().find((a: any) => a.culteId === this.culte.id);
    return assistance?.total || 0;
  });


  constructor(
    @Inject(MAT_DIALOG_DATA) public culte: CulteResponse,
    private dialogRef: MatDialogRef<CulteDetailsComponent>,
    private router: Router,
    private cd: ChangeDetectorRef,
    private dialog: MatDialog,
  ) {}

ngOnInit(): void {
    this.loading = true;

    // 2. On déclenche le chargement des comptages/participants depuis le store
    this.comptageStore.loadAllIfNeeded();

    setTimeout(() => {
      this.loading = false;
      this.cd.detectChanges();
    }, 50);
  }


  close(): void {
    this.dialogRef.close();
  }

  edit(): void {
    if (!this.culte?.id) return;
    this.router.navigate(['/activites/editculte', this.culte.id]);
    this.close();
  }

  duplicate(): void {
    if (!this.culte?.id) return;
    this.router.navigate(['/activites/duplicate', this.culte.id]);
    this.close();
  }

  invite(): void {
    if (!this.culte?.id) return;
    this.dialog.open(NouveauComposant, {
      data: { culteId: this.culte.id },
      width: '80vw',
      height: '80vh'
    });
  }

  getStatus(): string {
    if (!this.culte || !this.culte.dateDebut || !this.culte.dateFin) {
      return 'PROGRAMMÉ';
    }

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

  Offrande(): void {
    this.dialog.open(OffranceComponent, {
      data: {
        culteId: this.culte?.id || null,
        culte: this.culte
      },
      width: '80vw',
      height: '80vh',
      maxWidth: '95vw',
      panelClass: 'offrande-dialog'
    });
  }

  ouvrirComptage(): void {
    this.dialog.open(ChurchComptage, {
      data: {
        culteId: this.culte?.id || null,
        culte: this.culte
      },
      width: '60vw',
      height: '70vh',
      maxWidth: '65vw',
    });
  }

  ouvrirResume(): void {
    this.dialog.open(ResumeComponent, {
      data: {
        culteId: this.culte?.id || null,
        culte: this.culte
      },
      width: '60vw',
      height: '70vh',
      maxWidth: '65vw',
    });
  }

  /**
   * Vérifie si le culte a commencé ou est terminé (la date de début est atteinte ou passée)
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

  /**
   * Vérifie la présence d'un rôle spécifique dans les données de l'utilisateur
   */
  hasRole(allowedRoles: string[]): boolean {
    const userRoles = this.auth.user()?.roles || [];
    return userRoles.some(role => allowedRoles.includes(role));
  }

  /**
   * Règle de sécurité globale : L'action est disponible UNIQUEMENT si
   * l'utilisateur est ADMIN ET que le culte a débuté ou est passé.
   */
  canExecuteAction(): boolean {
    return this.isAdmin() && this.isCulteAccessible();
  }



  // Génère ou met à jour le Token UUID Unique rattaché à ce culte
  genererNouveauTokenQR(): void {
    // Génération d'un id unique cryptographique côté client pour l'exemple (ou généré par votre backend)
    const uniqueToken = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2);

    this.culte.qrToken = uniqueToken;

    // Optionnel : Enregistrer immédiatement l'état du token sur le culte dans le CulteStore
    // this.culteStore.updateCulteQrToken(this.culteId, uniqueToken);
  }

  // Construit l'URL publique de saisie protocole hors connexion/auth
  getPublicLink(): string {
    if (!this.culte?.qrToken) return '';
    const baseUrl = window.location.origin;
    return `${baseUrl}/public/comptage/${this.culte.qrToken}`;
  }

  encodeUrl(url: string): string {
    return encodeURIComponent(url);
  }

  copyLink(inputElement: HTMLInputElement): void {
    inputElement.select();
    document.execCommand('copy');
    alert('Lien de saisie Protocole copié avec succès !');
  }
}



