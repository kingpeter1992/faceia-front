import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-calendar-toolbar-component',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule
  ],
  templateUrl: './calendar-toolbar-component.html',
  styleUrl: './calendar-toolbar-component.css',
})
export class CalendarToolbarComponent {
   @Output() previous = new EventEmitter<void>();

  @Output() next = new EventEmitter<void>();

  @Output() today = new EventEmitter<void>();

  @Output() month = new EventEmitter<void>();

  @Output() week = new EventEmitter<void>();

  @Output() day = new EventEmitter<void>();

  @Output() create = new EventEmitter<void>();
}
