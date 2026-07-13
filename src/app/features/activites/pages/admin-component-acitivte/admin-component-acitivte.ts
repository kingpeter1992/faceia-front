import {  Component } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { DialogModule } from 'primeng/dialog';
import { ChurchCalendar } from '../church-calendar/church-calendar';



@Component({
  selector: 'app-admin-component-acitivte',
  standalone: true,
  imports: [FullCalendarModule,DialogModule,ChurchCalendar],
  templateUrl: './admin-component-acitivte.html',
  styleUrl: './admin-component-acitivte.css',
})
export class AdminComponentAcitivte {

}
