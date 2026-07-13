import { Component, Input } from '@angular/core';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-donation-list-component',
  imports: [],
  templateUrl: './donation-list-component.html',
  styleUrl: './donation-list-component.css',
})
export class DonationListComponent {
  // Vos données JSON reçues
  @Input() donations: any[] = [];

  // --- GETTERS POUR LES KPIs ---
  get totalUSD(): number {
    return this.donations
      .filter(d => d.devise === 'USD')
      .reduce((sum, d) => sum + (d.montant || 0), 0);
  }

  get totalCDF(): number {
    return this.donations
      .filter(d => d.devise === 'CDF')
      .reduce((sum, d) => sum + (d.montant || 0), 0);
  }

  // 🚀 1. EXPORT PDF PREMIUM
  exportPDF() {
    const doc = new jsPDF('p', 'mm', 'a4');

    // Palette de couleurs Premium
    const primaryColor = [79, 70, 229]; // #4f46e5 (Indigo)
    const grayText = [100, 116, 139];   // #64748b

    // Header : Logo / Titre Smart Church
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('SMART CHURCH', 14, 20);

    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(grayText[0], grayText[1], grayText[2]);
    doc.text('Système de Gestion Financière Intégré', 14, 25);
    doc.text(`Généré le : ${new Date().toLocaleDateString('fr-FR')}`, 150, 20);

    // Ligne de séparation
    doc.setDrawColor(226, 232, 240);
    doc.line(14, 28, 196, 28);

    // Titre du document
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(15, 23, 42); // Noir ardoise
    doc.text('RAPPORT DES DONS ET CONTRIBUTIONS', 14, 38);

    // --- BLOCS KPI (Design de cartes) ---
    // Carte 1: Total USD
    doc.setFillColor(248, 250, 252); // Fond gris très clair
    doc.roundedRect(14, 44, 55, 20, 3, 3, 'F');
    doc.setFontSize(9);
    doc.setTextColor(grayText[0], grayText[1], grayText[2]);
    doc.text('TOTAL EN USD', 18, 50);
    doc.setFontSize(14);
    doc.setTextColor(16, 185, 129); // Vert émeraude
    doc.text(`${this.totalUSD.toLocaleString()} $`, 18, 59);

    // Carte 2: Total CDF
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(74, 44, 55, 20, 3, 3, 'F');
    doc.setFontSize(9);
    doc.setTextColor(grayText[0], grayText[1], grayText[2]);
    doc.text('TOTAL EN CDF', 78, 50);
    doc.setFontSize(14);
    doc.setTextColor(59, 130, 246); // Bleu
    doc.text(`${this.totalCDF.toLocaleString()} FC`, 78, 59);

    // Carte 3: Total Transactions
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(134, 44, 62, 20, 3, 3, 'F');
    doc.setFontSize(9);
    doc.setTextColor(grayText[0], grayText[1], grayText[2]);
    doc.text('TRANSACTIONS', 138, 50);
    doc.setFontSize(14);
    doc.setTextColor(15, 23, 42);
    doc.text(`${this.donations.length} enregistrements`, 138, 59);

    // --- TABLEAU DES DONNÉES ---
    const tableBody = this.donations.map((d, index) => [
      index + 1,
      d.donateur,
      `${d.montant.toLocaleString()} ${d.devise === 'USD' ? '$' : 'FC'}`,
      d.typeDon.toUpperCase(),
      d.culteNom ? d.culteNom : 'Hors Culte (Libre)',
      new Date(d.date).toLocaleDateString('fr-FR'),
      d.operation
    ]);

    (doc as any).autoTable({
      startY: 72,
      head: [['#', 'Donateur', 'Montant', 'Type', 'Culte / Destination', 'Date', 'Mode']],
      body: tableBody,
      theme: 'grid',
      headStyles: { fillColor: primaryColor, textColor: [255, 255, 255], fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      styles: { font: 'Helvetica', fontSize: 9, cellPadding: 3 },
      columnStyles: {
        2: { fontStyle: 'bold' },
        4: { cellWidth: 50 }
      }
    });

    doc.save(`Rapport_SmartChurch_${new Date().toISOString().slice(0,10)}.pdf`);
  }

  // 🚀 2. EXPORT EXCEL FORMATÉ PREMIUM
  exportExcel() {
    // Préparation des lignes de données
    const dataRows = this.donations.map((d, i) => ({
      'N°': i + 1,
      'Donateur': d.donateur,
      'Montant': d.montant,
      'Devise': d.devise,
      'Type de Don': d.typeDon.toUpperCase(),
      'Culte Associé': d.culteNom || 'Hors Culte / Libre',
      'Date': d.date,
      'Méthode': d.operation
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Contributions');

    // Ajout des lignes de totaux à la fin
    const lastRowIndex = dataRows.length + 2;
    XLSX.utils.sheet_add_aoa(worksheet, [
      [], // Ligne vide de séparation
      ['TOTAUX CUMULÉS', '', '', '', '', '', '', ''],
      ['Total Général USD', `${this.totalUSD} $`],
      ['Total Général CDF', `${this.totalCDF} FC`]
    ], { origin: `A${lastRowIndex}` });

    // Ajustement automatique de la largeur des colonnes
    const maxCw = [{ wch: 6 }, { wch: 20 }, { wch: 15 }, { wch: 10 }, { wch: 18 }, { wch: 28 }, { wch: 15 }, { wch: 15 }];
    worksheet['!cols'] = maxCw;

    XLSX.writeFile(workbook, `Finance_SmartChurch_${new Date().toISOString().slice(0,10)}.xlsx`);
  }

  // 🚀 3. IMPRESSION REÇU POS (TICKET DE CAISSE THERMIQUE PROFESSIONNEL)
  printReceipt(d: any) {
    const printWindow = window.open('', '_blank', 'width=400,height=600');
    if (!printWindow) return;

    const culteInfo = d.culteNom ? `<b>Culte:</b> ${d.culteNom}` : `<b>Type:</b> Contribution Libre`;

    printWindow.document.write(`
      <html>
      <head>
        <title>Reçu de Caisse - Smart Church</title>
        <style>
          @page { size: 80mm auto; margin: 0; }
          body {
            font-family: 'Courier New', Courier, monospace;
            width: 74mm; padding: 3mm; margin: 0;
            font-size: 12px; color: #000; line-height: 1.4;
          }
          .text-center { text-align: center; }
          .header { font-size: 15px; font-weight: bold; margin-bottom: 2px; }
          .subtitle { font-size: 10px; text-transform: uppercase; margin-bottom: 15px; letter-spacing: 1px; }
          .divider { border-top: 1px dashed #000; margin: 10px 0; }
          .row { display: flex; justify-content: space-between; margin: 5px 0; }
          .amount-box {
            border: 1px solid #000; padding: 8px;
            text-align: center; font-size: 16px;
            font-weight: bold; margin: 15px 0;
          }
          .footer { font-size: 10px; margin-top: 20px; text-align: center; font-style: italic; }
        </style>
      </head>
      <body>
        <div class="text-center header">SMART CHURCH</div>
        <div class="text-center subtitle">Gestion des Offrandes & Dons</div>

        <div><b>Reçu N°:</b> SC-2026-${d.id}</div>
        <div><b>Date:</b> ${new Date(d.date).toLocaleDateString('fr-FR')}</div>
        <div><b>Mode:</b> ${d.operation}</div>
        <div class="divider"></div>

        <div><b>Donateur:</b> ${d.donateur}</div>
        <div>${culteInfo}</div>
        <div><b>Catégorie:</b> ${d.typeDon.toUpperCase()}</div>

        <div class="divider"></div>

        <div class="amount-box">
          NET PAYÉ : ${d.montant.toLocaleString()} ${d.devise === 'USD' ? 'USD' : 'CDF'}
        </div>

        <div class="divider"></div>
        <div class="footer">
          Que l'Éternel vous bénisse abondamment.<br>
          Merci pour votre contribution !
        </div>

        <script>
          window.onload = function() {
            window.print();
            setTimeout(function() { window.close(); }, 500);
          };
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  }
}
