import { Injectable, signal, computed, ChangeDetectorRef } from "@angular/core";
import { CalendarApi, EventInput, EventClickArg, EventDropArg } from "@fullcalendar/core/index.js";
import { EventResizeDoneArg } from "@fullcalendar/interaction/index.js";
import { CulteStore } from "../../features/activites/services/CulteStore";
import { Router } from "@angular/router";

@Injectable({ providedIn: 'root' })
export class CalendarFacade {

  constructor(private culteStore: CulteStore,
    private router: Router,
  ) { }

  private calendarApi?: CalendarApi;

  setCalendar(api: CalendarApi) {
    this.calendarApi = api;
  }

  readonly dialogVisible = signal(false);
  readonly selectedEvent = signal<any | null>(null);

  readonly events = computed<EventInput[]>(() => {
    return this.culteStore.events().map(e => ({
      id: e.id,
      title: e.title,
      start: e.start,
      end: e.end,
      extendedProps: e
    }));
  });

  load() {
    this.culteStore.loadAllIfNeeded();
  }

  onEventClick(info: EventClickArg): void {
    const e = info.event;
    const data = {
      id: e.id,
      title: e.title,
      start: e.start,
      end: e.end,

      ...e.extendedProps // ✅ IMPORTANT
    };

    this.selectedEvent.set(data);

    console.log('Event clicked:', data);

    this.dialogVisible.set(true);
  }
  closeDialog() {
    this.dialogVisible.set(false);
    this.selectedEvent.set(null);
  }

  onEventDrop(info: EventDropArg) {
    console.log("DROP", info.event.id);
  }

  onEventResize(info: EventResizeDoneArg) {
    console.log("RESIZE", info.event.end);
  }

  previous() { this.calendarApi?.prev(); }
  next() { this.calendarApi?.next(); }
  today() { this.calendarApi?.today(); }

  month() { this.calendarApi?.changeView('dayGridMonth'); }
  week() { this.calendarApi?.changeView('timeGridWeek'); }
  day() { this.calendarApi?.changeView('timeGridDay'); }

  create() {
    this.router.navigate(['/activites/addculte']);

  }

  edit(event: any) {
    console.log("Modifier", event);
  }

  delete(event: any) {
    console.log("Supprimer", event);
  }

  getColor(theme: string): string {

    switch (theme) {

      case 'enseignement':
        return '#2563eb';

      case 'prière':
        return '#16a34a';

      case 'louange':
        return '#f59e0b';

      default:
        return '#64748b';
    }
  }

  getEventStyle(type: string) {
    switch (type) {
      case 'CULTE':
        return { color: '#2563eb', icon: 'pi pi-building' };

      case 'PRIERE':
        return { color: '#16a34a', icon: 'pi pi-heart-fill' };

      case 'ENSEIGNEMENT':
        return { color: '#f59e0b', icon: 'pi pi-book' };

      case 'JEUNESSE':
        return { color: '#ef4444', icon: 'pi pi-users' };

      default:
        return { color: '#64748b', icon: 'pi pi-calendar' };
    }
  }
  // 👇 OFFRANDE SIMPLE (IMPORTANT)
  openOffrande(event: any) {
    console.log('Open Offrande for', event);
    // soit navigation
    this.router.navigate(['/offrande', event.id]);
  }
}
