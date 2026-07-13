import { Injectable, inject } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { map, Observable } from 'rxjs';
import { environment } from '../../../env';
import { CalendarMapper } from '../../../shared/calendar/calendar-mapper';



@Injectable({
    providedIn: 'root'
})
export class CalendarService {

    private http = inject(HttpClient);
    private api = environment.BASIC_URL + 'cultes';


    getAll(): Observable<any[]> {
        return this.http.get<any>(this.api + "/liste")
            .pipe(
                map(response =>
                    response.data.map((e: any) =>
                        CalendarMapper.toFullCalendar(e)
                    )
                )
            );
    }

}
