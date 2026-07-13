
import { CalendarUtils } from "./calendar-utils";

export class CalendarMapper {

    static toFullCalendar(event: any): any {

        const color = CalendarUtils.color(event);

        return {

            id: event.id.toString(),

            title: event.nom,

            start: event.dateDebut,

            end: event.dateFin,

            backgroundColor: color,

            borderColor: color,

            textColor: "#ffffff",

            extendedProps: event

        };

    }

}
