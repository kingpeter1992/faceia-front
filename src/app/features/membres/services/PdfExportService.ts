import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
import * as QRCode from 'qrcode';
import { QrResponse } from '../models/QrResponse';


@Injectable({ providedIn: 'root' })
export class PdfExportService {

  async exportQr(qr: QrResponse): Promise<void> {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [100, 150] // Format type "Ticket / Badge" Premium
    });

    // Encodage asynchrone direct du QR sans passer par le DOM
    const qrBuffer = await QRCode.toDataURL(qr.url, { errorCorrectionLevel: 'H', margin: 1 });

    // Design en-tête
    doc.setFillColor(33, 150, 243); // Bleu Primaire SmartChurch
    doc.rect(0, 0, 100, 20, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("SMART CHURCH ACCESS", 50, 12, { align: 'center' });

    // Contenu Métadonnées
    doc.setTextColor(50, 50, 50);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");

    doc.text(`Culte : ${qr.culte}`, 15, 32);
    doc.text(`Type d'accès : ${qr.type}`, 15, 40);
    doc.text(`Validité : ${qr.maxUse} Scan(s) Max`, 15, 48);

    // Ajout de l'image QR code générée
    doc.addImage(qrBuffer, 'PNG', 20, 58, 60, 60);

    // Footer de sécurité
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`Token : ${qr.token}`, 50, 132, { align: 'center' });
    doc.text(`Expire le : ${new Date(qr.expireAt).toLocaleString()}`, 50, 138, { align: 'center' });

    // Lancement du téléchargement
    doc.save(`Ticket_QR_${qr.culte.replace(/\s+/g, '_')}.pdf`);
  }
}
