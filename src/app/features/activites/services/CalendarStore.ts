import { Injectable, signal, computed, inject } from '@angular/core';
import { CulteService } from './CulteService';


@Injectable({
  providedIn: 'root'
})

export class CalendarStore {

  private service = inject(CulteService);

  private _events = signal<any[]>([]);

  private _loading = signal(false);

  private _loaded = signal(false);
  events = signal<any[]>([]);

  private _error = signal('');


  loading = computed(() => this._loading());

  error = computed(() => this._error());

  loadAllIfNeeded() {

    if (this._loaded()) {

      return;

    }

    this.loadAll();

  }

  loadAll() {

    this._loading.set(true);

    this.service.getAll().subscribe({

      next: (response) => {

        this._events.set(response.data);

        this._loaded.set(true);

        this._loading.set(false);

      },

      error: () => {

        this._loading.set(false);

        this._error.set("Erreur");

      }

    });

  }

}
