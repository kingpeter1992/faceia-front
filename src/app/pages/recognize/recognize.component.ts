import { Component, ViewChild, ElementRef } from '@angular/core';
import { FaceService } from '../../services/face.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { PresenceService } from '../../services/PresenceService';


@Component({
  selector: 'app-recognize.component',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './recognize.component.html',
  styleUrl: './recognize.component.css',
})
export class RecognizeComponent {

  @ViewChild('video') video!: ElementRef;
  @ViewChild('canvas') canvas!: ElementRef;

  // ✅ NOM AFFICHÉ
  name = "";

  // ✅ LOGS
  logs: string[] = [];

  // ✅ PERSONNE DÉTECTÉE
  detectedPerson: any = null;

  // ✅ AFFICHER CARD
  showCard = false;

  // ✅ GESTION TIMER
  timeoutRef: any;

  // ✅ TRACKING
  lastId: number | null = null;

  // ✅ ANTI SPAM
  isProcessing = false;

  constructor(
    private faceService: FaceService,
    private presenceService: PresenceService
  ) {}

  ngOnInit() {
    this.startCamera();
    setTimeout(() => this.loop(), 1500);
  }

  // ✅ CAMERA
  startCamera() {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        this.video.nativeElement.srcObject = stream;
      });
  }

  // ✅ LOOP FLUIDE
  loop() {
    requestAnimationFrame(() => this.capture());
  }

  // ✅ CAPTURE
  capture() {

    if (this.isProcessing) return;

    this.isProcessing = true;

    const video = this.video.nativeElement;
    const canvas = this.canvas.nativeElement;
    const ctx = canvas.getContext('2d');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.drawImage(video, 0, 0);

    canvas.toBlob((blob: Blob) => {

      this.faceService.recognize(blob).subscribe(res => {

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(video, 0, 0);

        // ✅ CAS NON RECONNU
        if (!res) {

          this.name = "Inconnu ❌";

          this.detectedPerson = null;
          this.showCard = true;

          clearTimeout(this.timeoutRef);

          this.timeoutRef = setTimeout(() => {
            this.showCard = false;
          }, 3000);

          this.isProcessing = false;
          requestAnimationFrame(() => this.loop());
          return;
        }

        // ✅ rectangle
        ctx.strokeStyle = "#00ff88";
        ctx.lineWidth = 4;
        ctx.strokeRect(res.x, res.y, res.width, res.height);

        this.name = res.nom + " " + res.prenom;

        // ✅ SI NOUVEL UTILISATEUR
        if (res.id !== this.lastId) {

          this.lastId = res.id;

          // ✅ log
          this.logs.unshift(`✅ ${this.name} détecté`);

          // ✅ pointage
          this.presenceService.markPresence(res.id).subscribe();

          // ✅ afficher card
          this.detectedPerson = res;
          this.showCard = true;

          clearTimeout(this.timeoutRef);

          // ✅ auto hide (optionnel)
          this.timeoutRef = setTimeout(() => {
            this.showCard = false;
          }, 5000);
        }

        this.isProcessing = false;
        requestAnimationFrame(() => this.loop());

      });

    }, 'image/jpeg');
  }

  // ✅ BOUTON OK
  closeCard() {
    this.showCard = false;
    this.detectedPerson = null;
  }
}
