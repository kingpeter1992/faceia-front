import { Component, inject } from '@angular/core';

// UI PrimeNG Imports
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ChipModule } from 'primeng/chip';
import { ProgressBarModule } from 'primeng/progressbar';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { CommonModule } from '@angular/common';
import { PdfExportService } from '../../services/PdfExportService';
import { QrAccessService } from '../../../activites/services/QrAccessService';



@Component({
  selector: 'app-qrlist-component',
imports: [
    CommonModule,
    TableModule,
    TagModule,
    ChipModule,
    ProgressBarModule,
    ButtonModule,
    InputTextModule,
    TooltipModule
  ],
  templateUrl: './qrlist-component.html',
  styleUrl: './qrlist-component.css',
})
export class QrlistComponent {

// Injection propre moderne Angular 17+
  public qrService = inject(QrAccessService);
  public pdfService = inject(PdfExportService);

  getStatusColor(status: string): 'success' | 'warn' | 'danger' | 'secondary' | 'info' {
    switch(status) {
      case 'ACTIVE': return 'success';
      case 'USED': return 'warn';
      case 'EXPIRED': return 'danger';
      case 'REVOKED': return 'secondary';
      default: return 'info';
    }
  }




}
