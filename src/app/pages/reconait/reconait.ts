import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { PresenceService } from '../../services/PresenceService';
import { FaceService } from '../../services/face.service';
import { BlobResponse, Personne } from '../model/personne';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-reconait',
  standalone: true,

  imports: [
    CommonModule
  ],
  templateUrl: './reconait.html',
  styleUrl: './reconait.css',
})
export class Reconait implements OnInit, OnDestroy, AfterViewInit  {
@ViewChild('video')
video?: ElementRef<HTMLVideoElement>;

@ViewChild('canvas')
canvas?: ElementRef<HTMLCanvasElement>;

  showModal = false;
  loadingPerson = false;
showCamera = true;
  detectedPerson: Personne | null = null;
  bloResponse: BlobResponse | null = null;

  lastId: number | null = null;
  message = '';

  stream: MediaStream | null = null;

  persons: Personne[] = [];

  isProcessing = false;
  isCameraReady = false;
  isDestroyed = false;

  constructor(
    private presenceService: PresenceService,
    private faceService: FaceService,
      private cdr: ChangeDetectorRef,
        private snackBar: MatSnackBar


  ) { }


  async  ngAfterViewInit() {
    await this.startCamera();

  }

  // =========================
  // INIT
  // =========================

  async ngOnInit(): Promise<void> {
    await this.loadAllPersons();
  }

  ngOnDestroy(): void {
    this.isDestroyed = true;
    this.stopCamera();
  }

  // =========================
  // LOAD PERSONS
  // =========================

  loadAllPersons(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.presenceService.getAllPersone().subscribe({
        next: (persons) => {
          this.persons = persons;
          console.log('Persons loaded:', persons);
          resolve();
        },

        error: (err) => {
          console.error(err);
          reject(err);
        }

      });

    });
  }

  // =========================
  // CAMERA
  // =========================

  async startCamera() {

  if (!this.video || !this.canvas) {
    console.warn('Video ou Canvas non disponible');
    return;
  }

  try {

    this.stopCamera();

    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: 640,
        height: 480,
        facingMode: 'user'
      },
      audio: false
    });

    this.stream = stream;

    const video = this.video.nativeElement;

    video.srcObject = stream;

    await new Promise(resolve => {
      video.onloadedmetadata = () => resolve(true);
    });

    await video.play();

    this.isCameraReady = true;

    this.loop();

  } catch (err) {
    console.error(err);
  }
}

  stopCamera() {

    if (this.stream) {

      this.stream.getTracks().forEach(track => {
        track.stop();
      });

      this.stream = null;
    }

    this.isCameraReady = false;
  }

  // =========================
  // LOOP
  // =========================

loop() {

  if (this.isDestroyed) return;

  if (!this.isCameraReady) return;

  this.capture();

  requestAnimationFrame(() => this.loop());
}

  // =========================
  // CAPTURE
  // =========================

  capture() {

    if (!this.isCameraReady) {
      return;
    }

    if (this.showModal) {
      return;
    }

    if (this.isProcessing) {
      return;
    }

    if (!this.video || !this.canvas) {
      console.warn('Video or canvas element unavailable');
      return;
    }

    const video = this.video.nativeElement;
    const canvas = this.canvas.nativeElement;

    if (!video.videoWidth || !video.videoHeight) {
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');

    if (!ctx) {
      return;
    }

    ctx.drawImage(
      video,
      0,
      0,
      canvas.width,
      canvas.height
    );

    this.isProcessing = true;

    canvas.toBlob((blob) => {

      if (!blob) {
        this.isProcessing = false;
        return;
      }

      this.faceService.recognize(blob).subscribe({

        next: (res: any) => {

          this.isProcessing = false;

          this.bloResponse = res

          console.log('Recognition:', this.bloResponse);

          if (!this.bloResponse?.id) {
            this.detectedPerson = null;
            this.message = '❌ Personne inconnue';
            return;
          }

          const person = this.persons.find(
            p => p.id === this.bloResponse?.id
          );

          if (!person) {
            this.detectedPerson = null;
           this.showMessage(
            '❌ Personne inconnue',
            'error-snackbar'
          );
            return;
          }

          this.detectedPerson = person;
          console.log('detectedPerson=', this.detectedPerson);
          console.log('show card=', !!this.detectedPerson);
          this.lastId = person.id;

          this.showCamera = false; // cache caméra

          console.log('✅ Person detected:', this.detectedPerson);
          // 🔥 stop camera after detection

          this.showMessage(
            `✅ ${person.nom} ${person.prenom} détecté`
          );
          this.stopCamera();
          this.cdr.detectChanges();
        },

        error: (err) => {
          console.error(err);
            this.showMessage(
          '❌ Erreur lors de detection',
          'error-snackbar'
        );
          this.isProcessing = false;
        }

      });

    }, 'image/jpeg', 0.8);
  }

  // =========================
  // PRESENCE
  // =========================

  confirmPresence() {

    if (!this.detectedPerson) {
      return;
    }

    this.presenceService
      .markPresence(this.detectedPerson.id)
      .subscribe({
        next: () => {
          console.log(
            'Presence confirmed:',
            this.detectedPerson?.nom
          );
          this.lastId = this.detectedPerson!.id;
            this.showMessage(
          `✅ Présence confirmée pour ${this.detectedPerson?.nom}`
        );
          this.closeModal();
        },
        error: (err) => {
          console.error(err);
            this.showMessage(
          '❌ Erreur lors de l’enregistrement',
          'error-snackbar'
        );
        }

      });
  }

  // =========================
  // CLOSE MODAL
  // =========================

  async closeModal() {

    this.showModal = false;
    this.detectedPerson = null;
    this.message = '';
      this.showCamera = true; // réaffiche caméra

    await this.startCamera();
  }



  showMessage(
  message: string,
  panelClass: string = 'success-snackbar'
) {

  this.snackBar.open(message, 'Fermer', {
    duration: 3000,
    horizontalPosition: 'right',
    verticalPosition: 'top',
    panelClass: [panelClass]
  });

}
}
