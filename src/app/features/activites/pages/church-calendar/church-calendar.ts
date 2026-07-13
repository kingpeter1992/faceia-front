import { AfterViewInit, Component, effect, inject, Injector, OnInit, ViewChild } from '@angular/core';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventClickArg, EventDropArg, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { EventResizeDoneArg } from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { CulteStore } from '../../services/CulteStore';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { CalendarFacade } from '../../../../shared/calendar/calendar.facade';
import { CalendarToolbarComponent } from '../calendar-toolbar-component/calendar-toolbar-component';
import { EventDetailsDialogComponent } from '../event-details-dialog-component/event-details-dialog-component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs';

// 1. Ajoutez bien ces imports Angular Material tout en haut 🌟
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-church-calendar',
  standalone: true,

  imports: [
    CommonModule,
    FullCalendarModule,
    DialogModule,
    EventDetailsDialogComponent,
    CalendarToolbarComponent,
ReactiveFormsModule, // 👈 Indispensable pour [formControl]
    // 2. Ajoutez-les impérativement ici dans le tableau des imports 🚀
    MatFormFieldModule, // Débloque mat-form-field et mat-label
    MatInputModule,     // Débloque matInput
    MatIconModule,      // Débloque mat-icon

  ],
  templateUrl: './church-calendar.html',
  styleUrl: './church-calendar.css',
})

export class ChurchCalendar implements OnInit, AfterViewInit {

  @ViewChild('calendar') calendar!: FullCalendarComponent;

  // Champs de recherche réactifs
  searchCulteControl = new FormControl('');
  searchOrateurControl = new FormControl('');

  rawEvents: any[] = []; // Sauvegarde des événements originaux

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin],
    initialView: 'dayGridMonth',
    locale: 'fr',
    events: [],
    eventClick: (info) => {
      this.facade.onEventClick(info);
    }
  };

  constructor(public facade: CalendarFacade) {
    effect(() => {
      // Capture du signal provenant de la façade
      const events = this.facade.events();
      this.rawEvents = events ?? [];
      this.applyFilters();
    });
  }

  ngOnInit() {
    this.facade.load();

    // Écoute des changements sur les filtres de recherche avec un léger debounce
    this.searchCulteControl.valueChanges.pipe(debounceTime(200)).subscribe(() => this.applyFilters());
    this.searchOrateurControl.valueChanges.pipe(debounceTime(200)).subscribe(() => this.applyFilters());
  }

  ngAfterViewInit() {
    this.facade.setCalendar(this.calendar.getApi());
  }

  // Logique croisée de filtrage (Culte & Orateurs)
  applyFilters(): void {
    const culteQuery = (this.searchCulteControl.value ?? '').trim().toLowerCase();
    const orateurQuery = (this.searchOrateurControl.value ?? '').trim().toLowerCase();

    const filtered = this.rawEvents.filter(event => {
      const extendedProps = event.extendedProps || {};

      const matchCulte = !culteQuery ||
        (event.title && event.title.toLowerCase().includes(culteQuery)) ||
        (extendedProps.nom && extendedProps.nom.toLowerCase().includes(culteQuery)) ||
        (extendedProps.theme && extendedProps.theme.toLowerCase().includes(culteQuery));

      const matchOrateur = !orateurQuery ||
        (extendedProps.orateur && extendedProps.orateur.toLowerCase().includes(orateurQuery));

      return matchCulte && matchOrateur;
    });

    queueMicrotask(() => {
      const api = this.calendar?.getApi();
      if (!api) return;
      api.removeAllEvents();
      api.addEventSource(filtered);
    });
  }

}
