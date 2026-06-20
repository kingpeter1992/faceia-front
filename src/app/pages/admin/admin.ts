import { Component, OnInit } from '@angular/core';
import { FaceService } from '../../services/face.service';
import { Router } from '@angular/router';

import { ChangeDetectorRef } from '@angular/core';

import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { PresenceService } from '../../services/PresenceService';

@Component({
  selector: 'app-admin',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,   // ✅ OBLIGATOIRE
  ],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})

export class Admin implements OnInit {


groupedPresences: any[] = [];
presences: any[] = [];
columns = ['image', 'nom', 'date'];
  constructor(private presenceService: PresenceService,
        private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.load();
  }



load() {
  this.presenceService.getAll().subscribe(data => {

    // ✅ grouper par date
    const grouped: any = {};

    data.forEach(p => {
      const date = new Date(p.timestamp).toLocaleDateString();

      if (!grouped[date]) {
        grouped[date] = {
          date: date,
          total: 0,
          items: [],
          open: false
        };
      }

      grouped[date].items.push(p);
      grouped[date].total++;
    });

    this.groupedPresences = Object.values(grouped);

    // tri par date DESC
    this.groupedPresences.sort((a: any, b: any) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    this.cd.detectChanges();
  });
}


}
