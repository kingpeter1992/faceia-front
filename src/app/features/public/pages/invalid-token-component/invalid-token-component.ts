import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-invalid-token-component',
 standalone:true,

imports:[

CommonModule,

MatIconModule,

MatButtonModule

],

  templateUrl: './invalid-token-component.html',
  styleUrl: './invalid-token-component.css',
})
export class InvalidTokenComponent {}
