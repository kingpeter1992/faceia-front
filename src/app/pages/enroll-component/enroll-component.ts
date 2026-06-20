import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { environment } from '../../env';
import { FaceService } from '../../services/face.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-enroll-component',
  imports: [
          CommonModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule
  ],
  templateUrl: './enroll-component.html',
  styleUrl: './enroll-component.css',
})
export class EnrollComponent implements AfterViewInit {

  @ViewChild('video') video!: ElementRef;
  @ViewChild('canvas') canvas!: ElementRef;

  nom = '';
  prenom = '';
  age = 0;
  section = '';

  imageBlob!: Blob;
  preview: string | null = null;

  constructor(private faceService: FaceService) {}

  ngOnInit() {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        this.video.nativeElement.srcObject = stream;
      });
  }

  // ✅ CAPTURE UNIQUEMENT
  capture() {

  const video = this.video.nativeElement;
  const canvas = this.canvas.nativeElement;
  const ctx = canvas.getContext('2d');

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  // ✅ afficher image caméra
  ctx.drawImage(video, 0, 0);

  // ✅ AJOUT GUIDE VISAGE (RECTANGLE POINTILLÉ)
  const size = 200;
  const x = (canvas.width - size) / 2;
  const y = (canvas.height - size) / 2;

  ctx.strokeStyle = "#ff9800";
  ctx.lineWidth = 3;

  // ✅ pointillé
  ctx.setLineDash([8, 5]);

  ctx.strokeRect(x, y, size, size);

  ctx.setLineDash([]);

  // ✅ message guide
  ctx.fillStyle = "rgba(0,0,0,0.6)";
  ctx.fillRect(x, y - 30, size, 25);

  ctx.fillStyle = "#fff";
  ctx.font = "12px Arial";
  ctx.fillText("Placez votre visage ici", x + 10, y - 10);

  // ✅ capture image
  canvas.toBlob((blob: Blob) => {

    this.imageBlob = blob;
    this.preview = URL.createObjectURL(blob);

  }, 'image/jpeg');
}


ngAfterViewInit() {
  this.drawGuide();
}

drawGuide() {

  const video = this.video.nativeElement;
  const canvas = this.canvas.nativeElement;
  const ctx = canvas.getContext('2d');

  canvas.width = 640;
  canvas.height = 250;

  const draw = () => {

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const size = 200;
    const x = (canvas.width - size) / 2;
    const y = (canvas.height - size) / 2;

    ctx.strokeStyle = "#00ff88";
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 5]);

    ctx.strokeRect(x, y, size, size);

    ctx.setLineDash([]);

    requestAnimationFrame(draw);
  };

  draw();
}


  // ✅ ENREGISTREMENT
  register() {

    if (!this.imageBlob) return;

    const formData = new FormData();
    formData.append('file', this.imageBlob, 'face.jpg');
    formData.append('nom', this.nom);
    formData.append('prenom', this.prenom);
    formData.append('age', this.age.toString());
    formData.append('section', this.section);

    this.faceService.enroll(formData).subscribe({
      next: () => {
        alert("✅ Utilisateur enregistré !");
        this.reset();
      },
      error: err => console.error(err)
    });
  }

  reset() {
    this.preview = null;
    this.imageBlob = null!;
    this.nom = '';
    this.prenom = '';
  }
}
