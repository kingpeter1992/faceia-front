import {  CalendarEventType } from "../../features/activites/models/culte.model";
import { CALENDAR_COLORS } from "./calendar-colors";

export class CalendarUtils {

    static detectType(event: any): CalendarEventType {

        const nom = event.nom.toLowerCase();

        if (nom.includes("prière")) return CalendarEventType.PRIERE;

        if (nom.includes("enseignement")) return CalendarEventType.CULTE;

        if (nom.includes("jeunesse")) return CalendarEventType.JEUNESSE;

        if (nom.includes("conférence")) return CalendarEventType.CONFERENCE;

        if (nom.includes("mariage")) return CalendarEventType.MARIAGE;

        if (nom.includes("funérailles")) return CalendarEventType.FUNERAILLES;

        if (nom.includes("réunion")) return CalendarEventType.REUNION;

        return CalendarEventType.AUTRE;

    }

    static color(event: any): string {

        const type = this.detectType(event);

        return CALENDAR_COLORS[type];

    }

}
