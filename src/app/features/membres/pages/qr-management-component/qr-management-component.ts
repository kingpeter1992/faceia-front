import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { QrResponse } from '../../models/QrResponse';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-qr-management-component',
standalone: true,
  imports: [CommonModule, TableModule, TagModule, CardModule], // 👈 Ajouter ici
  templateUrl: './qr-management-component.html',
  styleUrl: './qr-management-component.css',
})
export class QrManagementComponent implements OnInit {


constructor(
){}
  ngOnInit(): void {
  }



}
